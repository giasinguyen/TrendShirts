import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // If auth is still loading, show a loading spinner
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If requiredRole is specified, check if user has that role
  if (requiredRole && (!user?.roles || !user.roles.includes(requiredRole))) {
    return <Navigate to="/" replace />;
  }

  // If authenticated and has required role (if any), render children
  return children;
};

export default ProtectedRoute;