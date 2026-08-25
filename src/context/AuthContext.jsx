import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, setAccessToken } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch (err) {
      // ignore errors during logout API call
    }
    setToken(null);
    setUser(null);
    setAccessToken(null);
  }, []);

  useEffect(() => {
    const handleAuthExpired = () => {
      setToken(null);
      setUser(null);
    };
    window.addEventListener('auth-expired', handleAuthExpired);

    // On mount, try to get user. If access token is missing, fetchWithAuth
    // will attempt to use the refresh token automatically.
    api.getMe()
      .then((fetchedUser) => {
        if (fetchedUser) {
          setUser(fetchedUser);
          // Set a dummy token to indicate authenticated state in the UI if needed
          setToken('active-session');
        } else {
          setToken(null);
          setUser(null);
        }
      })
      .catch(() => {
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => window.removeEventListener('auth-expired', handleAuthExpired);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.login(email, password);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      setToken(null);
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, phone = '', address = '', otp = '') => {
    setLoading(true);
    try {
      const data = await api.register(name, email, password, phone, address, otp);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      setToken(null);
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    isAdmin: user ? user.role === 'admin' : false
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
