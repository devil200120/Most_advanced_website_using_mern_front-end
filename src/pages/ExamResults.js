import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Loading from '../components/Loading';
import './ExamResults.css';

const ExamResults = () => {
  const { examId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [exam, setExam] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    grade: 'all',
    sortBy: 'submittedAt',
    sortOrder: 'desc',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchExamResults();
  }, [examId, filters, currentPage]);

  const fetchExamResults = async () => {
    try {
      setLoading(true);
      
      // Fetch exam details
      const examResponse = await api.get(`/exams/${examId}`);
      if (examResponse.data.success) {
        setExam(examResponse.data.data.exam);
      }

      // Fetch submissions
      const submissionsResponse = await api.get(`/submissions`, {
        params: {
          examId,
          page: currentPage,
          limit: itemsPerPage,
          ...filters
        }
      });

      if (submissionsResponse.data.success) {
        setSubmissions(submissionsResponse.data.data.submissions);
      }

      // Fetch statistics
      const statsResponse = await api.get(`/exams/${examId}/stats`);
      if (statsResponse.data.success) {
        setStatistics(statsResponse.data.data.stats);
      }

    } catch (error) {
      console.error('Error fetching exam results:', error);
      setError(error.response?.data?.message || 'Failed to load exam results');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleExportResults = async () => {
    try {
      const response = await api.get(`/exams/${examId}/export`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${exam?.title}-results.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting results:', error);
      alert('Failed to export results');
    }
  };

  const getGradeColor = (grade) => {
    const gradeColors = {
      'A+': 'grade-a-plus',
      'A': 'grade-a',
      'B+': 'grade-b-plus',
      'B': 'grade-b',
      'C': 'grade-c',
      'D': 'grade-d',
      'F': 'grade-f'
    };
    return gradeColors[grade] || 'grade-default';
  };

  const getStatusColor = (submission) => {
    if (!submission.isSubmitted) return 'status-in-progress';
    if (submission.isPassed) return 'status-passed';
    return 'status-failed';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const calculatePercentile = (score, allScores) => {
    const sortedScores = allScores.sort((a, b) => a - b);
    const index = sortedScores.findIndex(s => s >= score);
    return Math.round((index / sortedScores.length) * 100);
  };

  if (loading) return <Loading message="Loading exam results..." />;

  if (error) {
    return (
      <div className="exam-results-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h2>Error Loading Results</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="exam-results-container">
        <div className="error-state">
          <div className="error-icon">📊</div>
          <h2>Exam Not Found</h2>
          <p>The exam you're looking for doesn't exist or you don't have permission to view it.</p>
          <Link to="/exams" className="btn btn-primary">
            Back to Exams
          </Link>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil((statistics.totalSubmissions || 0) / itemsPerPage);
  const allScores = submissions.map(s => s.percentage || 0);

  return (
    <div className="exam-results-container">
      <div className="exam-results-wrapper">
        
        {/* Header */}
        <div className="results-header">
          <div className="header-content">
            <div className="header-info">
              <div className="breadcrumb">
                <Link to="/exams">Exams</Link>
                <span>/</span>
                <span>Results</span>
              </div>
              <h1>📊 Exam Results</h1>
              <div className="exam-title">{exam.title}</div>
              <div className="exam-meta">
                <div className="meta-item">
                  <i className="fas fa-book"></i>
                  <span>{exam.subject}</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-layer-group"></i>
                  <span>Grade {exam.grade}</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-clock"></i>
                  <span>{exam.duration} minutes</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-star"></i>
                  <span>{exam.totalMarks} marks</span>
                </div>
              </div>
            </div>
            <div className="header-actions">
              <button 
                className="btn btn-secondary"
                onClick={handleExportResults}
              >
                <i className="fas fa-download"></i>
                Export Results
              </button>
              <Link 
                to={`/exam/edit/${examId}`}
                className="btn btn-primary"
              >
                <i className="fas fa-edit"></i>
                Edit Exam
              </Link>
            </div>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="results-stats">
          <div className="stats-grid">
            <div className="stat-card total">
              <div className="stat-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-content">
                <h3>{statistics.totalSubmissions || 0}</h3>
                <p>Total Submissions</p>
              </div>
            </div>
            
            <div className="stat-card average">
              <div className="stat-icon">
                <i className="fas fa-chart-bar"></i>
              </div>
              <div className="stat-content">
                <h3>{Math.round(statistics.averageScore || 0)}%</h3>
                <p>Average Score</p>
              </div>
            </div>
            
            <div className="stat-card passed">
              <div className="stat-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-content">
                <h3>{statistics.passedCount || 0}</h3>
                <p>Students Passed</p>
              </div>
            </div>
            
            <div className="stat-card failed">
              <div className="stat-icon">
                <i className="fas fa-times-circle"></i>
              </div>
              <div className="stat-content">
                <h3>{statistics.failedCount || 0}</h3>
                <p>Students Failed</p>
              </div>
            </div>
            
            <div className="stat-card highest">
              <div className="stat-icon">
                <i className="fas fa-trophy"></i>
              </div>
              <div className="stat-content">
                <h3>{Math.round(statistics.highestScore || 0)}%</h3>
                <p>Highest Score</p>
              </div>
            </div>
            
            <div className="stat-card lowest">
              <div className="stat-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="stat-content">
                <h3>{Math.round(statistics.lowestScore || 0)}%</h3>
                <p>Lowest Score</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="results-controls">
          <div className="controls-row">
            <div className="search-group">
              <div className="search-input-group">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search students..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
            </div>
            
            <div className="filter-group">
              <select
                className="form-select"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="passed">Passed</option>
                <option value="failed">Failed</option>
                <option value="in-progress">In Progress</option>
              </select>
            </div>
            
            <div className="filter-group">
              <select
                className="form-select"
                value={filters.grade}
                onChange={(e) => handleFilterChange('grade', e.target.value)}
              >
                <option value="all">All Grades</option>
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="B+">B+</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="F">F</option>
              </select>
            </div>
            
            <div className="sort-group">
              <select
                className="form-select"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="submittedAt">Submission Date</option>
                <option value="percentage">Score</option>
                <option value="timeTaken">Time Taken</option>
                <option value="studentName">Student Name</option>
              </select>
              <button
                className="sort-order-btn"
                onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                <i className={`fas fa-sort-${filters.sortOrder === 'asc' ? 'up' : 'down'}`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="results-table-container">
          {submissions.length > 0 ? (
            <>
              <div className="results-table">
                <div className="table-header">
                  <div className="header-cell student-col">
                    <button onClick={() => handleSort('studentName')}>
                      Student
                      {filters.sortBy === 'studentName' && (
                        <i className={`fas fa-sort-${filters.sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                      )}
                    </button>
                  </div>
                  <div className="header-cell score-col">
                    <button onClick={() => handleSort('percentage')}>
                      Score
                      {filters.sortBy === 'percentage' && (
                        <i className={`fas fa-sort-${filters.sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                      )}
                    </button>
                  </div>
                  <div className="header-cell grade-col">Grade</div>
                  <div className="header-cell time-col">
                    <button onClick={() => handleSort('timeTaken')}>
                      Time Taken
                      {filters.sortBy === 'timeTaken' && (
                        <i className={`fas fa-sort-${filters.sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                      )}
                    </button>
                  </div>
                  <div className="header-cell status-col">Status</div>
                  <div className="header-cell date-col">
                    <button onClick={() => handleSort('submittedAt')}>
                      Submitted
                      {filters.sortBy === 'submittedAt' && (
                        <i className={`fas fa-sort-${filters.sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                      )}
                    </button>
                  </div>
                  <div className="header-cell actions-col">Actions</div>
                </div>

                <div className="table-body">
                  {submissions.map((submission, index) => (
                    <div key={submission._id} className="table-row">
                      <div className="table-cell student-col">
                        <div className="student-info">
                          <div className="student-avatar">
                            {submission.student?.firstName?.[0]}{submission.student?.lastName?.[0]}
                          </div>
                          <div className="student-details">
                            <div className="student-name">
                              {submission.student?.firstName} {submission.student?.lastName}
                            </div>
                            <div className="student-email">
                              {submission.student?.email}
                            </div>
                            <div className="student-rank">
                              Rank #{index + 1}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="table-cell score-col">
                        <div className="score-display">
                          <div className="score-circle">
                            <div className="score-percentage">
                              {Math.round(submission.percentage || 0)}%
                            </div>
                            <div className="score-fraction">
                              {submission.marksObtained || 0}/{submission.totalMarks || exam.totalMarks}
                            </div>
                          </div>
                          <div className="percentile">
                            {calculatePercentile(submission.percentage || 0, allScores)}th percentile
                          </div>
                        </div>
                      </div>
                      
                      <div className="table-cell grade-col">
                        <div className={`grade-badge ${getGradeColor(submission.grade)}`}>
                          {submission.grade || 'N/A'}
                        </div>
                      </div>
                      
                      <div className="table-cell time-col">
                        <div className="time-display">
                          <div className="time-taken">
                            {formatDuration(submission.timeTaken || 0)}
                          </div>
                          <div className="time-efficiency">
                            {submission.timeTaken && exam.duration ? 
                              `${Math.round((submission.timeTaken / exam.duration) * 100)}% of time used` : 
                              'N/A'
                            }
                          </div>
                        </div>
                      </div>
                      
                      <div className="table-cell status-col">
                        <div className={`status-badge ${getStatusColor(submission)}`}>
                          {!submission.isSubmitted ? 'In Progress' : 
                           submission.isPassed ? 'Passed' : 'Failed'}
                        </div>
                      </div>
                      
                      <div className="table-cell date-col">
                        <div className="date-display">
                          {submission.submittedAt ? formatDate(submission.submittedAt) : 'Not submitted'}
                        </div>
                      </div>
                      
                      <div className="table-cell actions-col">
                        <div className="actions-group">
                          <Link 
                            to={`/exam-result/${submission._id}`}
                            className="btn btn-sm btn-secondary"
                            title="View Details"
                          >
                            <i className="fas fa-eye"></i>
                          </Link>
                          {user?.role === 'teacher' && (
                            <Link 
                              to={`/grade-submission/${submission._id}`}
                              className="btn btn-sm btn-primary"
                              title="Grade Submission"
                            >
                              <i className="fas fa-pen"></i>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="results-pagination">
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                  
                  <div className="pagination-info">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, statistics.totalSubmissions || 0)} of {statistics.totalSubmissions || 0} results
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="empty-results">
              <div className="empty-content">
                <i className="fas fa-clipboard-list"></i>
                <h3>No Results Found</h3>
                <p>No submissions found for this exam with the current filters.</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setFilters({
                    status: 'all',
                    grade: 'all',
                    sortBy: 'submittedAt',
                    sortOrder: 'desc',
                    search: ''
                  })}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Analytics Section */}
        <div className="results-analytics">
          <div className="analytics-header">
            <h2>📈 Performance Analytics</h2>
          </div>
          
          <div className="analytics-grid">
            <div className="analytics-card grade-distribution">
              <h3>Grade Distribution</h3>
              <div className="grade-chart">
                {['A+', 'A', 'B+', 'B', 'C', 'D', 'F'].map(grade => {
                  const count = submissions.filter(s => s.grade === grade).length;
                  const percentage = submissions.length ? (count / submissions.length * 100) : 0;
                  return (
                    <div key={grade} className="grade-bar">
                      <div className="grade-label">{grade}</div>
                      <div className="bar-container">
                        <div 
                          className={`bar-fill ${getGradeColor(grade)}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="grade-count">{count}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="analytics-card score-distribution">
              <h3>Score Distribution</h3>
              <div className="score-ranges">
                {[
                  { range: '90-100%', min: 90, max: 100, color: 'range-excellent' },
                  { range: '80-89%', min: 80, max: 89, color: 'range-good' },
                  { range: '70-79%', min: 70, max: 79, color: 'range-average' },
                  { range: '60-69%', min: 60, max: 69, color: 'range-below' },
                  { range: '0-59%', min: 0, max: 59, color: 'range-poor' }
                ].map(range => {
                  const count = submissions.filter(s => 
                    (s.percentage || 0) >= range.min && (s.percentage || 0) <= range.max
                  ).length;
                  const percentage = submissions.length ? (count / submissions.length * 100) : 0;
                  
                  return (
                    <div key={range.range} className="score-range">
                      <div className="range-label">{range.range}</div>
                      <div className="range-bar">
                        <div 
                          className={`range-fill ${range.color}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="range-count">{count} students</div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="analytics-card completion-stats">
              <h3>Completion Statistics</h3>
              <div className="completion-metrics">
                <div className="metric">
                  <div className="metric-label">Average Time Taken</div>
                  <div className="metric-value">
                    {formatDuration(
                      Math.round(
                        submissions.reduce((sum, s) => sum + (s.timeTaken || 0), 0) / 
                        (submissions.length || 1)
                      )
                    )}
                  </div>
                </div>
                <div className="metric">
                  <div className="metric-label">Completion Rate</div>
                  <div className="metric-value">
                    {submissions.length && statistics.totalSubmissions ? 
                      Math.round((submissions.filter(s => s.isSubmitted).length / statistics.totalSubmissions) * 100) : 0}%
                  </div>
                </div>
                <div className="metric">
                  <div className="metric-label">Pass Rate</div>
                  <div className="metric-value">
                    {submissions.length ? 
                      Math.round((submissions.filter(s => s.isPassed).length / submissions.length) * 100) : 0}%
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

export default ExamResults;
