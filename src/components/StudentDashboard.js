// File: c:\Users\KIIT0001\Desktop\exam_site\front-end\src\components\StudentDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatsCard from '../components/StatsCard';
import ExamCard from '../components/ExamCard';
import { toast } from 'react-toastify';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Update fetchDashboardData function (around line 22)

const fetchDashboardData = async () => {
  try {
    const response = await api.get('/dashboard/student');
    console.log('Student dashboard response:', response);
    
    if (response.data && response.data.success) {
      const data = response.data.data;
      setStats(data.stats || {});
      setUpcomingExams(data.upcomingExams || []);
      setRecentResults(data.recentResults || []);
      setNotifications(data.notifications || []);
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Dashboard fetch error:', error);
    
    // Set realistic default data
    setStats({
      totalExams: 0,
      completedExams: 0,
      averageScore: 0,
      pendingResults: 0
    });
    setUpcomingExams([]);
    setRecentResults([]);
    setNotifications([]);
    
    // Only show toast for real errors
    if (error.response?.status !== 404) {
      toast.error('Failed to fetch some dashboard data');
    }
  } finally {
    setLoading(false);
  }
};

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return '#28a745'; // Green
    if (percentage >= 80) return '#17a2b8'; // Blue
    if (percentage >= 70) return '#ffc107'; // Yellow
    if (percentage >= 60) return '#fd7e14'; // Orange
    return '#dc3545'; // Red
  };

  const getGradeLetter = (percentage) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  if (loading) {
    return <div className="loading">Loading student dashboard...</div>;
  }

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {user?.firstName || 'Student'}!</h1>
          <p>Ready to take your next exam?</p>
        </div>
        <div className="quick-stats">
          <div className="quick-stat">
            <span className="stat-number">{upcomingExams.length}</span>
            <span className="stat-label">Upcoming Exams</span>
          </div>
          <div className="quick-stat">
            <span className="stat-number">{recentResults.length}</span>
            <span className="stat-label">Recent Results</span>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <StatsCard
          title="Total Exams Taken"
          value={stats.totalExams || 0}
          icon="fas fa-clipboard-check"
          trend={stats.examsTrend}
        />
        <StatsCard
          title="Average Score"
          value={`${stats.averageScore || 0}%`}
          icon="fas fa-chart-line"
          trend={stats.scoreTrend}
        />
        <StatsCard
          title="Completed Exams"
          value={stats.completedExams || 0}
          icon="fas fa-check-circle"
          trend={stats.completedTrend}
        />
        <StatsCard
          title="Pending Results"
          value={stats.pendingResults || 0}
          icon="fas fa-hourglass-half"
          trend={stats.pendingTrend}
        />
      </div>

      <div className="dashboard-content">
        <div className="left-column">
          <div className="upcoming-exams">
            <div className="section-header">
              <h2>Upcoming Exams</h2>
              <Link to="/exams" className="view-all-btn">View All</Link>
            </div>
            <div className="exams-list">
              {upcomingExams.length > 0 ? (
                upcomingExams.map((exam) => (
                  <ExamCard
                    key={exam._id}
                    exam={exam}
                    showStartButton={true}
                  />
                ))
              ) : (
                <div className="no-data">
                  <i className="fas fa-calendar-alt"></i>
                  <p>No upcoming exams</p>
                </div>
              )}
            </div>
          </div>

          <div className="recent-results">
            <div className="section-header">
              <h2>Recent Results</h2>
              <Link to="/results" className="view-all-btn">View All</Link>
            </div>
            <div className="results-list">
              {recentResults.length > 0 ? (
                recentResults.map((result) => (
                  <div key={result._id} className="result-item">
                    <div className="result-info">
                      <h3>{result.exam.title}</h3>
                      <p className="subject">{result.exam.subject}</p>
                      <p className="date">
                        {new Date(result.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="result-score">
                      <div 
                        className="score-circle"
                        style={{ 
                          borderColor: getGradeColor(result.percentage),
                          color: getGradeColor(result.percentage)
                        }}
                      >
                        <span className="percentage">{result.percentage}%</span>
                        <span className="grade">{getGradeLetter(result.percentage)}</span>
                      </div>
                      <div className="score-details">
                        <p>{result.marksObtained}/{result.exam.totalMarks}</p>
                        <p className="status">
                          {result.isPassed ? 'Passed' : 'Failed'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">
                  <i className="fas fa-chart-bar"></i>
                  <p>No recent results</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="right-column">
          <div className="notifications-panel">
            <div className="section-header">
              <h2>Notifications</h2>
              <Link to="/notifications" className="view-all-btn">View All</Link>
            </div>
            <div className="notifications-list">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div key={notification._id} className="notification-item">
                    <div className="notification-icon">
                      <i className={`fas ${notification.type === 'exam' ? 'fa-clipboard' : 'fa-info-circle'}`}></i>
                    </div>
                    <div className="notification-content">
                      <h4>{notification.title}</h4>
                      <p>{notification.message}</p>
                      <span className="notification-time">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">
                  <i className="fas fa-bell"></i>
                  <p>No new notifications</p>
                </div>
              )}
            </div>
          </div>

          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <Link to="/exams" className="action-btn">
                <i className="fas fa-clipboard-list"></i>
                <span>Take Exam</span>
              </Link>
              <Link to="/results" className="action-btn">
                <i className="fas fa-chart-line"></i>
                <span>View Results</span>
              </Link>
              <Link to="/profile" className="action-btn">
                <i className="fas fa-user"></i>
                <span>Update Profile</span>
              </Link>
              <Link to="/help" className="action-btn">
                <i className="fas fa-question-circle"></i>
                <span>Get Help</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;