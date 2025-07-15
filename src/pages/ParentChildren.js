import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';
import './ParentChildren.css';

const ParentChildren = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [newChildEmail, setNewChildEmail] = useState('');
  const [relationship, setRelationship] = useState('');

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching children list...');
      
      const response = await api.get('/parent/children');
      console.log('✅ Children response:', response.data);
      
      const data = response.data?.data || response.data;
      setChildren(Array.isArray(data) ? data : data.children || []);
    } catch (error) {
      console.error('❌ Error fetching children:', error);
      
      if (error.response?.status === 404) {
        // If children endpoint doesn't exist, try dashboard endpoint
        try {
          const dashboardResponse = await api.get('/parent/dashboard');
          const dashboardData = dashboardResponse.data?.data || dashboardResponse.data;
          setChildren(dashboardData.children || []);
        } catch (dashboardError) {
          console.error('❌ Error fetching from dashboard:', dashboardError);
          toast.error('Failed to load children data');
        }
      } else {
        toast.error('Failed to load children data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddChild = async (e) => {
    e.preventDefault();
    try {
      if (!newChildEmail.trim() || !relationship.trim()) {
        toast.error('Please fill in all fields');
        return;
      }

      await api.post('/parent/add-child', {
        childEmail: newChildEmail.trim(),
        relationship: relationship.trim()
      });

      toast.success('Child added successfully!');
      setShowAddChildModal(false);
      setNewChildEmail('');
      setRelationship('');
      fetchChildren();
    } catch (error) {
      console.error('Error adding child:', error);
      toast.error(error.response?.data?.message || 'Failed to add child');
    }
  };

  const handleRemoveChild = async (childId) => {
    if (!window.confirm('Are you sure you want to remove this child?')) {
      return;
    }

    try {
      await api.delete(`/parent/child/${childId}/remove`);
      toast.success('Child removed successfully');
      fetchChildren();
    } catch (error) {
      console.error('Error removing child:', error);
      toast.error('Failed to remove child');
    }
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 90) return '#28a745';
    if (percentage >= 80) return '#17a2b8';
    if (percentage >= 70) return '#ffc107';
    if (percentage >= 60) return '#fd7e14';
    return '#dc3545';
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="parent-children">
      <div className="container">
        <div className="page-header">
          <div className="header-content">
            <h1>My Children</h1>
            <p>Manage and monitor your children's academic journey</p>
          </div>
          <div className="header-actions">
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddChildModal(true)}
            >
              Add Child
            </button>
            <Link to="/parent/dashboard" className="btn btn-secondary">
              Back to Dashboard
            </Link>
          </div>
        </div>

        {children.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👨‍👩‍👧‍👦</div>
            <h3>No Children Added</h3>
            <p>Add your children to start monitoring their academic progress</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddChildModal(true)}
            >
              Add Your First Child
            </button>
          </div>
        ) : (
          <div className="children-grid">
            {children.map((child) => (
              <div key={child._id} className="child-card">
                <div className="child-header">
                  <div className="child-avatar">
                    {child.avatar ? (
                      <img src={`${process.env.REACT_APP_API_URL}/uploads/${child.avatar}`} alt={child.firstName} />
                    ) : (
                      <div className="avatar-placeholder">
                        {child.firstName?.[0]}{child.lastName?.[0]}
                      </div>
                    )}
                  </div>
                  <div className="child-info">
                    <h3>{child.firstName} {child.lastName}</h3>
                    <p className="child-email">{child.email}</p>
                    <p className="child-role">{child.grade || 'Student'}</p>
                  </div>
                  <div className="child-actions">
                    <button 
                      className="btn-icon btn-danger"
                      onClick={() => handleRemoveChild(child._id)}
                      title="Remove Child"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div className="child-stats">
                  <div className="stat-item">
                    <span className="stat-label">Total Exams</span>
                    <span className="stat-value">{child.stats?.totalExams || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Average Score</span>
                    <span 
                      className="stat-value"
                      style={{ color: getPerformanceColor(child.stats?.averageScore || 0) }}
                    >
                      {child.stats?.averageScore || 0}%
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Best Score</span>
                    <span 
                      className="stat-value"
                      style={{ color: getPerformanceColor(child.stats?.bestScore || 0) }}
                    >
                      {child.stats?.bestScore || 0}%
                    </span>
                  </div>
                </div>

                <div className="child-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${child.stats?.performance || 0}%`,
                        backgroundColor: getPerformanceColor(child.stats?.performance || 0)
                      }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    Overall Performance: {Math.round(child.stats?.performance || 0)}%
                  </span>
                </div>

                <div className="child-actions-bottom">
                  <Link 
                    to={`/parent/child/${child._id}/progress`}
                    className="btn btn-outline-primary btn-sm"
                  >
                    View Progress
                  </Link>
                  <Link 
                    to={`/parent/child/${child._id}/results`}
                    className="btn btn-outline-secondary btn-sm"
                  >
                    View Results
                  </Link>
                </div>

                {child.stats?.lastExamDate && (
                  <div className="last-activity">
                    <small>
                      Last exam: {new Date(child.stats.lastExamDate).toLocaleDateString()}
                    </small>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add Child Modal */}
        {showAddChildModal && (
          <div className="modal-overlay" onClick={() => setShowAddChildModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Add Child</h3>
                <button 
                  className="modal-close"
                  onClick={() => setShowAddChildModal(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleAddChild}>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="childEmail">Child's Email</label>
                    <input
                      type="email"
                      id="childEmail"
                      value={newChildEmail}
                      onChange={(e) => setNewChildEmail(e.target.value)}
                      placeholder="Enter your child's email address"
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
                      <option value="">Select Relationship</option>
                      <option value="father">Father</option>
                      <option value="mother">Mother</option>
                      <option value="guardian">Guardian</option>
                      <option value="parent">Parent</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
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
    </div>
  );
};

export default ParentChildren;
