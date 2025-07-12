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
      
      setDashboardData({
        stats: {},
        message: 'Dashboard data temporarily unavailable'
      });
      
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

  const stats = dashboardData?.stats || {};

  return (
    <div className="dashboard">
      {/* Animated Background */}
      <div className="dashboard-background">
        <div className="bg-gradient"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      <div className="dashboard-container">
        {/* Enhanced Header */}
        <div className="dashboard-header">
          <div className="welcome-section">
            <div className="welcome-text">
              <h1>
                Welcome back, <span className="highlight">{user.firstName || user.name || 'User'}</span>!
              </h1>
              <div className="user-info">
                <span className="role-badge">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
                <span className="last-login">
                  Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'First time'}
                </span>
              </div>
            </div>
            <div className="welcome-visual">
              <div className="floating-icons">
                <div className="floating-icon">📊</div>
                <div className="floating-icon">🎯</div>
                <div className="floating-icon">⭐</div>
              </div>
            </div>
          </div>
          
          <button 
            className="btn-role-dashboard"
            onClick={handleRoleBasedRedirect}
          >
            <i className="fas fa-tachometer-alt"></i>
            <span>Go to {user.role} Dashboard</span>
          </button>
        </div>

        {/* Enhanced Stats Section */}
        {dashboardData && (
          <div className="dashboard-stats">
            <div className="stats-header">
              <h2>Dashboard Overview</h2>
              <div className="stats-refresh">
                <button onClick={fetchDashboardData} className="refresh-btn">
                  <i className="fas fa-sync-alt"></i>
                  Refresh
                </button>
              </div>
            </div>
            <div className="stats-grid">
              {user.role === 'admin' && (
                <>
                  <div className="stat-wrapper">
                    <StatsCard
                      title="Total Users"
                      value={stats.totalUsers || 0}
                      icon="fas fa-users"
                      color="#667eea"
                    />
                  </div>
                  <div className="stat-wrapper">
                    <StatsCard
                      title="Total Exams"
                      value={stats.totalExams || 0}
                      icon="fas fa-clipboard-list"
                      color="#28a745"
                    />
                  </div>
                  <div className="stat-wrapper">
                    <StatsCard
                      title="Active Exams"
                      value={stats.activeExams || 0}
                      icon="fas fa-user-clock"
                      color="#ffc107"
                    />
                  </div>
                  <div className="stat-wrapper">
                    <StatsCard
                      title="Total Submissions"
                      value={stats.totalSubmissions || 0}
                      icon="fas fa-file-alt"
                      color="#17a2b8"
                    />
                  </div>
                </>
              )}
              
              {user.role === 'teacher' && (
                <>
                  <div className="stat-wrapper">
                    <StatsCard
                      title="My Exams"
                      value={stats.totalExams || 0}
                      icon="fas fa-clipboard-list"
                      color="#667eea"
                    />
                  </div>
                  <div className="stat-wrapper">
                    <StatsCard
                      title="Active Exams"
                      value={stats.activeExams || 0}
                      icon="fas fa-play-circle"
                      color="#28a745"
                    />
                  </div>
                  <div className="stat-wrapper">
                    <StatsCard
                      title="Students"
                      value={stats.totalStudents || 0}
                      icon="fas fa-user-graduate"
                      color="#ffc107"
                    />
                  </div>
                  <div className="stat-wrapper">
                    <StatsCard
                      title="Pending Grading"
                      value={stats.pendingGrading || 0}
                      icon="fas fa-exclamation-triangle"
                      color="#dc3545"
                    />
                  </div>
                </>
              )}
              
              {user.role === 'student' && (
                <>
                  <div className="stat-wrapper">
                    <StatsCard
                      title="Exams Taken"
                      value={stats.totalExams || 0}
                      icon="fas fa-clipboard-check"
                      color="#667eea"
                    />
                  </div>
                  <div className="stat-wrapper">
                    <StatsCard
                      title="Average Score"
                      value={`${stats.averageScore || 0}%`}
                      icon="fas fa-chart-line"
                      color="#28a745"
                    />
                  </div>
                  <div className="stat-wrapper">
                    <StatsCard
                      title="Completed Exams"
                      value={stats.completedExams || 0}
                      icon="fas fa-calendar-alt"
                      color="#ffc107"
                    />
                  </div>
                  <div className="stat-wrapper">
                    <StatsCard
                      title="Pending Results"
                      value={stats.pendingResults || 0}
                      icon="fas fa-hourglass-half"
                      color="#17a2b8"
                    />
                  </div>
                </>
              )}
              
              {user.role === 'parent' && (
                <>
                  <div className="stat-wrapper">
                    <StatsCard
                      title="Children"
                      value={stats.totalChildren || 0}
                      icon="fas fa-child"
                      color="#667eea"
                    />
                  </div>
                  <div className="stat-wrapper">
                    <StatsCard
                      title="Total Exams"
                      value={stats.totalExamsTaken || 0}
                      icon="fas fa-clipboard-list"
                      color="#28a745"
                    />
                  </div>
                  <div className="stat-wrapper">
                    <StatsCard
                      title="Average Performance"
                      value={`${stats.averagePerformance || 0}%`}
                      icon="fas fa-chart-bar"
                      color="#ffc107"
                    />
                  </div>
                  <div className="stat-wrapper">
                    <StatsCard
                      title="Notifications"
                      value={notifications.length}
                      icon="fas fa-bell"
                      color="#17a2b8"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Content Layout */}
        <div className="dashboard-content">
          <div className="main-content">
            {/* Recent Activity with Better UI */}
            <div className="recent-activity">
              <div className="section-header">
                <h3>
                  <i className="fas fa-clock"></i>
                  Recent Activity
                </h3>
                <div className="section-actions">
                  <button className="view-more-btn">View More</button>
                </div>
              </div>
              
              {dashboardData?.upcomingExams?.length > 0 ? (
                <div className="activity-list">
                  {dashboardData.upcomingExams.slice(0, 5).map((exam, index) => (
                    <div key={exam._id || index} className="activity-item">
                      <div className="activity-icon upcoming">
                        <i className="fas fa-clipboard-check"></i>
                      </div>
                      <div className="activity-content">
                        <div className="activity-main">
                          <p>Upcoming Exam: <strong>{exam.title}</strong></p>
                          <span className="activity-category">Scheduled</span>
                        </div>
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
                      <div className="activity-icon result">
                        <i className="fas fa-chart-bar"></i>
                      </div>
                      <div className="activity-content">
                        <div className="activity-main">
                          <p>Exam Result: <strong>{result.exam?.title}</strong></p>
                          <span className="activity-score">{result.percentage}%</span>
                        </div>
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
                      <div className="activity-icon new-user">
                        <i className="fas fa-user-plus"></i>
                      </div>
                      <div className="activity-content">
                        <div className="activity-main">
                          <p>New User: <strong>{user.firstName} {user.lastName}</strong></p>
                          <span className="activity-role">{user.role}</span>
                        </div>
                        <span className="activity-time">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-activity">
                  <div className="no-activity-icon">
                    <i className="fas fa-inbox"></i>
                  </div>
                  <h4>No Recent Activity</h4>
                  <p>Your activity will appear here once you start using the system.</p>
                </div>
              )}
            </div>

            {/* Enhanced Quick Actions */}
            <div className="quick-actions">
              <div className="section-header">
                <h3>
                  <i className="fas fa-bolt"></i>
                  Quick Actions
                </h3>
              </div>
              
              <div className="actions-grid">
                {user.role === 'admin' && (
                  <>
                    <Link to="/admin/dashboard" className="action-card admin">
                      <div className="action-icon">
                        <i className="fas fa-tachometer-alt"></i>
                      </div>
                      <div className="action-content">
                        <h4>Admin Panel</h4>
                        <p>Manage users and system settings</p>
                      </div>
                      <div className="action-arrow">
                        <i className="fas fa-arrow-right"></i>
                      </div>
                    </Link>
                    <Link to="/users" className="action-card">
                      <div className="action-icon">
                        <i className="fas fa-users-cog"></i>
                      </div>
                      <div className="action-content">
                        <h4>Manage Users</h4>
                        <p>Add, edit, or remove users</p>
                      </div>
                      <div className="action-arrow">
                        <i className="fas fa-arrow-right"></i>
                      </div>
                    </Link>
                    <Link to="/reports" className="action-card">
                      <div className="action-icon">
                        <i className="fas fa-chart-bar"></i>
                      </div>
                      <div className="action-content">
                        <h4>Reports</h4>
                        <p>View system reports and analytics</p>
                      </div>
                      <div className="action-arrow">
                        <i className="fas fa-arrow-right"></i>
                      </div>
                    </Link>
                  </>
                )}
                
                {user.role === 'teacher' && (
                  <>
                    <Link to="/create-exam" className="action-card primary">
                      <div className="action-icon">
                        <i className="fas fa-plus-circle"></i>
                      </div>
                      <div className="action-content">
                        <h4>Create Exam</h4>
                        <p>Set up a new exam for students</p>
                      </div>
                      <div className="action-arrow">
                        <i className="fas fa-arrow-right"></i>
                      </div>
                    </Link>
                    <Link to="/exams" className="action-card">
                      <div className="action-icon">
                        <i className="fas fa-list"></i>
                      </div>
                      <div className="action-content">
                        <h4>My Exams</h4>
                        <p>View and manage your exams</p>
                      </div>
                      <div className="action-arrow">
                        <i className="fas fa-arrow-right"></i>
                      </div>
                    </Link>
                    <Link to="/submissions" className="action-card">
                      <div className="action-icon">
                        <i className="fas fa-clipboard-check"></i>
                      </div>
                      <div className="action-content">
                        <h4>Grade Submissions</h4>
                        <p>Review and grade student submissions</p>
                      </div>
                      <div className="action-arrow">
                        <i className="fas fa-arrow-right"></i>
                      </div>
                    </Link>
                  </>
                )}
                
                {user.role === 'student' && (
                  <>
                    <Link to="/exams" className="action-card primary">
                      <div className="action-icon">
                        <i className="fas fa-clipboard-list"></i>
                      </div>
                      <div className="action-content">
                        <h4>Available Exams</h4>
                        <p>View and take available exams</p>
                      </div>
                      <div className="action-arrow">
                        <i className="fas fa-arrow-right"></i>
                      </div>
                    </Link>
                    <Link to="/results" className="action-card">
                      <div className="action-icon">
                        <i className="fas fa-chart-line"></i>
                      </div>
                      <div className="action-content">
                        <h4>My Results</h4>
                        <p>View your exam results and grades</p>
                      </div>
                      <div className="action-arrow">
                        <i className="fas fa-arrow-right"></i>
                      </div>
                    </Link>
                    <Link to="/schedule" className="action-card">
                      <div className="action-icon">
                        <i className="fas fa-calendar-alt"></i>
                      </div>
                      <div className="action-content">
                        <h4>Exam Schedule</h4>
                        <p>View your upcoming exam schedule</p>
                      </div>
                      <div className="action-arrow">
                        <i className="fas fa-arrow-right"></i>
                      </div>
                    </Link>
                  </>
                )}
                
               {user.role === 'parent' && (
                  <>
                    <Link to="/parent/dashboard" className="action-card primary">
                      <div className="action-icon">
                        <i className="fas fa-child"></i>
                      </div>
                      <div className="action-content">
                        <h4>My Children</h4>
                        <p>View your children's progress</p>
                      </div>
                      <div className="action-arrow">
                        <i className="fas fa-arrow-right"></i>
                      </div>
                    </Link>
                    <Link to="/parent/reports" className="action-card">
                      <div className="action-icon">
                        <i className="fas fa-chart-bar"></i>
                      </div>
                      <div className="action-content">
                        <h4>Progress Reports</h4>
                        <p>View detailed progress reports</p>
                      </div>
                      <div className="action-arrow">
                        <i className="fas fa-arrow-right"></i>
                      </div>
                    </Link>
                    <Link to="/payments" className="action-card">
                      <div className="action-icon">
                        <i className="fas fa-credit-card"></i>
                      </div>
                      <div className="action-content">
                        <h4>Payments</h4>
                        <p>Manage exam fees and payments</p>
                      </div>
                      <div className="action-arrow">
                        <i className="fas fa-arrow-right"></i>
                      </div>
                    </Link>
                  </>
                )}
                
                {/* Common actions for all roles */}
                <Link to="/profile" className="action-card">
                  <div className="action-icon">
                    <i className="fas fa-user"></i>
                  </div>
                  <div className="action-content">
                    <h4>My Profile</h4>
                    <p>View and edit your profile</p>
                  </div>
                  <div className="action-arrow">
                    <i className="fas fa-arrow-right"></i>
                  </div>
                </Link>
                <Link to="/settings" className="action-card">
                  <div className="action-icon">
                    <i className="fas fa-cog"></i>
                  </div>
                  <div className="action-content">
                    <h4>Settings</h4>
                    <p>Manage your account settings</p>
                  </div>
                  <div className="action-arrow">
                    <i className="fas fa-arrow-right"></i>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="sidebar">
            <div className="notifications-widget">
              <div className="widget-header">
                <h3>
                  <i className="fas fa-bell"></i>
                  Recent Notifications
                </h3>
                <Link to="/notifications" className="view-all">
                  View All
                  <i className="fas fa-arrow-right"></i>
                </Link>
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
                      <div className="notification-status">
                        <div className="status-dot"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-notifications">
                  <div className="no-notifications-icon">
                    <i className="fas fa-bell-slash"></i>
                  </div>
                  <h4>No New Notifications</h4>
                  <p>You're all caught up!</p>
                </div>
              )}
            </div>

            <div className="system-info">
              <div className="widget-header">
                <h3>
                  <i className="fas fa-info-circle"></i>
                  System Information
                </h3>
              </div>
              <div className="info-list">
                <div className="info-item">
                  <div className="info-label">
                    <i className="fas fa-server"></i>
                    Server Status
                  </div>
                  <div className="info-value online">
                    {dashboardData?.systemHealth?.status || 'Online'}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    <i className="fas fa-database"></i>
                    Last Backup
                  </div>
                  <div className="info-value">
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    <i className="fas fa-code-branch"></i>
                    Version
                  </div>
                  <div className="info-value">v2.1.0</div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    <i className="fas fa-user-tag"></i>
                    User Role
                  </div>
                  <div className="info-value">
                    <span className="role-tag">{user.role}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
