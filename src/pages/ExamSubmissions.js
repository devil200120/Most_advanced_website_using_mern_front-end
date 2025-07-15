import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Loading from '../components/Loading';
import './ExamSubmissions.css';

const ExamSubmissions = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('submittedAt');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchExamData();
    fetchSubmissions();
    fetchStats();
  }, [examId, currentPage, searchTerm, statusFilter, sortBy, sortOrder]);

  const fetchExamData = async () => {
    try {
      const response = await api.get(`/exams/${examId}`);
      if (response.data.success) {
        setExam(response.data.data.exam);
      }
    } catch (error) {
      console.error('Error fetching exam:', error);
      alert('Error loading exam data');
      navigate('/exams');
    }
  };

  const fetchSubmissions = async () => {
    try {
      const params = new URLSearchParams({
        examId,
        page: currentPage,
        limit: 10,
        search: searchTerm,
        status: statusFilter,
        sortBy,
        sortOrder
      });

      const response = await api.get(`/submissions?${params}`);
      if (response.data.success) {
        setSubmissions(response.data.data.submissions);
        setTotalPages(response.data.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get(`/exams/${examId}/stats`);
      if (response.data.success) {
        setStats(response.data.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'grade-a';
    if (percentage >= 80) return 'grade-b';
    if (percentage >= 70) return 'grade-c';
    if (percentage >= 60) return 'grade-d';
    return 'grade-f';
  };

  const getStatusBadge = (submission) => {
    if (!submission.isSubmitted) return <span className="status-badge pending">In Progress</span>;
    if (!submission.isGraded) return <span className="status-badge reviewing">Reviewing</span>;
    if (submission.isPassed) return <span className="status-badge passed">Passed</span>;
    return <span className="status-badge failed">Failed</span>;
  };

  const exportSubmissions = async () => {
    try {
      const response = await api.get(`/exams/${examId}/export`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${exam?.title || 'exam'}_submissions.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting submissions:', error);
      alert('Error exporting submissions');
    }
  };

  if (loading) return <Loading message="Loading submissions..." />;

  return (
    <div className="exam-submissions-container">
      <div className="submissions-header">
        <div className="header-info">
          <button 
            onClick={() => navigate('/exams')} 
            className="back-btn"
          >
            <i className="fas fa-arrow-left"></i> Back to Exams
          </button>
          <div>
            <h1>{exam?.title} - Submissions</h1>
            <p className="exam-meta">
              {exam?.subject} • {exam?.grade} • {submissions.length} submissions
            </p>
          </div>
        </div>
        <div className="header-actions">
          <button onClick={exportSubmissions} className="btn btn-secondary">
            <i className="fas fa-download"></i> Export CSV
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalSubmissions || 0}</h3>
            <p>Total Submissions</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-percentage"></i>
          </div>
          <div className="stat-content">
            <h3>{Math.round(stats.averageScore || 0)}%</h3>
            <p>Average Score</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.passedCount || 0}</h3>
            <p>Passed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-times-circle"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.failedCount || 0}</h3>
            <p>Failed</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-filter">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by student name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="submitted">Submitted</option>
            <option value="graded">Graded</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <div className="sort-filter">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="submittedAt">Submission Date</option>
            <option value="percentage">Score</option>
            <option value="student.lastName">Student Name</option>
            <option value="timeTaken">Time Taken</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="sort-btn"
          >
            <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
          </button>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="submissions-table-container">
        <table className="submissions-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Score</th>
              <th>Grade</th>
              <th>Status</th>
              <th>Time Taken</th>
              <th>Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission._id}>
                <td className="student-cell">
                  <div className="student-info">
                    <div className="student-name">
                      {submission.student?.firstName} {submission.student?.lastName}
                    </div>
                    <div className="student-email">
                      {submission.student?.email}
                    </div>
                  </div>
                </td>
                <td className="score-cell">
                  <div className="score-container">
                    <span className="score-value">
                      {submission.marksObtained || 0}/{submission.totalMarks || 0}
                    </span>
                    <span className={`percentage ${getGradeColor(submission.percentage || 0)}`}>
                      {Math.round(submission.percentage || 0)}%
                    </span>
                  </div>
                </td>
                <td className="grade-cell">
                  <span className={`grade-badge ${getGradeColor(submission.percentage || 0)}`}>
                    {submission.grade || 'N/A'}
                  </span>
                </td>
                <td className="status-cell">
                  {getStatusBadge(submission)}
                </td>
                <td className="time-cell">
                  {submission.timeTaken || 0} min
                </td>
                <td className="date-cell">
                  {formatDate(submission.submittedAt)}
                </td>
                <td className="actions-cell">
                  <div className="action-buttons">
                    <Link
                      to={`/exam-result/${submission._id}`}
                      className="btn btn-sm btn-info"
                      title="View Details"
                    >
                      <i className="fas fa-eye"></i>
                    </Link>
                    {!submission.isGraded && (
                      <Link
                        to={`/grade-submission/${submission._id}`}
                        className="btn btn-sm btn-warning"
                        title="Grade Submission"
                      >
                        <i className="fas fa-edit"></i>
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {submissions.length === 0 && (
          <div className="no-submissions">
            <i className="fas fa-inbox"></i>
            <h3>No Submissions Found</h3>
            <p>No students have submitted this exam yet.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            <i className="fas fa-chevron-left"></i> Previous
          </button>
          
          <div className="page-numbers">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default ExamSubmissions;
