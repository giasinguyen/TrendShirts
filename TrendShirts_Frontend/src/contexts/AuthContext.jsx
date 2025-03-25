import React, { createContext, useState, useContext } from 'react';

// Create the auth context
const AuthContext = createContext(null);

// Hook for child components to get the auth object
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps your app and makes auth object available to any
// child component that calls useAuth().
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    try {
      // This would normally be an API call to your backend
      // For demo purposes, we'll just simulate a successful login
      const userData = { id: 1, name: 'User', email };
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
  };

  // Register function
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      // This would normally be an API call to your backend
      const userData = { id: 1, name, email };
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}