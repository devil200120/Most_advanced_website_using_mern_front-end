import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useExam } from '../context/ExamContext';
import ExamCard from '../components/ExamCard';
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

  useEffect(() => {
    loadExams();
  }, []);

  useEffect(() => {
    filterAndSortExams();
  }, [exams, filters]);

  const loadExams = async () => {
    await fetchExams();
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
        const startTime = new Date(exam.startTime);
        const endTime = new Date(exam.endTime);
        
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
        aValue = new Date(aValue);
        bValue = new Date(bValue);
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

  const getExamStats = () => {
    const now = new Date();
    const upcoming = exams.filter(exam => new Date(exam.startTime) > now).length;
    const ongoing = exams.filter(exam => {
      const start = new Date(exam.startTime);
      const end = new Date(exam.endTime);
      return now >= start && now <= end;
    }).length;
    const completed = exams.filter(exam => new Date(exam.endTime) < now).length;

    return { upcoming, ongoing, completed, total: exams.length };
  };

  const stats = getExamStats();

  if (loading) return <Loading message="Loading exams..." />;

  return (
    <div className="exam-list-container">
      <div className="exam-list-header">
        <div className="header-content">
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

      <div className="exam-stats">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon total">
              <i className="fas fa-clipboard-list"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.total}</h3>
              <p>Total Exams</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon upcoming">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.upcoming}</h3>
              <p>Upcoming</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon ongoing">
              <i className="fas fa-play-circle"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.ongoing}</h3>
              <p>Ongoing</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon completed">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.completed}</h3>
              <p>Completed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="exam-filters">
        <div className="filters-row">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search exams..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          
          <div className="filter-group">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
            
            <select
              value={filters.subject}
              onChange={(e) => handleFilterChange('subject', e.target.value)}
            >
              <option value="all">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            
            <select
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
          
          <button className="btn btn-outline" onClick={clearFilters}>
            <i className="fas fa-times"></i>
            Clear Filters
          </button>
        </div>
        
        <div className="results-info">
          <span>
            Showing {filteredExams.length} of {exams.length} exams
          </span>
        </div>
      </div>

      <div className="exam-list-content">
        {filteredExams.length > 0 ? (
          <div className="exams-grid">
            {filteredExams.map(exam => (
              <ExamCard
                key={exam._id}
                exam={exam}
                userRole={user?.role}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
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
              <Link to="/create-exam" className="btn btn-primary">
                <i className="fas fa-plus"></i>
                Create Your First Exam
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamList;