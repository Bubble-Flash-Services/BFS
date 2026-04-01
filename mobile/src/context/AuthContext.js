import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { getProfile } from '../api/auth';

const AuthContext = createContext(null);

// Buffer in seconds before token expiry to trigger logout (5 minutes)
const TOKEN_EXPIRY_BUFFER_SECONDS = 300;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [adminToken, setAdminToken] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [employeeToken, setEmployeeToken] = useState(null);
  const [employeeUser, setEmployeeUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ─── Helpers ───────────────────────────────────────────────────────────────

  const isTokenExpired = (tkn) => {
    if (!tkn) return true;
    try {
      const decoded = jwtDecode(tkn);
      // 5-minute buffer
      return decoded.exp < Date.now() / 1000 + TOKEN_EXPIRY_BUFFER_SECONDS;
    } catch {
      return true;
    }
  };

  // ─── User Auth ────────────────────────────────────────────────────────────

  const updateAuth = async (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    await AsyncStorage.setItem('token', newToken);
    await AsyncStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.multiRemove(['token', 'user']);
  };

  const refreshUserData = async () => {
    const storedToken = await AsyncStorage.getItem('token');
    if (!storedToken || isTokenExpired(storedToken)) {
      await logout();
      return;
    }
    try {
      const response = await getProfile(storedToken);
      if (response && !response.error) {
        setUser(response);
        await AsyncStorage.setItem('user', JSON.stringify(response));
      } else {
        await logout();
      }
    } catch (err) {
      if (err?.status === 401) await logout();
    }
  };

  // ─── Admin Auth ───────────────────────────────────────────────────────────

  const adminLogin = async (tkn, adminData) => {
    setAdminToken(tkn);
    setAdminUser(adminData);
    await AsyncStorage.setItem('adminToken', tkn);
    await AsyncStorage.setItem('adminUser', JSON.stringify(adminData));
  };

  const adminLogout = async () => {
    setAdminToken(null);
    setAdminUser(null);
    await AsyncStorage.multiRemove(['adminToken', 'adminUser']);
  };

  // ─── Employee Auth ────────────────────────────────────────────────────────

  const empLogin = async (tkn, empData) => {
    setEmployeeToken(tkn);
    setEmployeeUser(empData);
    await AsyncStorage.setItem('employeeToken', tkn);
    await AsyncStorage.setItem('employeeUser', JSON.stringify(empData));
  };

  const empLogout = async () => {
    setEmployeeToken(null);
    setEmployeeUser(null);
    await AsyncStorage.multiRemove(['employeeToken', 'employeeUser']);
  };

  // ─── Initialize on mount ──────────────────────────────────────────────────

  useEffect(() => {
    const init = async () => {
      try {
        // User session
        const [storedToken, storedUser] = await AsyncStorage.multiGet(['token', 'user']);
        const tkn = storedToken[1];
        const usr = storedUser[1];

        if (tkn && !isTokenExpired(tkn)) {
          setToken(tkn);
          if (usr) {
            setUser(JSON.parse(usr));
          }
          // Fetch fresh profile in background
          try {
            const fresh = await getProfile(tkn);
            if (fresh && !fresh.error) {
              setUser(fresh);
              await AsyncStorage.setItem('user', JSON.stringify(fresh));
            }
          } catch {
            // Use cached data
          }
        } else if (tkn) {
          // Token expired
          await AsyncStorage.multiRemove(['token', 'user']);
        }

        // Admin session
        const [adminTkn, adminUsr] = await AsyncStorage.multiGet(['adminToken', 'adminUser']);
        if (adminTkn[1] && !isTokenExpired(adminTkn[1])) {
          setAdminToken(adminTkn[1]);
          if (adminUsr[1]) setAdminUser(JSON.parse(adminUsr[1]));
        }

        // Employee session
        const [empTkn, empUsr] = await AsyncStorage.multiGet(['employeeToken', 'employeeUser']);
        if (empTkn[1] && !isTokenExpired(empTkn[1])) {
          setEmployeeToken(empTkn[1]);
          if (empUsr[1]) setEmployeeUser(JSON.parse(empUsr[1]));
        }
      } catch (err) {
        console.error('Auth init error:', err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        // User
        user,
        token,
        loading,
        updateAuth,
        logout,
        refreshUserData,
        isTokenExpired,
        isAuthenticated: !!token && !isTokenExpired(token),
        // Admin
        adminToken,
        adminUser,
        adminLogin,
        adminLogout,
        isAdmin: !!adminToken && !isTokenExpired(adminToken),
        // Employee
        employeeToken,
        employeeUser,
        empLogin,
        empLogout,
        isEmployee: !!employeeToken && !isTokenExpired(employeeToken),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
