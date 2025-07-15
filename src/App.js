import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditExam from './pages/EditExam';
import ExamSubmissions from './pages/ExamSubmissions';
import ExamQuestions from './pages/ExamQuestions';
import ExamResults from './pages/ExamResults';


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
import VerifyEmail from './pages/VerifyEmail';
import StudentProgress from './pages/StudentProgress';

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
import ResultsList from './pages/ResultsList';
import Schedule from './pages/Schedule';
import Students from './pages/Students';

// Role-based Dashboards
import AdminDashboard from './components/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminExams from './pages/AdminExams';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import ExamView from './pages/ExamView';


// Parent Components
import ParentDashboard from './pages/ParentDashboard';
import ChildProgress from './pages/ChildProgress';
import ParentChildren from './pages/ParentChildren';
import ParentReports from './pages/ParentReports';

// Styles
import './App.css';

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
        <div className="error-boundary" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          textAlign: 'center',
          padding: '2rem'
        }}>
          <h2>Something went wrong.</h2>
          <p>Please refresh the page or contact support if the problem persists.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Fallback Component
const LoadingFallback = () => (
  <div className="loading-container" style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh'
  }}>
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
                <Breadcrumb />
                <ThemeToggle />
                
                <main className="main-content">
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/verify-email" element={<VerifyEmail />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/help" element={<Help />} />
                      <Route path="/unauthorized" element={<Unauthorized />} />
                      
                      {/* Protected Routes - Common */}
                      <Route 
                        path="/dashboard" 
                        element={
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/profile" 
                        element={
                          <ProtectedRoute>
                            <Profile />
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

                      <Route 
                        path="/admin/dashboard" 
                        element={
                          <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/admin/users" 
                        element={
                          <ProtectedRoute allowedRoles={['admin']}>
                            <AdminUsers />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/admin/exams" 
                        element={
                          <ProtectedRoute allowedRoles={['admin']}>
                            <AdminExams />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/admin/analytics" 
                        element={
                          <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/admin/settings" 
                        element={
                          <ProtectedRoute allowedRoles={['admin']}>
                            <Settings />
                          </ProtectedRoute>
                        } 
                      />

                      {/* Teacher Routes */}
                      <Route 
                        path="/teacher/dashboard" 
                        element={
                          <ProtectedRoute allowedRoles={['teacher']}>
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

                      {/* Parent Routes */}
                      <Route 
                        path="/parent/dashboard" 
                        element={
                          <ProtectedRoute allowedRoles={['parent']}>
                            <ParentDashboard />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/parent/child/:childId/progress" 
                        element={
                          <ProtectedRoute allowedRoles={['parent']}>
                            <ChildProgress />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/parent/children" 
                        element={
                          <ProtectedRoute allowedRoles={['parent']}>
                            <ParentChildren />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/parent/reports" 
                        element={
                          <ProtectedRoute allowedRoles={['parent']}>
                            <ParentReports />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/parent/child/:childId/progress" 
                        element={
                          <ProtectedRoute allowedRoles={['parent']}>
                            <ChildProgress />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/parent/children" 
                        element={
                          <ProtectedRoute allowedRoles={['parent']}>
                            <ParentDashboard />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/parent/reports" 
                        element={
                          <ProtectedRoute allowedRoles={['parent']}>
                            <ParentDashboard />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/parent/notifications" 
                        element={
                          <ProtectedRoute allowedRoles={['parent']}>
                            <Notifications />
                          </ProtectedRoute>
                        } 
                      />

                      {/* Legacy redirect routes for parent */}
                      <Route 
                        path="/children" 
                        element={
                          <ProtectedRoute allowedRoles={['parent']}>
                            <Navigate to="/parent/dashboard" replace />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/progress" 
                        element={
                          <ProtectedRoute allowedRoles={['parent']}>
                            <Navigate to="/parent/dashboard" replace />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/reports" 
                        element={
                          <ProtectedRoute allowedRoles={['parent']}>
                            <Navigate to="/parent/reports" replace />
                          </ProtectedRoute>
                        } 
                      />
                        
                      {/* Exam Routes - Accessible to multiple roles */}
                      <Route 
                        path="/exam-list" 
                        element={
                          <ProtectedRoute allowedRoles={['student', 'teacher', 'parent']}>
                            <ExamList />
                          </ProtectedRoute>
                        } 
                      />

{/* Missing Exam Management Routes */}
<Route 
  path="/exam/edit/:examId" 
  element={
    <ProtectedRoute allowedRoles={['teacher', 'admin']}>
      <EditExam />
    </ProtectedRoute>
  } 
/>
<Route 
  path="/exam/:examId/edit" 
  element={
    <ProtectedRoute allowedRoles={['teacher', 'admin']}>
      <EditExam />
    </ProtectedRoute>
  } 
/>
<Route 
  path="/exam/submissions/:examId" 
  element={
    <ProtectedRoute allowedRoles={['teacher', 'admin']}>
      <ExamSubmissions />
    </ProtectedRoute>
  } 
/>
<Route 
  path="/exam/:examId/submissions" 
  element={
    <ProtectedRoute allowedRoles={['teacher', 'admin']}>
      <ExamSubmissions />
    </ProtectedRoute>
  } 
/>
<Route 
    path="/exam/:examId/questions" 
  element={
    <ProtectedRoute allowedRoles={['teacher', 'admin']}>
      <ExamQuestions />
    </ProtectedRoute>
  } 
/>
<Route 
  path="/exam/results/:examId" 
  element={
    <ProtectedRoute allowedRoles={['teacher', 'admin']}>
      <ExamResults />
    </ProtectedRoute>
  } 
/>
<Route 
  path="/exam/:examId/result" 
  element={
    <ProtectedRoute allowedRoles={['student']}>
      <ExamResult />
    </ProtectedRoute>
  } 
/>



                      <Route 
                        path="/exam/:examId" 
                        element={
                          <ProtectedRoute allowedRoles={['student']}>
                            <ExamTake />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/exam-result/:submissionId" 
                        element={
                          <ProtectedRoute allowedRoles={['student', 'teacher', 'parent']}>
                            <ExamResult />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
  path="/reports/student/:studentId/progress" 
  element={
    <ProtectedRoute allowedRoles={['teacher', 'admin', 'parent']}>
      <StudentProgress />
    </ProtectedRoute>
  } 
/>
                      <Route 
                        path="/results-list" 
                        element={
                          <ProtectedRoute allowedRoles={['student', 'teacher', 'parent']}>
                            <ResultsList />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/schedule" 
                        element={
                          <ProtectedRoute allowedRoles={['student', 'teacher', 'parent']}>
                            <Schedule />
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
                        path="/admin/exams/:examId" 
                        element={
                          <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                            <ExamView />
                          </ProtectedRoute>
                        } 
                      />

                      {/* Alternative route paths for convenience */}
                      <Route 
                        path="/exams" 
                        element={
                          <ProtectedRoute>
                            <ExamList />
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
                      
                      {/* Catch all route - must be last */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </main>
                
                <Footer />
                
                <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light"
                />
              </div>
            </Router>
          </NotificationProvider>
        </ExamProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
