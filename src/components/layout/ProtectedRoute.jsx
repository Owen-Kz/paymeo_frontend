// src/components/layout/ProtectedRoute.jsx
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { showToast } from '../../utils/helpers';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Check if token exists but user is null (indicating invalid token)
    const token = localStorage.getItem('_t');
    if (token && !loading && !currentUser) {
      console.log('Token exists but no user, likely invalid token');
      showToast('Your session has expired. Please login again.', 'error');
      logout();
    }
  }, [currentUser, loading, logout]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return currentUser ? children : <Navigate to="/login" replace state={{ from: location }} />;
};

export default ProtectedRoute;