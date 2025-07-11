// File: c:\Users\KIIT0001\Desktop\exam_site\front-end\src\components\AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatsCard from '../components/StatsCard';
import Chart from '../components/Chart';
import { toast } from 'react-toastify';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentExams, setRecentExams] = useState([]);
  const [systemHealth, setSystemHealth] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/admin');
      console.log('Admin dashboard response:', response);
      
      if (response.data && response.data.success) {
        const data = response.data.data;
        setStats(data.stats || {});
        setRecentUsers(data.recentUsers || []);
        setRecentExams(data.recentExams || []);
        setSystemHealth(data.systemHealth || { status: 'healthy', uptime: 0 });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      
      // Set realistic default data
      setStats({
        totalUsers: 0,
        totalStudents: 0,
        totalTeachers: 0,
        totalExams: 0,
        activeExams: 0,
        totalSubmissions: 0,
        pendingGrading: 0
      });
      setRecentUsers([]);
      setRecentExams([]);
      setSystemHealth({ status: 'unknown', uptime: 0 });
      
      // Only show toast for real errors
      if (error.response?.status !== 404) {
        toast.error('Failed to fetch some dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const formatMemory = (bytes) => {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  if (loading) {
    return <div className="loading">Loading admin dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Admin Dashboard</h1>
          <p>Monitor and manage the entire exam system</p>
        </div>
        <div className="system-status">
          <div className="status-indicator">
            <span className={`status-dot ${systemHealth.status === 'healthy' ? 'healthy' : 'unhealthy'}`}></span>
            <span>System {systemHealth.status}</span>
          </div>
          <div className="uptime">
            Uptime: {formatUptime(systemHealth.uptime)}
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers || 0}
          icon="fas fa-users"
          trend={stats.usersTrend}
        />
        <StatsCard
          title="Total Students"
          value={stats.totalStudents || 0}
          icon="fas fa-user-graduate"
          trend={stats.usersTrend}
        />
        <StatsCard
          title="Total Teachers"
          value={stats.totalTeachers || 0}
          icon="fas fa-chalkboard-teacher"
          trend={stats.usersTrend}
        />
        <StatsCard
          title="Total Exams"
          value={stats.totalExams || 0}
          icon="fas fa-clipboard-list"
          trend={stats.examsTrend}
        />
        <StatsCard
          title="Active Exams"
          value={stats.activeExams || 0}
          icon="fas fa-play-circle"
          trend={stats.examsTrend}
        />
        <StatsCard
          title="Total Submissions"
          value={stats.totalSubmissions || 0}
          icon="fas fa-file-alt"
          trend={stats.submissionsTrend}
        />
        <StatsCard
          title="Pending Grading"
          value={stats.pendingGrading || 0}
          icon="fas fa-hourglass-half"
          trend="neutral"
        />
        <StatsCard
          title="System Health"
          value={systemHealth.status}
          icon="fas fa-heartbeat"
          trend={systemHealth.status === 'healthy' ? 'up' : 'down'}
        />
      </div>

      <div className="dashboard-content">
        <div className="left-column">
          <div className="recent-users">
            <div className="section-header">
              <h2>Recent Users</h2>
              <Link to="/users" className="view-all-btn">View All</Link>
            </div>
            <div className="users-list">
              {recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <div key={user._id} className="user-item">
                    <div className="user-avatar">
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="user-info">
                      <h3>{user.firstName} {user.lastName}</h3>
                      <p className="user-email">{user.email}</p>
                      <p className="user-role">{user.role}</p>
                    </div>
                    <div className="user-date">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">
                  <i className="fas fa-user-plus"></i>
                  <p>No recent users</p>
                </div>
              )}
            </div>
          </div>

          <div className="recent-exams">
            <div className="section-header">
              <h2>Recent Exams</h2>
              <Link to="/exams" className="view-all-btn">View All</Link>
            </div>
            <div className="exams-list">
              {recentExams.length > 0 ? (
                recentExams.map((exam) => (
                  <div key={exam._id} className="exam-item">
                    <div className="exam-info">
                      <h3>{exam.title}</h3>
                      <p className="exam-subject">{exam.subject}</p>
                      <p className="exam-creator">
                        Created by: {exam.createdBy.firstName} {exam.createdBy.lastName}
                      </p>
                    </div>
                    <div className="exam-meta">
                      <span className="exam-date">
                        {new Date(exam.createdAt).toLocaleDateString()}
                      </span>
                      <span className={`exam-status ${exam.isActive ? 'active' : 'inactive'}`}>
                        {exam.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">
                  <i className="fas fa-clipboard-list"></i>
                  <p>No recent exams</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="right-column">
          <div className="system-info">
            <h2>System Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Status:</span>
                <span className={`info-value ${systemHealth.status}`}>
                  {systemHealth.status}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Uptime:</span>
                <span className="info-value">
                  {formatUptime(systemHealth.uptime)}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Memory Usage:</span>
                <span className="info-value">
                  {formatMemory(systemHealth.memory?.heapUsed || 0)}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Memory Total:</span>
                <span className="info-value">
                  {formatMemory(systemHealth.memory?.heapTotal || 0)}
                </span>
              </div>
            </div>
          </div>

          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <Link to="/users" className="action-btn">
                <i className="fas fa-users"></i>
                <span>Manage Users</span>
              </Link>
              <Link to="/exams" className="action-btn">
                <i className="fas fa-clipboard-list"></i>
                <span>Manage Exams</span>
              </Link>
              <Link to="/reports" className="action-btn">
                <i className="fas fa-chart-bar"></i>
                <span>View Reports</span>
              </Link>
              <Link to="/settings" className="action-btn">
                <i className="fas fa-cog"></i>
                <span>System Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;