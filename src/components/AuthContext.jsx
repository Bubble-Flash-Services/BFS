import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProfile } from '../api/auth';

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

  const refreshUserData = async () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const response = await getProfile(storedToken);
        if (response && !response.error) {
          setUser(response);
          localStorage.setItem('user', JSON.stringify(response));
        }
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
    }
  };

  useEffect(() => {
    async function initializeAuth() {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken) {
        try {
          // First, use stored user data for immediate display if available
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
          }
          setToken(storedToken);
          
          // Then fetch fresh data from server
          const response = await getProfile(storedToken);
          if (response && !response.error) {
            setUser(response);
            localStorage.setItem('user', JSON.stringify(response));
          } else {
            // If token is invalid, logout
            logout();
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          // If there's an error fetching from server, still use cached data
          if (storedUser) {
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
    <AuthContext.Provider value={{ user, setUser, token, setToken, loading, logout, updateAuth, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
