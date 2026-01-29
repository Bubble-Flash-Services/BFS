import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../api/auth';
import { jwtDecode } from 'jwt-decode';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Also clear from Capacitor Preferences on native platforms
    if (Capacitor.isNativePlatform()) {
      try {
        await Preferences.remove({ key: 'auth_token' });
        await Preferences.remove({ key: 'user_profile' });
        console.log('✅ Cleared auth data from Capacitor Preferences');
      } catch (error) {
        console.error('Error clearing Capacitor Preferences:', error);
      }
    }
  };

  const updateAuth = async (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    // Also store in Capacitor Preferences on native platforms
    if (Capacitor.isNativePlatform()) {
      try {
        await Preferences.set({ key: 'auth_token', value: newToken });
        await Preferences.set({ key: 'user_profile', value: JSON.stringify(newUser) });
        console.log('✅ Synced auth data to Capacitor Preferences');
      } catch (error) {
        console.error('Error syncing to Capacitor Preferences:', error);
      }
    }
  };

  // Check if token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert to seconds
      
      // Check if token is expired (with 5 minute buffer)
      return decoded.exp < (currentTime + 300);
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  };

  const refreshUserData = async () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      // Check if token is expired before making request
      if (isTokenExpired(storedToken)) {
        console.log('Token expired, logging out');
        await logout();
        return;
      }

      try {
        const response = await getProfile(storedToken);
        if (response && !response.error && response.success !== false) {
          setUser(response);
          localStorage.setItem('user', JSON.stringify(response));
          
          // Also sync to Capacitor Preferences on native platforms
          if (Capacitor.isNativePlatform()) {
            try {
              await Preferences.set({ key: 'user_profile', value: JSON.stringify(response) });
            } catch (error) {
              console.error('Error syncing user profile to Capacitor Preferences:', error);
            }
          }
        } else {
          // Token is invalid or user not found
          await logout();
        }
      } catch (error) {
        console.error('Error refreshing user data:', error);
        // If it's a 401 error, the token is expired
        if (error.status === 401 || error.message?.includes('401')) {
          await logout();
        }
      }
    }
  };

  useEffect(() => {
    async function initializeAuth() {
      let storedToken = localStorage.getItem('token');
      let storedUser = localStorage.getItem('user');
      
      // On native platforms, check Capacitor Preferences first (for deep link scenarios)
      if (Capacitor.isNativePlatform()) {
        try {
          console.log('📱 Checking Capacitor Preferences for auth data...');
          const prefToken = await Preferences.get({ key: 'auth_token' });
          const prefUser = await Preferences.get({ key: 'user_profile' });
          
          // Bidirectional sync: sync between localStorage and Capacitor Preferences
          if (prefToken?.value && !storedToken) {
            // Case 1: Token in Preferences but not in localStorage (deep link scenario)
            console.log('✅ Found token in Capacitor Preferences, syncing to localStorage');
            storedToken = prefToken.value;
            localStorage.setItem('token', storedToken);
            
            if (prefUser?.value) {
              storedUser = prefUser.value;
              localStorage.setItem('user', storedUser);
            }
          } else if (storedToken && !prefToken?.value) {
            // Case 2: Token in localStorage but not in Preferences (web login scenario)
            console.log('✅ Found token in localStorage, syncing to Capacitor Preferences');
            await Preferences.set({ key: 'auth_token', value: storedToken });
            
            if (storedUser) {
              await Preferences.set({ key: 'user_profile', value: storedUser });
            }
          }
        } catch (error) {
          console.error('Error syncing between localStorage and Capacitor Preferences:', error);
        }
      }
      
      if (storedToken) {
        // Check if token is expired
        if (isTokenExpired(storedToken)) {
          console.log('Stored token is expired, logging out');
          await logout();
          setLoading(false);
          return;
        }

        try {
          // First, use stored user data for immediate display if available
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
          }
          setToken(storedToken);
          
          // Then fetch fresh data from server
          const response = await getProfile(storedToken);
          if (response && !response.error && response.success !== false) {
            setUser(response);
            localStorage.setItem('user', JSON.stringify(response));
            
            // Also sync to Capacitor Preferences on native platforms
            if (Capacitor.isNativePlatform()) {
              try {
                await Preferences.set({ key: 'user_profile', value: JSON.stringify(response) });
              } catch (error) {
                console.error('Error syncing user profile to Capacitor Preferences:', error);
              }
            }
          } else {
            // If token is invalid, logout
            console.log('Invalid token response, logging out');
            await logout();
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          // Check if it's a 401 or token expired error
          if (error.status === 401 || error.message?.includes('401') || error.message?.includes('expired')) {
            console.log('Token expired or invalid, logging out');
            await logout();
          } else if (storedUser) {
            // If there's another error, use cached data temporarily
            try {
              const userData = JSON.parse(storedUser);
              setUser(userData);
            } catch (parseError) {
              console.error('Error parsing stored user data:', parseError);
              await logout();
            }
          }
        }
      }
      
      setLoading(false);
    }
    
    initializeAuth();
  }, []); // Only run once on mount

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, loading, logout, updateAuth, refreshUserData, isTokenExpired }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
