// File: c:\Users\KIIT0001\Desktop\exam_site\frontend\src\context\ExamContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiCall, endpoints } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

// Initial state
const initialState = {
  exams: [],
  currentExam: null,
  currentSubmission: null,
  questions: [],
  submissions: [],
  isLoading: false,
  error: null,
  filters: {
    subject: '',
    grade: '',
    difficulty: '',
    search: ''
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  }
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_EXAMS: 'SET_EXAMS',
  SET_CURRENT_EXAM: 'SET_CURRENT_EXAM',
  SET_CURRENT_SUBMISSION: 'SET_CURRENT_SUBMISSION',
  SET_QUESTIONS: 'SET_QUESTIONS',
  SET_SUBMISSIONS: 'SET_SUBMISSIONS',
  ADD_EXAM: 'ADD_EXAM',
  UPDATE_EXAM: 'UPDATE_EXAM',
  DELETE_EXAM: 'DELETE_EXAM',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
  RESET_STATE: 'RESET_STATE'
};

// Reducer
const examReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    
    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    
    case ActionTypes.SET_EXAMS:
      return { 
        ...state, 
        exams: action.payload.exams,
        pagination: { ...state.pagination, ...action.payload.pagination },
        isLoading: false 
      };
    
    case ActionTypes.SET_CURRENT_EXAM:
      return { ...state, currentExam: action.payload };
    
    case ActionTypes.SET_CURRENT_SUBMISSION:
      return { ...state, currentSubmission: action.payload };
    
    case ActionTypes.SET_QUESTIONS:
      return { ...state, questions: action.payload };
    
    case ActionTypes.SET_SUBMISSIONS:
      return { ...state, submissions: action.payload };
    
    case ActionTypes.ADD_EXAM:
      return { 
        ...state, 
        exams: [action.payload, ...state.exams] 
      };
    
    case ActionTypes.UPDATE_EXAM:
      return {
        ...state,
        exams: state.exams.map(exam => 
          exam._id === action.payload._id ? action.payload : exam
        ),
        currentExam: state.currentExam?._id === action.payload._id ? action.payload : state.currentExam
      };
    
    case ActionTypes.DELETE_EXAM:
      return {
        ...state,
        exams: state.exams.filter(exam => exam._id !== action.payload),
        currentExam: state.currentExam?._id === action.payload ? null : state.currentExam
      };
    
    case ActionTypes.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };
    
    case ActionTypes.SET_PAGINATION:
      return { ...state, pagination: { ...state.pagination, ...action.payload } };
    
    case ActionTypes.RESET_STATE:
      return initialState;
    
    default:
      return state;
  }
};

// Create context
const ExamContext = createContext();

// Exam provider component
export const ExamProvider = ({ children }) => {
  const [state, dispatch] = useReducer(examReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  // Fetch exams
  const fetchExams = async (params = {}) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });

      const queryParams = {
        page: state.pagination.page,
        limit: state.pagination.limit,
        ...state.filters,
        ...params
      };

      const response = await apiCall('GET', endpoints.exams.getAll, null, { params: queryParams });

      if (response.success) {
        dispatch({
          type: ActionTypes.SET_EXAMS,
          payload: {
            exams: response.data.exams,
            pagination: {
              page: response.data.currentPage,
              total: response.data.total,
              totalPages: response.data.totalPages
            }
          }
        });
      }
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: error.response?.data?.message || 'Failed to fetch exams'
      });
    }
  };

  // Fetch exam by ID
  const fetchExamById = async (examId) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });

      const response = await apiCall('GET', endpoints.exams.getById(examId));

      if (response.success) {
        dispatch({ type: ActionTypes.SET_CURRENT_EXAM, payload: response.data.exam });
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
        return response.data.exam;
      }
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: error.response?.data?.message || 'Failed to fetch exam'
      });
      return null;
    }
  };

  // Create exam
  const createExam = async (examData) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });

      const response = await apiCall('POST', endpoints.exams.create, examData);

      if (response.success) {
        dispatch({ type: ActionTypes.ADD_EXAM, payload: response.data.exam });
        toast.success('Exam created successfully!');
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
        return { success: true, exam: response.data.exam };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create exam';
      dispatch({ type: ActionTypes.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Update exam
  const updateExam = async (examId, examData) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });

      const response = await apiCall('PUT', endpoints.exams.update(examId), examData);

      if (response.success) {
        dispatch({ type: ActionTypes.UPDATE_EXAM, payload: response.data.exam });
        toast.success('Exam updated successfully!');
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
        return { success: true, exam: response.data.exam };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update exam';
      dispatch({ type: ActionTypes.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Delete exam
  const deleteExam = async (examId) => {
    try {
      const response = await apiCall('DELETE', endpoints.exams.delete(examId));

      if (response.success) {
        dispatch({ type: ActionTypes.DELETE_EXAM, payload: examId });
        toast.success('Exam deleted successfully!');
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete exam';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Start exam
  const startExam = async (examId) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });

      const response = await apiCall('POST', endpoints.submissions.start, { examId });

      if (response.success) {
        dispatch({ type: ActionTypes.SET_CURRENT_SUBMISSION, payload: response.data.submission });
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
        toast.success('Exam started successfully!');
        return { success: true, submission: response.data.submission };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to start exam';
      dispatch({ type: ActionTypes.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Submit answer
  const submitAnswer = async (submissionId, questionId, answer, timeTaken) => {
    try {
      const response = await apiCall('POST', endpoints.submissions.submitAnswer, {
        submissionId,
        questionId,
        answer,
        timeTaken
      });

      if (response.success) {
        dispatch({ type: ActionTypes.SET_CURRENT_SUBMISSION, payload: response.data.submission });
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to submit answer';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Submit exam
  const submitExam = async (submissionId) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });

      const response = await apiCall('POST', endpoints.submissions.submit, { submissionId });

      if (response.success) {
        dispatch({ type: ActionTypes.SET_CURRENT_SUBMISSION, payload: response.data.submission });
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
        toast.success('Exam submitted successfully!');
        return { success: true, submission: response.data.submission };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to submit exam';
      dispatch({ type: ActionTypes.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Fetch submissions
  const fetchSubmissions = async (params = {}) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });

      const response = await apiCall('GET', endpoints.submissions.getAll, null, { params });

      if (response.success) {
        dispatch({ type: ActionTypes.SET_SUBMISSIONS, payload: response.data.submissions });
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      }
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: error.response?.data?.message || 'Failed to fetch submissions'
      });
    }
  };

  // Publish exam
  const publishExam = async (examId) => {
    try {
      const response = await apiCall('PUT', endpoints.exams.publish(examId));

      if (response.success) {
        dispatch({ type: ActionTypes.UPDATE_EXAM, payload: response.data.exam });
        toast.success('Exam published successfully!');
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to publish exam';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Set filters
  const setFilters = (filters) => {
    dispatch({ type: ActionTypes.SET_FILTERS, payload: filters });
  };

  // Set pagination
  const setPagination = (pagination) => {
    dispatch({ type: ActionTypes.SET_PAGINATION, payload: pagination });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  };

  // Reset state
  const resetState = () => {
    dispatch({ type: ActionTypes.RESET_STATE });
  };

  const value = {
    ...state,
    fetchExams,
    fetchExamById,
    createExam,
    updateExam,
    deleteExam,
    startExam,
    submitAnswer,
    submitExam,
    fetchSubmissions,
    publishExam,
    setFilters,
    setPagination,
    clearError,
    resetState
  };

  return (
    <ExamContext.Provider value={value}>
      {children}
    </ExamContext.Provider>
  );
};

// Custom hook to use exam context
export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
};

export default ExamContext;