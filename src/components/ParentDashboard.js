import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatsCard from '../components/StatsCard';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';
import './ParentDashboard.css';

const ParentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    children: [],
    summary: {
      totalChildren: 0,
      totalExams: 0,
      averagePerformance: 0,
      activeChildren: 0
    },
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState(null);
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [newChildEmail, setNewChildEmail] = useState('');
  const [relationship, setRelationship] = useState('');
  const [roleError, setRoleError] = useState(null);

  // Test parent access first
  const testParentAccess = useCallback(async () => {
    try {
      console.log('Testing parent access...');
      const response = await api.get('/api/parent/test');
      console.log('Parent test response:', response.data);
      return true;
    } catch (error) {
      console.error('Parent test failed:', error);
      if (error.response?.status === 403) {
        setRoleError(`Access denied. Your role is '${user?.role}' but 'parent' role is required.`);
      } else if (error.response?.status === 401) {
        setRoleError('Authentication required. Please login again.');
        navigate('/login');
      } else {
        setRoleError('Unable to access parent features. Please contact support.');
      }
      return false;
    }
  }, [user, navigate]);

  const fetchParentDashboard = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching parent dashboard...');
      console.log('Current user:', user);
      
      // Test access first
      const hasAccess = await testParentAccess();
      if (!hasAccess) {
        setLoading(false);
        return;
      }
      
      const response = await api.get('/api/parent/dashboard');
      console.log('Dashboard response:', response.data);
      
      // Ensure the data structure is correct
      const data = response.data.data || response.data;
      
      // Set default structure if needed
      const processedData = {
        children: Array.isArray(data.children) ? data.children : [],
        summary: data.summary || {
          totalChildren: 0,
          totalExams: 0,
          averagePerformance: 0,
          activeChildren: 0
        },
        recentActivities: Array.isArray(data.recentActivities) ? data.recentActivities : []
      };
      
      setDashboardData(processedData);
      setRoleError(null); // Clear any previous role errors
      
      if (processedData.children.length > 0 && !selectedChild) {
        setSelectedChild(processedData.children[0]);
      }
    } catch (error) {
      console.error('Error fetching parent dashboard:', error);
      
      // Handle specific error cases
      if (error.response?.status === 404) {
        toast.error('Parent dashboard endpoint not found. Please check server configuration.');
      } else if (error.response?.status === 403) {
        const errorMessage = error.response?.data?.message || 'Access denied. Please ensure you have parent role assigned.';
        setRoleError(errorMessage);
        toast.error(errorMessage);
      } else if (error.response?.status === 401) {
        toast.error('Authentication required. Please login again.');
        navigate('/login');
        return;
      } else {
        toast.error('Failed to load dashboard data. Please try again.');
      }
      
      // Set empty data structure on error to prevent crashes
      setDashboardData({
        children: [],
        summary: {
          totalChildren: 0,
          totalExams: 0,
          averagePerformance: 0,
          activeChildren: 0
        },
        recentActivities: []
      });
    } finally {
      setLoading(false);
    }
  }, [navigate, selectedChild, testParentAccess, user]);

  useEffect(() => {
    if (user) {
      fetchParentDashboard();
    }
  }, [fetchParentDashboard, user]);

  const handleAddChild = async (e) => {
    e.preventDefault();
    try {
      if (!newChildEmail.trim() || !relationship.trim()) {
        toast.error('Please fill in all fields');
        return;
      }

      console.log('Adding child:', { childEmail: newChildEmail.trim(), relationship: relationship.trim() });
      
      const response = await api.post('/api/parent/add-child', {
        childEmail: newChildEmail.trim(),
        relationship: relationship.trim()
      });

      console.log('Add child response:', response.data);
      toast.success('Child added successfully!');
      setShowAddChildModal(false);
      setNewChildEmail('');
      setRelationship('');
      
      // Refresh dashboard after adding child
      fetchParentDashboard();
    } catch (error) {
      console.error('Error adding child:', error);
      toast.error(error.response?.data?.message || 'Failed to add child');
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

  // Show loading state
  if (loading) {
    return <Loading message="Loading parent dashboard..." />;
  }

  // Show role error if user doesn't have parent access
  if (roleError) {
    return (
      <div className="error-container" style={{ 
        textAlign: 'center', 
        padding: '2rem',
        maxWidth: '600px',
        margin: '2rem auto',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <div style={{ color: '#dc3545', fontSize: '3rem', marginBottom: '1rem' }}>
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        <h2 style={{ color: '#dc3545', marginBottom: '1rem' }}>Access Restricted</h2>
        <p style={{ marginBottom: '1.5rem', color: '#6c757d' }}>{roleError}</p>
        
        <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
          <strong>Current User Details:</strong><br />
          Email: {user?.email}<br />
          Role: {user?.role}<br />
          Required Role: parent
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link 
            to="/dashboard" 
            className="btn btn-secondary"
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: '#6c757d', 
              color: 'white', 
              textDecoration: 'none',
              borderRadius: '4px'
            }}
          >
            Go to Dashboard
          </Link>
          <button 
            onClick={() => window.location.reload()}
            className="btn btn-primary"
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Destructure with defaults to prevent errors
  const { children = [], summary = {}, recentActivities = [] } = dashboardData;

  return (
    <div className="parent-dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {user?.firstName || 'Parent'}!</h1>
          <p>Monitor your children's academic progress and exam performance</p>
          {process.env.NODE_ENV === 'development' && (
            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
              Debug: User role: {user?.role} | Children count: {children.length}
            </div>
          )}
        </div>
        
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddChildModal(true)}
          >
            <i className="fas fa-plus"></i>
            Add Child
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid">
        <StatsCard
          title="Total Children"
          value={summary.totalChildren || 0}
          icon="fas fa-users"
          trend="neutral"
        />
        <StatsCard
          title="Total Exams Taken"
          value={summary.totalExams || 0}
          icon="fas fa-clipboard-check"
          trend="up"
        />
        <StatsCard
          title="Average Performance"
          value={`${summary.averagePerformance || 0}%`}
          icon="fas fa-chart-line"
          trend={(summary.averagePerformance || 0) >= 75 ? 'up' : 'down'}
        />
        <StatsCard
          title="Active This Week"
          value={summary.activeChildren || 0}
          icon="fas fa-calendar-week"
          trend="up"
        />
      </div>

      <div className="dashboard-content">
        <div className="left-section">
          {/* Children Overview */}
          <div className="children-section">
            <div className="section-header">
              <h2>Your Children</h2>
              <span className="count">{children.length} children</span>
            </div>
            
            <div className="children-grid">
              {children.length > 0 ? (
                children.map((child) => (
                  <div 
                    key={child._id} 
                    className={`child-card ${selectedChild?._id === child._id ? 'selected' : ''}`}
                    onClick={() => setSelectedChild(child)}
                  >
                    <div className="child-avatar">
                      {child.avatar ? (
                        <img src={child.avatar} alt={`${child.firstName} ${child.lastName}`} />
                      ) : (
                        <div className="avatar-placeholder">
                          {child.firstName?.[0] || 'U'}{child.lastName?.[0] || 'U'}
                        </div>
                      )}
                    </div>
                    
                    <div className="child-info">
                      <h3>{child.firstName} {child.lastName}</h3>
                      <p className="child-email">{child.email}</p>
                      <p className="child-grade">Grade: {child.grade || 'Not specified'}</p>
                    </div>
                    
                    <div className="child-stats">
                      <div className="stat-item">
                        <span className="stat-value">{child.stats?.totalExams || 0}</span>
                        <span className="stat-label">Exams</span>
                      </div>
                      <div className="stat-item">
                        <span 
                          className="stat-value"
                          style={{ color: getPerformanceColor(child.stats?.performance || 0) }}
                        >
                          {(child.stats?.performance || 0).toFixed(0)}%
                        </span>
                        <span className="stat-label">Performance</span>
                      </div>
                    </div>
                    
                    <div className="child-actions">
                      <Link 
                        to={`/parent/child/${child._id}/progress`}
                        className="btn btn-sm btn-primary"
                      >
                        View Progress
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <i className="fas fa-user-plus"></i>
                  <h3>No children added yet</h3>
                  <p>Add your children to track their exam progress</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowAddChildModal(true)}
                  >
                    Add Your First Child
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="right-section">
          {/* Recent Activities */}
          <div className="activities-section">
            <h2>Recent Activities</h2>
            <div className="activities-list">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={activity.id || `activity-${index}`} className="activity-item">
                    <div className="activity-icon">
                      <i className="fas fa-clipboard-check"></i>
                    </div>
                    <div className="activity-content">
                      <p>
                        <strong>{activity.childName}</strong> completed{' '}
                        <span className="exam-title">{activity.examTitle}</span>
                      </p>
                      <div className="activity-meta">
                        <span className="subject">{activity.subject}</span>
                        <span className="score">Score: {activity.score}%</span>
                        <span className="date">
                          {new Date(activity.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-activities">
                  <i className="fas fa-calendar-alt"></i>
                  <p>No recent activities</p>
                </div>
              )}
            </div>
          </div>

          {/* Performance Overview */}
          {selectedChild && (
            <div className="performance-section">
              <h2>Performance Overview: {selectedChild.firstName}</h2>
              <div className="performance-card">
                <div className="performance-header">
                  <div className="performance-score">
                    <span 
                      className="score-value"
                      style={{ color: getPerformanceColor(selectedChild.stats?.performance || 0) }}
                    >
                      {(selectedChild.stats?.performance || 0).toFixed(0)}%
                    </span>
                    <span className="score-label">
                      {getPerformanceLabel(selectedChild.stats?.performance || 0)}
                    </span>
                  </div>
                </div>
                
                <div className="performance-stats">
                  <div className="stat-row">
                    <span>Total Exams:</span>
                    <span>{selectedChild.stats?.totalExams || 0}</span>
                  </div>
                  <div className="stat-row">
                    <span>Best Score:</span>
                    <span>{selectedChild.stats?.bestScore || 0}%</span>
                  </div>
                  <div className="stat-row">
                    <span>Recent Score:</span>
                    <span>{selectedChild.stats?.recentScore || 0}%</span>
                  </div>
                </div>
                
                <Link 
                  to={`/parent/child/${selectedChild._id}/progress`}
                  className="btn btn-primary btn-full"
                >
                  View Detailed Progress
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Child Modal */}
      {showAddChildModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add Child</h2>
              <button 
                className="close-btn"
                onClick={() => setShowAddChildModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleAddChild} className="modal-form">
              <div className="form-group">
                <label htmlFor="childEmail">Child's Email Address</label>
                <input
                  type="email"
                  id="childEmail"
                  value={newChildEmail}
                  onChange={(e) => setNewChildEmail(e.target.value)}
                  placeholder="Enter child's email"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="relationship">Relationship</label>
                <select
                  id="relationship"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  required
                >
                  <option value="">Select relationship</option>
                  <option value="father">Father</option>
                  <option value="mother">Mother</option>
                  <option value="guardian">Guardian</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowAddChildModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Child
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;
