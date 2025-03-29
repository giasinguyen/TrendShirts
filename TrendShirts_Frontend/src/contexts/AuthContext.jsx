import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService, logout as logoutService, getCurrentUser, register as registerService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        const currentUser = getCurrentUser();
        console.log("Current user from storage:", currentUser);
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      console.log("Login attempt with:", credentials);
      const data = await loginService(credentials);
      console.log("Login response:", data);
      
      // Kiểm tra token và roles
      if (!data.token) {
        console.error("No token in response");
        return;
      }
      
      if (!data.roles || data.roles.length === 0) {
        console.warn("No roles in response:", data);
      }
      
      setUser(data);
      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  const register = async (userData) => {
    try {
      return await registerService(userData);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};