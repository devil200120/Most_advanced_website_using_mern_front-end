// File: c:\Users\KIIT0001\Desktop\exam_site\frontend\src\context\NotificationContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiCall, endpoints } from '../services/api';
import { useAuth } from './AuthContext';

// Initial state
const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_AS_READ: 'MARK_AS_READ',
  MARK_ALL_AS_READ: 'MARK_ALL_AS_READ',
  DELETE_NOTIFICATION: 'DELETE_NOTIFICATION',
  SET_UNREAD_COUNT: 'SET_UNREAD_COUNT',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
const notificationReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    
    case ActionTypes.SET_NOTIFICATIONS:
      return { 
        ...state, 
        notifications: action.payload.notifications,
        unreadCount: action.payload.unreadCount,
        isLoading: false 
      };
    
    case ActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1
      };
    
    case ActionTypes.MARK_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification._id === action.payload
            ? { ...notification, isRead: true, readAt: new Date() }
            : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      };
    
    case ActionTypes.MARK_ALL_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification => ({
          ...notification,
          isRead: true,
          readAt: new Date()
        })),
        unreadCount: 0
      };
    
    case ActionTypes.DELETE_NOTIFICATION:
      const deletedNotification = state.notifications.find(n => n._id === action.payload);
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification._id !== action.payload),
        unreadCount: deletedNotification && !deletedNotification.isRead 
          ? Math.max(0, state.unreadCount - 1) 
          : state.unreadCount
      };
    
    case ActionTypes.SET_UNREAD_COUNT:
      return { ...state, unreadCount: action.payload };
    
    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    
    default:
      return state;
  }
};

// Create context
const NotificationContext = createContext();

// Notification provider component
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  // Fetch notifications when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchNotifications();
    }
  }, [isAuthenticated, user]);

  // Fetch notifications
  const fetchNotifications = async (params = {}) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });

      const response = await apiCall('GET', endpoints.notifications.getAll, null, { params });

      if (response.success) {
        dispatch({
          type: ActionTypes.SET_NOTIFICATIONS,
          payload: {
            notifications: response.data.notifications,
            unreadCount: response.data.unreadCount
          }
        });
      }
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: error.response?.data?.message || 'Failed to fetch notifications'
      });
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await apiCall('PUT', endpoints.notifications.markAsRead(notificationId));

      if (response.success) {
        dispatch({ type: ActionTypes.MARK_AS_READ, payload: notificationId });
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const response = await apiCall('PUT', endpoints.notifications.markAllAsRead);

      if (response.success) {
        dispatch({ type: ActionTypes.MARK_ALL_AS_READ });
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      const response = await apiCall('DELETE', endpoints.notifications.delete(notificationId));

      if (response.success) {
        dispatch({ type: ActionTypes.DELETE_NOTIFICATION, payload: notificationId });
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  // Add new notification (for real-time updates)
  const addNotification = (notification) => {
    dispatch({ type: ActionTypes.ADD_NOTIFICATION, payload: notification });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  };

  const value = {
    ...state,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    clearError
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;