// File: c:\Users\KIIT0001\Desktop\exam_site\frontend\src\components\ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';
import { Box, Alert, Button } from '@mui/material';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return <Loading />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user's email is verified
  if (user && !user.isVerified) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="60vh"
        px={2}
      >
        <Alert 
          severity="warning" 
          sx={{ maxWidth: 500 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={() => window.location.href = '/verify-email'}
            >
              Verify Now
            </Button>
          }
        >
          Please verify your email address to access this page. Check your inbox for the verification email.
        </Alert>
      </Box>
    );
  }

  // Check role-based access
  if (roles.length > 0 && user) {
    const hasRequiredRole = roles.includes(user.role);
    
    if (!hasRequiredRole) {
      return (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="60vh"
          px={2}
        >
          <Alert severity="error" sx={{ maxWidth: 500 }}>
            Access denied. You don't have permission to view this page.
          </Alert>
        </Box>
      );
    }
  }

  // Check if user account is active
  if (user && !user.isActive) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="60vh"
        px={2}
      >
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          Your account has been deactivated. Please contact support for assistance.
        </Alert>
      </Box>
    );
  }

  return children;
};

export default ProtectedRoute;