import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import SigninModal from '../pages/Homepage/signin/SigninModal';
import SignupModal from '../pages/Homepage/signup/SignupModal';
import toast from 'react-hot-toast';

/**
 * ProtectedRoute - Ensures only logged-in users can access certain routes
 * If user is not logged in, shows a login modal instead of redirecting
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [openSignin, setOpenSignin] = useState(false);
  const [openSignup, setOpenSignup] = useState(false);

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

  // If user is not logged in, show login prompt
  if (!user) {
    // Show toast message
    if (!openSignin && !openSignup) {
      toast.error('Please login to access this service');
      setTimeout(() => setOpenSignin(true), 100);
    }

    return (
      <>
        {/* Redirect to home page */}
        <Navigate to="/" replace />
        
        {/* Show login/signup modals */}
        <SigninModal
          open={openSignin}
          onClose={() => setOpenSignin(false)}
          onSignupNow={() => {
            setOpenSignin(false);
            setOpenSignup(true);
          }}
        />
        <SignupModal
          open={openSignup}
          onClose={() => setOpenSignup(false)}
          onLoginNow={() => {
            setOpenSignup(false);
            setOpenSignin(true);
          }}
        />
      </>
    );
  }

  // User is authenticated, render the protected content
  return children;
};

export default ProtectedRoute;
