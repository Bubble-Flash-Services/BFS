import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../api/auth';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateAuth = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
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
        logout();
        return;
      }

      try {
        const response = await getProfile(storedToken);
        if (response && !response.error && response.success !== false) {
          setUser(response);
          localStorage.setItem('user', JSON.stringify(response));
        } else {
          // Token is invalid or user not found
          logout();
        }
      } catch (error) {
        console.error('Error refreshing user data:', error);
        // If it's a 401 error, the token is expired
        if (error.status === 401 || error.message?.includes('401')) {
          logout();
        }
      }
    }
  };

  useEffect(() => {
    async function initializeAuth() {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken) {
        // Check if token is expired
        if (isTokenExpired(storedToken)) {
          console.log('Stored token is expired, logging out');
          logout();
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
          } else {
            // If token is invalid, logout
            console.log('Invalid token response, logging out');
            logout();
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          // Check if it's a 401 or token expired error
          if (error.status === 401 || error.message?.includes('401') || error.message?.includes('expired')) {
            console.log('Token expired or invalid, logging out');
            logout();
          } else if (storedUser) {
            // If there's another error, use cached data temporarily
            try {
              const userData = JSON.parse(storedUser);
              setUser(userData);
            } catch (parseError) {
              console.error('Error parsing stored user data:', parseError);
              logout();
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
