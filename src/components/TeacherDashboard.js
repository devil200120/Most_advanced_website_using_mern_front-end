// File: c:\Users\KIIT0001\Desktop\exam_site\front-end\src\components\TeacherDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatsCard from '../components/StatsCard';
import ExamCard from '../components/ExamCard';
import { toast } from 'react-toastify';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [pendingGrading, setPendingGrading] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Update fetchDashboardData function (around line 22)

const fetchDashboardData = async () => {
  try {
    const response = await api.get('/dashboard/teacher');
    console.log('Teacher dashboard response:', response);
    
    if (response.data && response.data.success) {
      const data = response.data.data;
      setStats(data.stats || {});
      setUpcomingExams(data.upcomingExams || []);
      setPendingGrading(data.pendingGrading || []);
      setRecentActivity(data.recentActivity || []);
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Dashboard fetch error:', error);
    
    // Set realistic default data instead of showing error
    setStats({
      totalExams: 0,
      activeExams: 0,
      totalStudents: 0,
      pendingGrading: 0
    });
    setUpcomingExams([]);
    setPendingGrading([]);
    setRecentActivity([]);
    
    // Only show toast for real errors, not missing data
    if (error.response?.status !== 404) {
      toast.error('Failed to fetch some dashboard data');
    }
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return <div className="loading">Loading teacher dashboard...</div>;
  }

  return (
    <div className="teacher-dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome, {user?.firstName || 'Teacher'}!</h1>
          <p>Manage your exams and monitor student progress</p>
        </div>
        <div className="quick-stats">
          <div className="quick-stat">
            <span className="stat-number">{stats.totalExams || 0}</span>
            <span className="stat-label">Total Exams</span>
          </div>
          <div className="quick-stat">
            <span className="stat-number">{stats.pendingGrading || 0}</span>
            <span className="stat-label">Pending Grading</span>
          </div>
        </div>
      </div>

      <div className="stats-grid">
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
          title="Total Students"
          value={stats.totalStudents || 0}
          icon="fas fa-users"
          trend={stats.studentsTrend}
        />
        <StatsCard
          title="Pending Grading"
          value={stats.pendingGrading || 0}
          icon="fas fa-hourglass-half"
          trend={stats.gradingTrend}
        />
      </div>

      <div className="dashboard-content">
        <div className="left-column">
          <div className="upcoming-exams">
            <div className="section-header">
              <h2>Upcoming Exams</h2>
              <Link to="/create-exam" className="create-btn">Create New</Link>
            </div>
            <div className="exams-list">
              {upcomingExams.length > 0 ? (
                upcomingExams.map((exam) => (
                  <ExamCard
                    key={exam._id}
                    exam={exam}
                    showEditButton={true}
                  />
                ))
              ) : (
                <div className="no-data">
                  <i className="fas fa-calendar-alt"></i>
                  <p>No upcoming exams</p>
                  <Link to="/create-exam" className="btn btn-primary">
                    Create Your First Exam
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="pending-grading">
            <div className="section-header">
              <h2>Pending Grading</h2>
              <Link to="/grading" className="view-all-btn">View All</Link>
            </div>
            <div className="grading-list">
              {pendingGrading.length > 0 ? (
                pendingGrading.map((submission) => (
                  <div key={submission._id} className="grading-item">
                    <div className="submission-info">
                      <h3>{submission.exam.title}</h3>
                      <p className="student-name">
                        {submission.student.firstName} {submission.student.lastName}
                      </p>
                      <p className="submission-date">
                        Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="grading-actions">
                      <Link 
                        to={`/grade-submission/${submission._id}`}
                        className="btn btn-primary btn-sm"
                      >
                        Grade Now
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">
                  <i className="fas fa-check-circle"></i>
                  <p>No pending grading</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="right-column">
          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <Link to="/create-exam" className="action-btn">
                <i className="fas fa-plus"></i>
                <span>Create Exam</span>
              </Link>
              <Link to="/exams" className="action-btn">
                <i className="fas fa-list"></i>
                <span>Manage Exams</span>
              </Link>
              <Link to="/questions" className="action-btn">
                <i className="fas fa-question"></i>
                <span>Question Bank</span>
              </Link>
              <Link to="/reports" className="action-btn">
                <i className="fas fa-chart-bar"></i>
                <span>Reports</span>
              </Link>
            </div>
          </div>

          <div className="recent-activity">
            <div className="section-header">
              <h2>Recent Activity</h2>
            </div>
            <div className="activity-list">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">
                      <i className={`fas ${activity.icon}`}></i>
                    </div>
                    <div className="activity-content">
                      <p>{activity.message}</p>
                      <span className="activity-time">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">
                  <i className="fas fa-clock"></i>
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;