import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';
import './AdminExams.css';

const AdminExams = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    subject: '',
    status: '',
    search: '',
    sort: 'createdAt'
  });

  useEffect(() => {
    fetchExams();
  }, [currentPage, filters]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching exams with filters:', filters);
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        sort: filters.sort
      });
      
      if (filters.subject) params.append('subject', filters.subject);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get(`/exams?${params.toString()}`);
      console.log('✅ Exams response:', response.data);
      
      if (response.data.success) {
        setExams(response.data.data.exams || response.data.data);
        setTotalPages(response.data.data.totalPages || 1);
      }
    } catch (error) {
      console.error('❌ Error fetching exams:', error);
      toast.error('Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleDeleteExam = async (examId) => {
    if (!window.confirm('Are you sure you want to delete this exam? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await api.delete(`/exams/${examId}`);
      if (response.data.success) {
        toast.success('Exam deleted successfully');
        fetchExams();
      }
    } catch (error) {
      console.error('Error deleting exam:', error);
      toast.error(error.response?.data?.message || 'Failed to delete exam');
    }
  };

  const getStatusBadgeClass = (isActive, isPublished) => {
    if (isPublished && isActive) return 'badge-success';
    if (isPublished && !isActive) return 'badge-warning';
    return 'badge-secondary';
  };

  const getStatusText = (isActive, isPublished) => {
    if (isPublished && isActive) return 'Active';
    if (isPublished && !isActive) return 'Published';
    return 'Draft';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && exams.length === 0) {
    return <Loading />;
  }

  return (
    <div className="admin-exams">
      <div className="container">
        <div className="page-header">
          <div className="header-content">
            <h1>Exam Management</h1>
            <p>Manage all exams in the system</p>
          </div>
          <div className="header-actions">
            <Link to="/create-exam" className="btn btn-primary">
              Create New Exam
            </Link>
            <Link to="/admin/dashboard" className="btn btn-secondary">
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-row">
            <div className="filter-group">
              <label htmlFor="search">Search Exams:</label>
              <input
                type="text"
                id="search"
                placeholder="Search by title or description..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label htmlFor="subject">Filter by Subject:</label>
              <select
                id="subject"
                value={filters.subject}
                onChange={(e) => handleFilterChange('subject', e.target.value)}
              >
                <option value="">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
                <option value="History">History</option>
                <option value="Computer Science">Computer Science</option>
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="status">Filter by Status:</label>
              <select
                id="status"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Exams Table */}
        <div className="exams-table-container">
          {loading ? (
            <div className="loading-overlay">
              <Loading />
            </div>
          ) : (
            <table className="exams-table">
              <thead>
                <tr>
                  <th>Exam Title</th>
                  <th>Subject</th>
                  <th>Created By</th>
                  <th>Questions</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams.length > 0 ? (
                  exams.map((exam) => (
                    <tr key={exam._id}>
                      <td>
                        <div className="exam-info">
                          <span className="exam-title">{exam.title}</span>
                          <span className="exam-description">{exam.description}</span>
                        </div>
                      </td>
                      <td>{exam.subject}</td>
                      <td>
                        {exam.createdBy?.firstName} {exam.createdBy?.lastName}
                      </td>
                      <td>{exam.questions?.length || 0}</td>
                      <td>{exam.duration} min</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(exam.isActive, exam.isPublished)}`}>
                          {getStatusText(exam.isActive, exam.isPublished)}
                        </span>
                      </td>
                      <td>{formatDate(exam.createdAt)}</td>
                      <td>
                        <div className="action-buttons">
                          <Link 
                            to={`/admin/exams/${exam._id}`}
                            className="btn btn-sm btn-outline-primary"
                            title="View Exam"
                          >
                            View
                          </Link>
                          <Link 
                            to={`/exam/${exam._id}/edit`}
                            className="btn btn-sm btn-outline-secondary"
                            title="Edit Exam"
                          >
                            Edit
                          </Link>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteExam(exam._id)}
                            title="Delete Exam"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="no-data">
                      No exams found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="btn btn-sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              className="btn btn-sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}

        {/* Statistics */}
        <div className="exams-stats">
          <div className="stat-card">
            <h3>Total Exams</h3>
            <p className="stat-number">{exams.length}</p>
          </div>
          <div className="stat-card">
            <h3>Active Exams</h3>
            <p className="stat-number">
              {exams.filter(e => e.isActive && e.isPublished).length}
            </p>
          </div>
          <div className="stat-card">
            <h3>Draft Exams</h3>
            <p className="stat-number">
              {exams.filter(e => !e.isPublished).length}
            </p>
          </div>
          <div className="stat-card">
            <h3>Published Exams</h3>
            <p className="stat-number">
              {exams.filter(e => e.isPublished).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminExams;
