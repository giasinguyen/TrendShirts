import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check local storage for user on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Mock login function
  const login = (email, password) => {
    // In a real app, this would call an API
    const user = { id: 1, email, name: 'Test User' };
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    return Promise.resolve(user);
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
    return Promise.resolve();
  };

  // Register function
  const register = (email, password, name) => {
    // In a real app, this would call an API
    const user = { id: Date.now(), email, name };
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    return Promise.resolve(user);
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};