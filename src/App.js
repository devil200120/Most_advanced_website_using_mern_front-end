import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ExamProvider } from './context/ExamContext';
import { NotificationProvider } from './context/NotificationContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Breadcrumb from './components/Breadcrumb';
import ThemeToggle from './components/ThemeToggle';
import Loading from './components/Loading';

// Pages - Public
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';
import Help from './pages/Help';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import VerifyEmail from './pages/VerifyEmail'; // Add this import
import ResultsList from './pages/ResultsList';
import Schedule from './pages/Schedule';
import Students from './pages/Students';




// Pages - Protected
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Payment from './pages/Payment';

// Pages - Exam Related
import CreateExam from './pages/CreateExam';
import ExamList from './pages/ExamList';
import ExamTake from './pages/ExamTake';
import ExamResult from './pages/ExamResult';

// Dashboard Components (Role-based)
import AdminDashboard from './components/AdminDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import ParentDashboard from './components/ParentDashboard';

// Styles
import './App.css';
import './index.css';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <p>Please refresh the page or contact support if the problem persists.</p>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Fallback Component
const LoadingFallback = () => (
  <div className="loading-container">
    <Loading />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ExamProvider>
          <NotificationProvider>
            <Router>
              <div className="App">
                <Navbar />
                <div className="main-content">
                  <Breadcrumb />
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/verify-email" element={<VerifyEmail />} /> {/* Add this route */}
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/help" element={<Help />} />
                      <Route path="/401" element={<Unauthorized />} />
                      <Route path="/404" element={<NotFound />} />
                      
                      {/* Protected Routes - General */}
                      <Route 
                        path="/dashboard" 
                        element={
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* ... rest of your routes remain the same ... */}
                      
                      <Route 
                        path="/profile" 
                        element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
  path="/schedule" 
  element={
    <ProtectedRoute>
      <Schedule />
    </ProtectedRoute>
  } 
/>
                      
                      <Route 
                        path="/settings" 
                        element={
                          <ProtectedRoute>
                            <Settings />
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/notifications" 
                        element={
                          <ProtectedRoute>
                            <Notifications />
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/payment" 
                        element={
                          <ProtectedRoute>
                            <Payment />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* Admin Routes */}
                      <Route 
                        path="/admin/dashboard" 
                        element={
                          <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* Teacher Routes */}
                      <Route 
                        path="/teacher/dashboard" 
                        element={
                          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                            <TeacherDashboard />
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/create-exam" 
                        element={
                          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                            <CreateExam />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* Student Routes */}
                      <Route 
                        path="/student/dashboard" 
                        element={
                          <ProtectedRoute allowedRoles={['student']}>
                            <StudentDashboard />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
  path="/results" 
  element={
    <ProtectedRoute>
      <ResultsList />
    </ProtectedRoute>
  } 
/>
<Route 
  path="/students" 
  element={
    <ProtectedRoute allowedRoles={['teacher', 'admin']}>
      <Students />
    </ProtectedRoute>
  } 
/>
                      
                      <Route 
                        path="/exam/:id" 
                        element={
                          <ProtectedRoute allowedRoles={['student']}>
                            <ExamTake />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* Parent Routes */}
                      <Route 
                        path="/parent/dashboard" 
                        element={
                          <ProtectedRoute allowedRoles={['parent']}>
                            <ParentDashboard />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* Exam Routes - Accessible to multiple roles */}
                      <Route 
                        path="/exam-list" 
                        element={
                          <ProtectedRoute>
                            <ExamList />
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/exam-result" 
                        element={
                          <ProtectedRoute>
                            <ExamResult />
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/exam/result/:id" 
                        element={
                          <ProtectedRoute>
                            <ExamResult />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* Additional useful routes */}
                      <Route 
                        path="/exams" 
                        element={
                          <ProtectedRoute>
                            <ExamList />
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/my-exams" 
                        element={
                          <ProtectedRoute allowedRoles={['student']}>
                            <ExamList />
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/manage-exams" 
                        element={
                          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                            <ExamList />
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/results" 
                        element={
                          <ProtectedRoute>
                            <ExamResult />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* Redirects for common paths */}
                      <Route path="/unauthorized" element={<Unauthorized />} />
                      <Route path="/not-found" element={<NotFound />} />
                      
                      {/* Catch all route - must be last */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </div>
                <Footer />
                <div className="theme-toggle-container">
                  <ThemeToggle />
                </div>
              </div>
              
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                className="toast-container"
              />
            </Router>
          </NotificationProvider>
        </ExamProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;