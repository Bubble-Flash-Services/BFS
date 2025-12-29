import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import SigninModal from '../pages/Homepage/signin/SigninModal';
import SignupModal from '../pages/Homepage/signup/SignupModal';
import toast from 'react-hot-toast';

/**
 * ProtectedRoute - Ensures only logged-in users can access certain routes
 * If user is not logged in, redirects to homepage
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [hasShownToast, setHasShownToast] = useState(false);

  // Show toast message when user is not authenticated
  useEffect(() => {
    if (!loading && !user && !hasShownToast) {
      toast.error('Please login to access this service');
      setHasShownToast(true);
    }
  }, [user, loading, hasShownToast]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, redirect to home page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated, render the protected content
  return children;
};

export default ProtectedRoute;
