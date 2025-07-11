// File: c:\Users\KIIT0001\Desktop\exam_site\frontend\src\context\AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiCall, endpoints } from '../services/api';
import { toast } from 'react-toastify';

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Action types
const ActionTypes = {
  AUTH_START: 'AUTH_START',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_FAILURE: 'AUTH_FAILURE',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.AUTH_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    
    case ActionTypes.AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    
    case ActionTypes.AUTH_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    
    case ActionTypes.LOGOUT:
      return {
        ...initialState,
        isLoading: false
      };
    
    case ActionTypes.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    
    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth on app load
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (token && user) {
        // Verify token with backend
        const response = await apiCall('GET', endpoints.auth.me);
        
        if (response.success) {
          dispatch({
            type: ActionTypes.AUTH_SUCCESS,
            payload: {
              user: response.data.user,
              token: token
            }
          });
        } else {
          // Invalid token, clear localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          dispatch({ type: ActionTypes.LOGOUT });
        }
      } else {
        dispatch({ type: ActionTypes.LOGOUT });
      }
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch({ type: ActionTypes.LOGOUT });
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      dispatch({ type: ActionTypes.AUTH_START });

      const response = await apiCall('POST', endpoints.auth.login, {
        email,
        password
      });

      if (response.success) {
        const { user, accessToken } = response.data;
        
        // Store in localStorage
        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(user));

        dispatch({
          type: ActionTypes.AUTH_SUCCESS,
          payload: {
            user: user,
            token: accessToken
          }
        });

        toast.success('Login successful!');
        return { success: true };
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({
        type: ActionTypes.AUTH_FAILURE,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: ActionTypes.AUTH_START });

      const response = await apiCall('POST', endpoints.auth.register, userData);

      if (response.success) {
        toast.success('Registration successful! Please check your email for verification.');
        dispatch({ type: ActionTypes.CLEAR_ERROR });
        return { success: true };
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({
        type: ActionTypes.AUTH_FAILURE,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: ActionTypes.LOGOUT });
    toast.success('Logged out successfully');
  };

  // Update user profile
  const updateUser = (userData) => {
    const updatedUser = { ...state.user, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    dispatch({
      type: ActionTypes.UPDATE_USER,
      payload: userData
    });
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      const response = await apiCall('POST', endpoints.auth.forgotPassword, { email });
      
      if (response.success) {
        toast.success('Password reset email sent!');
        return { success: true };
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send reset email';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Reset password
  const resetPassword = async (token, password) => {
    try {
      const response = await apiCall('POST', endpoints.auth.resetPassword, {
        token,
        password
      });
      
      if (response.success) {
        toast.success('Password reset successful!');
        return { success: true };
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password reset failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Verify email
  const verifyEmail = async (token) => {
    try {
      const response = await apiCall('POST', endpoints.auth.verifyEmail, { token });
      
      if (response.success) {
        toast.success('Email verified successfully!');
        return { success: true };
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Email verification failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await apiCall('POST', endpoints.auth.changePassword, {
        currentPassword,
        newPassword
      });
      
      if (response.success) {
        toast.success('Password changed successfully!');
        return { success: true };
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password change failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Check if user has specific role
  const hasRole = (roles) => {
    if (!state.user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(state.user.role);
    }
    return state.user.role === roles;
  };

  // Clear errors
  const clearError = () => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    forgotPassword,
    resetPassword,
    verifyEmail,
    changePassword,
    hasRole,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;