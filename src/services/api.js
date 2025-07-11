// File: c:\Users\KIIT0001\Desktop\exam_site\frontend\src\services\api.js
import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response) {
      switch (response.status) {
        case 401:
          // Unauthorized - redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          toast.error('Session expired. Please login again.');
          break;
        case 403:
          toast.error('Access denied. You do not have permission.');
          break;
        case 404:
          toast.error('Resource not found.');
          break;
        case 429:
          toast.error('Too many requests. Please try again later.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          if (response.data?.message) {
            toast.error(response.data.message);
          } else {
            toast.error('An error occurred. Please try again.');
          }
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error('An unexpected error occurred.');
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Auth endpoints
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/auth/me',
    refreshToken: '/auth/refresh-token',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
    changePassword: '/auth/change-password'
  },
  
  // User endpoints
  users: {
    getAll: '/users',
    getById: (id) => `/users/${id}`,
    updateProfile: '/users/profile',
    delete: (id) => `/users/${id}`,
    getStudents: '/users/students/list',
    linkParent: '/users/link-parent',
    updatePreferences: '/users/preferences'
  },
  
  // Exam endpoints
  exams: {
    getAll: '/exams',
    getById: (id) => `/exams/${id}`,
    create: '/exams',
    update: (id) => `/exams/${id}`,
    delete: (id) => `/exams/${id}`,
    addQuestions: (id) => `/exams/${id}/questions`,
    publish: (id) => `/exams/${id}/publish`,
    getStats: (id) => `/exams/${id}/stats`
  },
  
  // Question endpoints
  questions: {
    getAll: '/questions',
    getById: (id) => `/questions/${id}`,
    create: '/questions',
    update: (id) => `/questions/${id}`,
    delete: (id) => `/questions/${id}`,
    bulkCreate: '/questions/bulk',
    getStats: (id) => `/questions/${id}/stats`
  },
  
  // Submission endpoints
  submissions: {
    start: '/submissions/start',
    submitAnswer: '/submissions/answer',
    submit: '/submissions/submit',
    getAll: '/submissions',
    getById: (id) => `/submissions/${id}`,
    grade: (id) => `/submissions/${id}/grade`
  },
  
  // Payment endpoints
  payments: {
    createStripeIntent: '/payments/stripe/create-intent',
    createRazorpayOrder: '/payments/razorpay/create-order',
    confirm: '/payments/confirm',
    getHistory: '/payments/history',
    getById: (id) => `/payments/${id}`,
    refund: (id) => `/payments/${id}/refund`
  },
  
  // Notification endpoints
  notifications: {
    getAll: '/notifications',
    create: '/notifications',
    markAsRead: (id) => `/notifications/${id}/read`,
    markAllAsRead: '/notifications/read-all',
    delete: (id) => `/notifications/${id}`,
    sendSystem: '/notifications/system',
    getStats: '/notifications/stats'
  },
  
  // Report endpoints
  reports: {
    examPerformance: (examId) => `/reports/exam/${examId}/performance`,
    studentProgress: (studentId) => `/reports/student/${studentId}/progress`,
    classPerformance: (grade, section) => `/reports/class/${grade}/${section}`,
    questionAnalysis: (questionId) => `/reports/question/${questionId}/analysis`,
    systemOverview: '/reports/system/overview'
  },
  
  // Settings endpoints
  settings: {
    getAll: '/settings',
    getByKey: (key) => `/settings/${key}`,
    create: '/settings',
    update: (key) => `/settings/${key}`,
    delete: (key) => `/settings/${key}`,
    getByCategory: (category) => `/settings/category/${category}`,
    bulkUpdate: '/settings/bulk'
  }
};

// Helper functions
export const apiCall = async (method, url, data = null, config = {}) => {
  try {
    const response = await api({
      method,
      url,
      data,
      ...config
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// File upload helper
export const uploadFile = async (endpoint, file, onProgress = null) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };
  
  if (onProgress) {
    config.onUploadProgress = (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      onProgress(percentCompleted);
    };
  }
  
  return apiCall('POST', endpoint, formData, config);
};

// Batch requests helper
export const batchRequests = async (requests) => {
  try {
    const responses = await Promise.allSettled(requests);
    return responses;
  } catch (error) {
    throw error;
  }
};

export default api;