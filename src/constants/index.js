// frontend/src/constants/index.js
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const USER_ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent'
};

export const EXAM_STATUS = {
  DRAFT: 'draft',
  SCHEDULED: 'scheduled',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple-choice',
  TRUE_FALSE: 'true-false',
  TEXT: 'text',
  ESSAY: 'essay'
};

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};

export const NOTIFICATION_TYPES = {
  EXAM_SCHEDULED: 'exam_scheduled',
  EXAM_REMINDER: 'exam_reminder',
  EXAM_COMPLETED: 'exam_completed',
  RESULT_PUBLISHED: 'result_published',
  PAYMENT_RECEIVED: 'payment_received',
  ACCOUNT_CREATED: 'account_created',
  SYSTEM_MAINTENANCE: 'system_maintenance'
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ADMIN_DASHBOARD: '/admin/dashboard',
  TEACHER_DASHBOARD: '/teacher/dashboard',
  STUDENT_DASHBOARD: '/student/dashboard',
  PARENT_DASHBOARD: '/parent/dashboard',
  CREATE_EXAM: '/create-exam',
  EXAM_LIST: '/exam-list',
  EXAM_TAKE: '/exam/:id',
  EXAM_RESULT: '/exam-result',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  NOTIFICATIONS: '/notifications',
  HELP: '/help',
  ABOUT: '/about',
  CONTACT: '/contact',
  PAYMENT: '/payment',
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/401'
};

export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

export const EXAM_SETTINGS = {
  DEFAULT_DURATION: 60, // minutes
  MAX_DURATION: 300, // minutes
  MIN_DURATION: 10, // minutes
  MAX_QUESTIONS: 100,
  MIN_QUESTIONS: 1,
  AUTO_SAVE_INTERVAL: 30000, // 30 seconds
  WARNING_TIME: 5 // minutes before exam ends
};

export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ACCEPTED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg'],
  ACCEPTED_AUDIO_TYPES: ['audio/mp3', 'audio/wav', 'audio/ogg'],
  ACCEPTED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100]
};

export const GRADE_SCALE = {
  A: { min: 90, max: 100, color: '#28a745' },
  B: { min: 80, max: 89, color: '#17a2b8' },
  C: { min: 70, max: 79, color: '#ffc107' },
  D: { min: 60, max: 69, color: '#fd7e14' },
  F: { min: 0, max: 59, color: '#dc3545' }
};

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark'
};

export const BREAKPOINTS = {
  XS: 0,
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
  XXL: 1400
};