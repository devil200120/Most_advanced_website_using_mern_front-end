import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Loading from '../components/Loading';
import './ResultsList.css';

const ResultsList = () => {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    subject: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  useEffect(() => {
    fetchResults();
  }, [filters]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await api.get('/submissions');
      setResults(response.data.data?.submissions || []);
    } catch (error) {
      console.error('Error fetching results:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculatePercentage = (submission) => {
    if (!submission.totalScore || submission.totalScore === 0) return 0;
    return Math.round((submission.score / submission.totalScore) * 100);
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'grade-a';
    if (percentage >= 80) return 'grade-b';
    if (percentage >= 70) return 'grade-c';
    if (percentage >= 60) return 'grade-d';
    return 'grade-f';
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
  };

  const filteredResults = results.filter(result => {
    if (filters.subject !== 'all' && result.exam?.subject !== filters.subject) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    const aValue = filters.sortBy === 'date' ? new Date(a.submittedAt) : calculatePercentage(a);
    const bValue = filters.sortBy === 'date' ? new Date(b.submittedAt) : calculatePercentage(b);
    
    return filters.sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
  });

  const subjects = [...new Set(results.map(r => r.exam?.subject).filter(Boolean))];

  if (loading) return <Loading />;

  return (
    <div className="results-list-container">
      <div className="results-header">
        <div className="header-content">
          <h1>My Results</h1>
          <p>View your exam results and performance</p>
        </div>
        
        <div className="results-filters">
          <select 
            value={filters.subject} 
            onChange={(e) => setFilters({...filters, subject: e.target.value})}
            className="filter-select"
          >
            <option value="all">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
          
          <select 
            value={filters.sortBy} 
            onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
            className="filter-select"
          >
            <option value="date">Sort by Date</option>
            <option value="score">Sort by Score</option>
          </select>
          
          <select 
            value={filters.sortOrder} 
            onChange={(e) => setFilters({...filters, sortOrder: e.target.value})}
            className="filter-select"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {filteredResults.length === 0 ? (
        <div className="no-results">
          <i className="fas fa-chart-line"></i>
          <h3>No Results Yet</h3>
          <p>You haven't completed any exams yet.</p>
          <Link to="/exams" className="btn btn-primary">
            View Available Exams
          </Link>
        </div>
      ) : (
        <div className="results-grid">
          {filteredResults.map((submission) => {
            const percentage = calculatePercentage(submission);
            const grade = getGrade(percentage);
            
            return (
              <div key={submission._id} className="result-card">
                <div className="result-card-header">
                  <h3>{submission.exam?.title || 'Exam'}</h3>
                  <span className="subject-tag">{submission.exam?.subject}</span>
                </div>
                
                <div className="result-card-body">
                  <div className="score-section">
                    <div className={`grade-circle ${getGradeColor(percentage)}`}>
                      <span className="percentage">{percentage}%</span>
                      <span className="grade">{grade}</span>
                    </div>
                    <div className="score-details">
                      <p className="score-text">
                        {submission.score || 0} / {submission.totalScore || 0} points
                      </p>
                      <p className="date-text">
                        Completed: {formatDate(submission.submittedAt)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="result-card-footer">
                  <Link 
                    to={`/exam/result/${submission.exam?._id}`} 
                    className="btn btn-outline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ResultsList;