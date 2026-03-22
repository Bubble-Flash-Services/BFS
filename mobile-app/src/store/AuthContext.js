import React, {createContext, useContext, useState, useEffect} from 'react';
import {getStoredUser, logout as authLogout} from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const stored = await getStoredUser();
      if (stored) {
        setUser(stored.user);
        setToken(stored.token);
      }
    } catch (err) {
      // No stored session
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
  };

  const logout = async () => {
    await authLogout();
    setUser(null);
    setToken(null);
  };

  const updateUser = (updatedData) => {
    setUser(prev => ({...prev, ...updatedData}));
  };

  return (
    <AuthContext.Provider
      value={{user, token, isLoading, isAuthenticated: !!user, login, logout, updateUser}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return ctx;
};

export default AuthContext;
