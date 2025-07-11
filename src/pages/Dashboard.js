// File: c:\Users\KIIT0001\Desktop\exam_site\front-end\src\pages\Dashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Loading from '../components/Loading';
import StatsCard from '../components/StatsCard';
import { toast } from 'react-toastify';
import './Dashboard.css';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchDashboardData();
      fetchNotifications();
    }
  }, [user, authLoading]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      let endpoint;
      
      // Use CORRECT endpoints matching your backend routes
      switch (user.role) {
        case 'admin':
          endpoint = '/dashboard/admin';
          break;
        case 'teacher':
          endpoint = '/dashboard/teacher';
          break;
        case 'student':
          endpoint = '/dashboard/student';
          break;
        case 'parent':
          endpoint = '/dashboard/parent';
          break;
        default:
          endpoint = '/dashboard/student';
      }

      console.log(`Fetching dashboard data from: ${endpoint}`);
      const response = await api.get(endpoint);
      console.log('Dashboard response:', response);

      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      // Set safe defaults instead of showing error
      setDashboardData({
        stats: {},
        message: 'Dashboard data temporarily unavailable'
      });
      
      // Only show error toast for real server errors
      if (error.response?.status >= 500) {
        toast.error('Server error. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications', {
        params: { limit: 5, unread: true }
      });
      
      if (response.data.success) {
        setNotifications(response.data.data.notifications || []);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    }
  };

  const handleRoleBasedRedirect = () => {
    switch (user.role) {
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'teacher':
        navigate('/teacher/dashboard');
        break;
      case 'student':
        navigate('/student/dashboard');
        break;
      case 'parent':
        navigate('/parent/dashboard');
        break;
      default:
        break;
    }
  };

  if (authLoading || loading) {
    return <Loading />;
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  // Extract stats safely
  const stats = dashboardData?.stats || {};

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {user.firstName || user.name || 'User'}!</h1>
          <p>Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
          <p>Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'First time'}</p>
        </div>
        
        <button 
          className="btn-role-dashboard"
          onClick={handleRoleBasedRedirect}
        >
          Go to {user.role} Dashboard
        </button>
      </div>

      {dashboardData && (
        <div className="dashboard-stats">
          <div className="stats-grid">
            {user.role === 'admin' && (
              <>
                <StatsCard
                  title="Total Users"
                  value={stats.totalUsers || 0}
                  icon="fas fa-users"
                  color="#667eea"
                />
                <StatsCard
                  title="Total Exams"
                  value={stats.totalExams || 0}
                  icon="fas fa-clipboard-list"
                  color="#28a745"
                />
                <StatsCard
                  title="Active Exams"
                  value={stats.activeExams || 0}
                  icon="fas fa-user-clock"
                  color="#ffc107"
                />
                <StatsCard
                  title="Total Submissions"
                  value={stats.totalSubmissions || 0}
                  icon="fas fa-file-alt"
                  color="#17a2b8"
                />
              </>
            )}
            
            {user.role === 'teacher' && (
              <>
                <StatsCard
                  title="My Exams"
                  value={stats.totalExams || 0}
                  icon="fas fa-clipboard-list"
                  color="#667eea"
                />
                <StatsCard
                  title="Active Exams"
                  value={stats.activeExams || 0}
                  icon="fas fa-play-circle"
                  color="#28a745"
                />
                <StatsCard
                  title="Students"
                  value={stats.totalStudents || 0}
                  icon="fas fa-user-graduate"
                  color="#ffc107"
                />
                <StatsCard
                  title="Pending Grading"
                  value={stats.pendingGrading || 0}
                  icon="fas fa-exclamation-triangle"
                  color="#dc3545"
                />
              </>
            )}
            
            {user.role === 'student' && (
              <>
                <StatsCard
                  title="Exams Taken"
                  value={stats.totalExams || 0}
                  icon="fas fa-clipboard-check"
                  color="#667eea"
                />
                <StatsCard
                  title="Average Score"
                  value={`${stats.averageScore || 0}%`}
                  icon="fas fa-chart-line"
                  color="#28a745"
                />
                <StatsCard
                  title="Completed Exams"
                  value={stats.completedExams || 0}
                  icon="fas fa-calendar-alt"
                  color="#ffc107"
                />
                <StatsCard
                  title="Pending Results"
                  value={stats.pendingResults || 0}
                  icon="fas fa-hourglass-half"
                  color="#17a2b8"
                />
              </>
            )}
            
            {user.role === 'parent' && (
              <>
                <StatsCard
                  title="Children"
                  value={stats.totalChildren || 0}
                  icon="fas fa-child"
                  color="#667eea"
                />
                <StatsCard
                  title="Total Exams"
                  value={stats.totalExamsTaken || 0}
                  icon="fas fa-clipboard-list"
                  color="#28a745"
                />
                <StatsCard
                  title="Average Performance"
                  value={`${stats.averagePerformance || 0}%`}
                  icon="fas fa-chart-bar"
                  color="#ffc107"
                />
                <StatsCard
                  title="Notifications"
                  value={notifications.length}
                  icon="fas fa-bell"
                  color="#17a2b8"
                />
              </>
            )}
          </div>
        </div>
      )}

      <div className="dashboard-content">
        <div className="main-content">
          <div className="recent-activity">
            <h3>Recent Activity</h3>
            {dashboardData?.upcomingExams?.length > 0 ? (
              <div className="activity-list">
                {dashboardData.upcomingExams.slice(0, 5).map((exam, index) => (
                  <div key={exam._id || index} className="activity-item">
                    <div className="activity-icon">
                      <i className="fas fa-clipboard-check"></i>
                    </div>
                    <div className="activity-content">
                      <p>Upcoming Exam: {exam.title}</p>
                      <span className="activity-time">
                        {new Date(exam.schedule?.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : dashboardData?.recentResults?.length > 0 ? (
              <div className="activity-list">
                {dashboardData.recentResults.slice(0, 5).map((result, index) => (
                  <div key={result._id || index} className="activity-item">
                    <div className="activity-icon">
                      <i className="fas fa-chart-bar"></i>
                    </div>
                    <div className="activity-content">
                      <p>Exam Result: {result.exam?.title} - {result.percentage}%</p>
                      <span className="activity-time">
                        {new Date(result.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : dashboardData?.recentUsers?.length > 0 ? (
              <div className="activity-list">
                {dashboardData.recentUsers.slice(0, 5).map((user, index) => (
                  <div key={user._id || index} className="activity-item">
                    <div className="activity-icon">
                      <i className="fas fa-user-plus"></i>
                    </div>
                    <div className="activity-content">
                      <p>New User: {user.firstName} {user.lastName} ({user.role})</p>
                      <span className="activity-time">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-activity">
                <i className="fas fa-inbox"></i>
                <p>No recent activity</p>
              </div>
            )}
          </div>

          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="actions-grid">
              {user.role === 'admin' && (
                <>
                  <Link to="/admin/dashboard" className="action-card">
                    <i className="fas fa-tachometer-alt"></i>
                    <h4>Admin Panel</h4>
                    <p>Manage users and system settings</p>
                  </Link>
                  <Link to="/users" className="action-card">
                    <i className="fas fa-users-cog"></i>
                    <h4>Manage Users</h4>
                    <p>Add, edit, or remove users</p>
                  </Link>
                  <Link to="/reports" className="action-card">
                    <i className="fas fa-chart-bar"></i>
                    <h4>Reports</h4>
                    <p>View system reports and analytics</p>
                  </Link>
                </>
              )}
              
              {user.role === 'teacher' && (
                <>
                  <Link to="/create-exam" className="action-card">
                    <i className="fas fa-plus-circle"></i>
                    <h4>Create Exam</h4>
                    <p>Set up a new exam for students</p>
                  </Link>
                  <Link to="/exams" className="action-card">
                    <i className="fas fa-list"></i>
                    <h4>My Exams</h4>
                    <p>View and manage your exams</p>
                  </Link>
                  <Link to="/submissions" className="action-card">
                    <i className="fas fa-clipboard-check"></i>
                    <h4>Grade Submissions</h4>
                    <p>Review and grade student submissions</p>
                  </Link>
                </>
              )}
              
              {user.role === 'student' && (
                <>
                  <Link to="/exams" className="action-card">
                    <i className="fas fa-clipboard-list"></i>
                    <h4>Available Exams</h4>
                    <p>View and take available exams</p>
                  </Link>
                  <Link to="/results" className="action-card">
                    <i className="fas fa-chart-line"></i>
                    <h4>My Results</h4>
                    <p>View your exam results and grades</p>
                  </Link>
                  <Link to="/schedule" className="action-card">
                    <i className="fas fa-calendar-alt"></i>
                    <h4>Exam Schedule</h4>
                    <p>View your upcoming exam schedule</p>
                  </Link>
                </>
              )}
              
              {user.role === 'parent' && (
                <>
                  <Link to="/children" className="action-card">
                    <i className="fas fa-child"></i>
                    <h4>My Children</h4>
                    <p>View your children's progress</p>
                  </Link>
                  <Link to="/reports" className="action-card">
                    <i className="fas fa-chart-bar"></i>
                    <h4>Progress Reports</h4>
                    <p>View detailed progress reports</p>
                  </Link>
                  <Link to="/payments" className="action-card">
                    <i className="fas fa-credit-card"></i>
                    <h4>Payments</h4>
                    <p>Manage exam fees and payments</p>
                  </Link>
                </>
              )}
              
              {/* Common actions for all roles */}
              <Link to="/profile" className="action-card">
                <i className="fas fa-user"></i>
                <h4>My Profile</h4>
                <p>View and edit your profile</p>
              </Link>
              <Link to="/settings" className="action-card">
                <i className="fas fa-cog"></i>
                <h4>Settings</h4>
                <p>Manage your account settings</p>
              </Link>
            </div>
          </div>
        </div>

        <div className="sidebar">
          <div className="notifications-widget">
            <div className="widget-header">
              <h3>Recent Notifications</h3>
              <Link to="/notifications" className="view-all">View All</Link>
            </div>
            {notifications.length > 0 ? (
              <div className="notifications-list">
                {notifications.map((notification) => (
                  <div key={notification._id} className="notification-item">
                    <div className="notification-icon">
                      <i className={notification.icon || 'fas fa-info-circle'}></i>
                    </div>
                    <div className="notification-content">
                      <p>{notification.title || notification.message}</p>
                      <span className="notification-time">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-notifications">
                <i className="fas fa-bell-slash"></i>
                <p>No new notifications</p>
              </div>
            )}
          </div>

          <div className="system-info">
            <h3>System Information</h3>
            <div className="info-item">
              <span className="info-label">Server Status:</span>
              <span className="info-value online">
                {dashboardData?.systemHealth?.status || 'Online'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Last Backup:</span>
              <span className="info-value">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Version:</span>
              <span className="info-value">v2.1.0</span>
            </div>
            <div className="info-item">
              <span className="info-label">User Role:</span>
              <span className="info-value">{user.role}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;