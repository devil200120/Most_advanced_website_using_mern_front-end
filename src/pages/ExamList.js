import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useExam } from '../context/ExamContext';
import Loading from '../components/Loading';
import './ExamList.css';

const ExamList = () => {
  const { user } = useAuth();
  const { exams, fetchExams, loading } = useExam();
  const [filteredExams, setFilteredExams] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    subject: 'all',
    search: '',
    sortBy: 'startTime',
    sortOrder: 'desc'
  });
  const [subjects, setSubjects] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    ongoing: 0,
    completed: 0
  });

  useEffect(() => {
    loadExams();
  }, []);

  useEffect(() => {
    filterAndSortExams();
    calculateStats();
  }, [exams, filters]);

  const loadExams = async () => {
    await fetchExams();
  };

  const calculateStats = () => {
    const now = new Date();
    const newStats = {
      total: exams.length,
      upcoming: 0,
      ongoing: 0,
      completed: 0
    };

    exams.forEach(exam => {
      const startTime = new Date(exam.schedule?.startDate || exam.startTime);
      const endTime = new Date(exam.schedule?.endDate || exam.endTime);

      if (now < startTime) {
        newStats.upcoming++;
      } else if (now >= startTime && now <= endTime) {
        newStats.ongoing++;
      } else {
        newStats.completed++;
      }
    });

    setStats(newStats);
  };

  const filterAndSortExams = () => {
    let filtered = [...exams];

    // Extract unique subjects
    const uniqueSubjects = [...new Set(exams.map(exam => exam.subject))];
    setSubjects(uniqueSubjects);

    // Filter by status
    if (filters.status !== 'all') {
      const now = new Date();
      filtered = filtered.filter(exam => {
        const startTime = new Date(exam.schedule?.startDate || exam.startTime);
        const endTime = new Date(exam.schedule?.endDate || exam.endTime);
        
        switch (filters.status) {
          case 'upcoming':
            return now < startTime;
          case 'ongoing':
            return now >= startTime && now <= endTime;
          case 'completed':
            return now > endTime;
          default:
            return true;
        }
      });
    }

    // Filter by subject
    if (filters.subject !== 'all') {
      filtered = filtered.filter(exam => exam.subject === filters.subject);
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(exam =>
        exam.title.toLowerCase().includes(searchLower) ||
        exam.subject.toLowerCase().includes(searchLower) ||
        exam.description?.toLowerCase().includes(searchLower)
      );
    }

    // Sort exams
    filtered.sort((a, b) => {
      let aValue = a[filters.sortBy];
      let bValue = b[filters.sortBy];

      if (filters.sortBy === 'startTime' || filters.sortBy === 'endTime') {
        if (filters.sortBy === 'startTime') {
          aValue = new Date(a.schedule?.startDate || a.startTime);
          bValue = new Date(b.schedule?.startDate || b.startTime);
        } else {
          aValue = new Date(a.schedule?.endDate || a.endTime);
          bValue = new Date(b.schedule?.endDate || b.endTime);
        }
      }

      if (filters.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredExams(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      subject: 'all',
      search: '',
      sortBy: 'startTime',
      sortOrder: 'desc'
    });
  };

  const getStatusColor = (exam) => {
    const now = new Date();
    const startTime = new Date(exam.schedule?.startDate || exam.startTime);
    const endTime = new Date(exam.schedule?.endDate || exam.endTime);

    if (now < startTime) return 'upcoming';
    if (now >= startTime && now <= endTime) return 'ongoing';
    return 'completed';
  };

  const getStatusText = (exam) => {
    const now = new Date();
    const startTime = new Date(exam.schedule?.startDate || exam.startTime);
    const endTime = new Date(exam.schedule?.endDate || exam.endTime);

    if (now < startTime) return 'UPCOMING';
    if (now >= startTime && now <= endTime) return 'ONGOING';
    return 'COMPLETED';
  };

  const formatDuration = (duration) => {
    if (duration >= 60) {
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${duration}m`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRemainingTime = (exam) => {
    const now = new Date();
    const startTime = new Date(exam.schedule?.startDate || exam.startTime);
    const endTime = new Date(exam.schedule?.endDate || exam.endTime);

    if (now < startTime) {
      const diff = startTime - now;
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return `Starts in ${days} day${days > 1 ? 's' : ''}`;
    } else if (now >= startTime && now <= endTime) {
      const diff = endTime - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m remaining`;
    }
    return 'Completed';
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="exam-list-container">
      {/* Header Section */}
      <div className="exam-list-header">
        <div className="header-content">
          <div className="header-text">
            <h1>
              {user?.role === 'teacher' ? 'My Exams' : 'Available Exams'}
            </h1>
            <p>
              {user?.role === 'teacher' 
                ? 'Manage and monitor your created exams'
                : 'Browse and take available examinations'
              }
            </p>
          </div>
          
          {user?.role === 'teacher' && (
            <div className="header-actions">
              <Link to="/create-exam" className="btn btn-primary">
                <i className="fas fa-plus"></i>
                Create New Exam
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="exam-stats">
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">
              <i className="fas fa-clipboard-list"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.total}</h3>
              <p>Total Exams</p>
            </div>
          </div>
          
          <div className="stat-card upcoming">
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.upcoming}</h3>
              <p>Upcoming</p>
            </div>
          </div>
          
          <div className="stat-card ongoing">
            <div className="stat-icon">
              <i className="fas fa-play-circle"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.ongoing}</h3>
              <p>Ongoing</p>
            </div>
          </div>
          
          <div className="stat-card completed">
            <div className="stat-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.completed}</h3>
              <p>Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="exam-filters">
        <div className="filters-header">
          <h3>
            <i className="fas fa-filter"></i>
            Filter & Search
          </h3>
          <button className="btn btn-outline btn-sm" onClick={clearFilters}>
            <i className="fas fa-times"></i>
            Clear All
          </button>
        </div>

        <div className="filters-content">
          <div className="search-box">
            <div className="search-input-wrapper">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                placeholder="Search exams by title, subject, or description..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="filters-row">
            <div className="filter-select">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="filter-select">
              <label htmlFor="subject">Subject</label>
              <select
                id="subject"
                value={filters.subject}
                onChange={(e) => handleFilterChange('subject', e.target.value)}
              >
                <option value="all">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div className="filter-select">
              <label htmlFor="sortBy">Sort By</label>
              <div className="sort-wrapper">
                <select
                  id="sortBy"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <option value="startTime">Start Time</option>
                  <option value="title">Title</option>
                  <option value="subject">Subject</option>
                  <option value="duration">Duration</option>
                </select>
                
                <button
                  className={`sort-order-btn ${filters.sortOrder}`}
                  onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                  title={`Sort ${filters.sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                >
                  <i className={`fas fa-sort-${filters.sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="results-summary">
          <span className="results-count">
            <i className="fas fa-list"></i>
            Showing {filteredExams.length} of {exams.length} exams
          </span>
        </div>
      </div>

      {/* Exam List Content */}
      <div className="exam-list-content">
        {filteredExams.length > 0 ? (
          <div className="exams-grid">
            {filteredExams.map((exam, index) => (
              <div key={exam._id} className="exam-card" style={{ animationDelay: `${index * 0.1}s` }}>
                {/* Card Header */}
                <div className="exam-card-header">
                  <div className="exam-title-section">
                    <h3 className="exam-title">{exam.title}</h3>
                    <span className={`exam-status-badge ${getStatusColor(exam)}`}>
                      {getStatusText(exam)}
                    </span>
                  </div>
                  <div className="exam-subject-badge">
                    {exam.subject}
                  </div>
                </div>

                {/* Card Body */}
                <div className="exam-card-body">
                  <div className="exam-description">
                    {exam.description || 'No description available for this exam.'}
                  </div>

                  <div className="exam-info-grid">
                    <div className="exam-info-item">
                      <div className="info-icon">
                        <i className="fas fa-calendar-alt"></i>
                      </div>
                      <div className="info-content">
                        <span className="info-label">Date</span>
                        <span className="info-value">{formatDate(exam.schedule?.startDate || exam.startTime)}</span>
                      </div>
                    </div>

                    <div className="exam-info-item">
                      <div className="info-icon">
                        <i className="fas fa-clock"></i>
                      </div>
                      <div className="info-content">
                        <span className="info-label">Time</span>
                        <span className="info-value">{formatTime(exam.schedule?.startDate || exam.startTime)}</span>
                      </div>
                    </div>

                    <div className="exam-info-item">
                      <div className="info-icon">
                        <i className="fas fa-stopwatch"></i>
                      </div>
                      <div className="info-content">
                        <span className="info-label">Duration</span>
                        <span className="info-value">{formatDuration(exam.duration)}</span>
                      </div>
                    </div>

                    <div className="exam-info-item">
                      <div className="info-icon">
                        <i className="fas fa-question-circle"></i>
                      </div>
                      <div className="info-content">
                        <span className="info-label">Questions</span>
                        <span className="info-value">{exam.questions?.length || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="exam-timing-info">
                    <span className={`timing-text ${getStatusColor(exam)}`}>
                      {getRemainingTime(exam)}
                    </span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="exam-card-footer">
                  {user?.role === 'student' && (
                    <>
                      {getStatusColor(exam) === 'ongoing' ? (
                        <Link to={`/exam/${exam._id}`} className="btn btn-primary btn-full">
                          <i className="fas fa-play"></i>
                          Take Exam Now
                        </Link>
                      ) : getStatusColor(exam) === 'upcoming' ? (
                        <button className="btn btn-outline btn-full" disabled>
                          <i className="fas fa-clock"></i>
                          {getRemainingTime(exam)}
                        </button>
                      ) : (
                        <Link to={`/exam/${exam._id}/result`} className="btn btn-info btn-full">
                          <i className="fas fa-chart-line"></i>
                          View Results
                        </Link>
                      )}
                    </>
                  )}
                  
                  {user?.role === 'teacher' && (
                    <div className="teacher-actions">
                      <Link to={`/exam/${exam._id}/edit`} className="btn btn-outline">
                        <i className="fas fa-edit"></i>
                        Edit
                      </Link>
                      <Link to={`/exam/${exam._id}/submissions`} className="btn btn-primary">
                        <i className="fas fa-users"></i>
                        Submissions
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-content">
              <div className="empty-icon">
                <i className="fas fa-clipboard-list"></i>
              </div>
              <h3>No exams found</h3>
              <p>
                {filters.search || filters.status !== 'all' || filters.subject !== 'all'
                  ? 'Try adjusting your filters to see more results.'
                  : user?.role === 'teacher'
                  ? 'Create your first exam to get started.'
                  : 'No exams are currently available.'
                }
              </p>
              {user?.role === 'teacher' && (
                <Link to="/create-exam" className="btn btn-primary btn-lg">
                  <i className="fas fa-plus"></i>
                  Create Your First Exam
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamList;
