// frontend/src/pages/ParentDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatsCard from '../components/StatsCard';
import SearchBar from '../components/SearchBar';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';
import './ParentDashboard.css';

const ParentDashboard = () => {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [childStats, setChildStats] = useState({});
  const [childExams, setChildExams] = useState([]);
  const [childResults, setChildResults] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showChildModal, setShowChildModal] = useState(false);
  const [newChildData, setNewChildData] = useState({
    name: '',
    email: '',
    studentId: ''
  });

  useEffect(() => {
    fetchParentDashboard();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      fetchChildData(selectedChild._id);
    }
  }, [selectedChild]);

  const fetchParentDashboard = async () => {
    try {
      const response = await api.get('/parent/dashboard');
      setChildren(response.data.children);
      setNotifications(response.data.notifications);
      if (response.data.children.length > 0) {
        setSelectedChild(response.data.children[0]);
      }
    } catch (error) {
      toast.error('Failed to fetch parent dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchChildData = async (childId) => {
    try {
      const response = await api.get(`/parent/child/${childId}`);
      setChildStats(response.data.stats);
      setChildExams(response.data.exams);
      setChildResults(response.data.results);
    } catch (error) {
      toast.error('Failed to fetch child data');
    }
  };

  const handleAddChild = async (e) => {
    e.preventDefault();
    try {
      await api.post('/parent/add-child', newChildData);
      toast.success('Child added successfully');
      setShowChildModal(false);
      setNewChildData({ name: '', email: '', studentId: '' });
      fetchParentDashboard();
    } catch (error) {
      toast.error('Failed to add child');
    }
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 90) return '#28a745';
    if (percentage >= 80) return '#17a2b8';
    if (percentage >= 70) return '#ffc107';
    if (percentage >= 60) return '#fd7e14';
    return '#dc3545';
  };

  const getPerformanceLabel = (percentage) => {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 80) return 'Good';
    if (percentage >= 70) return 'Average';
    if (percentage >= 60) return 'Below Average';
    return 'Needs Improvement';
  };

  if (loading) {
    return <div className="loading">Loading parent dashboard...</div>;
  }

  return (
    <div className="parent-dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Parent Dashboard</h1>
          <p>Monitor your children's academic progress</p>
        </div>
        <button 
          className="btn-add-child"
          onClick={() => setShowChildModal(true)}
        >
          <i className="fas fa-plus"></i>
          Add Child
        </button>
      </div>

      <div className="children-selector">
        <h3>Select Child:</h3>
        <div className="children-tabs">
          {children.map(child => (
            <button
              key={child._id}
              className={`child-tab ${selectedChild?._id === child._id ? 'active' : ''}`}
              onClick={() => setSelectedChild(child)}
            >
              <div className="child-info">
                <span className="child-name">{child.name}</span>
                <span className="child-email">{child.email}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedChild && (
        <div className="child-dashboard">
          <div className="child-header">
            <h2>{selectedChild.name}'s Progress</h2>
            <div className="child-meta">
              <span>Student ID: {selectedChild.studentId}</span>
              <span>Email: {selectedChild.email}</span>
            </div>
          </div>

          <div className="stats-grid">
            <StatsCard
              title="Total Exams"
              value={childStats.totalExams || 0}
              icon="fas fa-clipboard-list"
              trend={childStats.examsTrend}
            />
            <StatsCard
              title="Average Score"
              value={`${childStats.averageScore || 0}%`}
              icon="fas fa-chart-line"
              trend={childStats.scoreTrend}
            />
            <StatsCard
              title="Completed Exams"
              value={childStats.completedExams || 0}
              icon="fas fa-check-circle"
              trend={childStats.completedTrend}
            />
            <StatsCard
              title="Pending Exams"
              value={childStats.pendingExams || 0}
              icon="fas fa-clock"
              trend={childStats.pendingTrend}
            />
          </div>

          <div className="dashboard-content">
            <div className="main-content">
              <div className="upcoming-exams">
                <div className="section-header">
                  <h3>Upcoming Exams</h3>
                  <span className="count">{childExams.length} exams</span>
                </div>
                
                {childExams.length === 0 ? (
                  <div className="empty-state">
                    <i className="fas fa-calendar-check"></i>
                    <p>No upcoming exams</p>
                  </div>
                ) : (
                  <div className="exams-list">
                    {childExams.map(exam => (
                      <div key={exam._id} className="exam-item">
                        <div className="exam-info">
                          <h4>{exam.title}</h4>
                          <p className="exam-subject">{exam.subject}</p>
                          <div className="exam-details">
                            <span>
                              <i className="fas fa-calendar"></i>
                              {new Date(exam.startTime).toLocaleDateString()}
                            </span>
                            <span>
                              <i className="fas fa-clock"></i>
                              {exam.duration} minutes
                            </span>
                            <span>
                              <i className="fas fa-question-circle"></i>
                              {exam.questions?.length || 0} questions
                            </span>
                          </div>
                        </div>
                        <div className="exam-status">
                          <span className={`status-badge ${exam.status}`}>
                            {exam.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="recent-results">
                <div className="section-header">
                  <h3>Recent Results</h3>
                  <Link to={`/parent/child/${selectedChild._id}/results`} className="view-all-link">
                    View All
                  </Link>
                </div>
                
                {childResults.length === 0 ? (
                  <div className="empty-state">
                    <i className="fas fa-chart-bar"></i>
                    <p>No recent results</p>
                  </div>
                ) : (
                  <div className="results-list">
                    {childResults.map(result => (
                      <div key={result._id} className="result-item">
                        <div className="result-info">
                          <h4>{result.exam.title}</h4>
                          <p className="result-subject">{result.exam.subject}</p>
                          <p className="result-date">
                            Completed: {new Date(result.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="result-score">
                          <div className="score-display">
                            <span className="score-value">
                              {result.score}/{result.exam.totalMarks}
                            </span>
                            <span className="score-percentage">
                              {Math.round((result.score / result.exam.totalMarks) * 100)}%
                            </span>
                          </div>
                          <div 
                            className="performance-indicator"
                            style={{ 
                              backgroundColor: getPerformanceColor(
                                (result.score / result.exam.totalMarks) * 100
                              )
                            }}
                          >
                            {getPerformanceLabel(
                              (result.score / result.exam.totalMarks) * 100
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="performance-analytics">
                <div className="section-header">
                  <h3>Performance Analytics</h3>
                </div>
                
                <div className="analytics-grid">
                  <div className="analytics-card">
                    <h4>Subject Performance</h4>
                    <div className="subject-scores">
                      {childStats.subjectScores?.map(subject => (
                        <div key={subject.name} className="subject-score">
                          <span className="subject-name">{subject.name}</span>
                          <div className="score-bar">
                            <div 
                              className="score-fill"
                              style={{ 
                                width: `${subject.percentage}%`,
                                backgroundColor: getPerformanceColor(subject.percentage)
                              }}
                            ></div>
                          </div>
                          <span className="score-text">{subject.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="analytics-card">
                    <h4>Monthly Progress</h4>
                    <div className="progress-chart">
                      {childStats.monthlyProgress?.map(month => (
                        <div key={month.month} className="progress-item">
                          <span className="month-name">{month.month}</span>
                          <div className="progress-bar">
                            <div 
                              className="progress-fill"
                              style={{ 
                                width: `${month.score}%`,
                                backgroundColor: getPerformanceColor(month.score)
                              }}
                            ></div>
                          </div>
                          <span className="progress-score">{month.score}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sidebar">
              <div className="notifications-widget">
                <h3>Recent Notifications</h3>
                {notifications.length === 0 ? (
                  <div className="no-notifications">
                    <i className="fas fa-bell-slash"></i>
                    <p>No new notifications</p>
                  </div>
                ) : (
                  <div className="notifications-list">
                    {notifications.slice(0, 5).map(notification => (
                      <div key={notification._id} className="notification-item">
                        <div className="notification-icon">
                          <i className={notification.icon || 'fas fa-info-circle'}></i>
                        </div>
                        <div className="notification-content">
                          <p>{notification.message}</p>
                          <span className="notification-time">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="quick-actions-widget">
                <h3>Quick Actions</h3>
                <div className="quick-actions">
                  <Link to={`/parent/child/${selectedChild._id}/schedule`} className="quick-action">
                    <i className="fas fa-calendar-alt"></i>
                    <span>View Schedule</span>
                  </Link>
                  <Link to={`/parent/child/${selectedChild._id}/results`} className="quick-action">
                    <i className="fas fa-chart-line"></i>
                    <span>All Results</span>
                  </Link>
                  <Link to={`/parent/child/${selectedChild._id}/teachers`} className="quick-action">
                    <i className="fas fa-chalkboard-teacher"></i>
                    <span>Contact Teachers</span>
                  </Link>
                  <Link to="/notifications" className="quick-action">
                    <i className="fas fa-bell"></i>
                    <span>Notifications</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {children.length === 0 && (
        <div className="no-children">
          <i className="fas fa-user-plus"></i>
          <h3>No Children Added</h3>
          <p>Add your children to monitor their academic progress</p>
          <button 
            className="btn-add-first-child"
            onClick={() => setShowChildModal(true)}
          >
            Add Your First Child
          </button>
        </div>
      )}

      {/* Add Child Modal */}
      <Modal
        isOpen={showChildModal}
        onClose={() => setShowChildModal(false)}
        title="Add Child"
      >
        <form onSubmit={handleAddChild} className="add-child-form">
          <div className="form-group">
            <label>Child's Name</label>
            <input
              type="text"
              value={newChildData.name}
              onChange={(e) => setNewChildData({...newChildData, name: e.target.value})}
              required
              placeholder="Enter child's full name"
            />
          </div>
          
          <div className="form-group">
            <label>Child's Email</label>
            <input
              type="email"
              value={newChildData.email}
              onChange={(e) => setNewChildData({...newChildData, email: e.target.value})}
              required
              placeholder="Enter child's email address"
            />
          </div>
          
          <div className="form-group">
            <label>Student ID</label>
            <input
              type="text"
              value={newChildData.studentId}
              onChange={(e) => setNewChildData({...newChildData, studentId: e.target.value})}
              required
              placeholder="Enter student ID"
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={() => setShowChildModal(false)}>
              Cancel
            </button>
            <button type="submit">Add Child</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ParentDashboard;