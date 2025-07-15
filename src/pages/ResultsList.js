// Replace the entire component with this fixed version:

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
  const [error, setError] = useState(null);
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
      setError(null);
      
      // Fetch user's submissions
      const response = await api.get('/submissions', {
        params: {
          student: user._id,
          isSubmitted: true
        }
      });
      
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        setResults(response.data.data?.submissions || []);
      } else {
        setError('Failed to fetch results');
        setResults([]);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
      setError('Failed to load exam results');
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
    if (!submission.answers || submission.answers.length === 0) return 0;
    
    const totalQuestions = submission.answers.length;
    const correctAnswers = submission.answers.filter(answer => answer.isCorrect).length;
    
    return Math.round((correctAnswers / totalQuestions) * 100);
  };

  const getScoreText = (submission) => {
    if (!submission.answers || submission.answers.length === 0) {
      return "0 / 0 points";
    }
    
    const totalQuestions = submission.answers.length;
    const correctAnswers = submission.answers.filter(answer => answer.isCorrect).length;
    
    return `${correctAnswers} / ${totalQuestions} points`;
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
    if (filters.sortBy === 'date') {
      const aDate = new Date(a.submittedAt);
      const bDate = new Date(b.submittedAt);
      return filters.sortOrder === 'desc' ? bDate - aDate : aDate - bDate;
    } else {
      const aScore = calculatePercentage(a);
      const bScore = calculatePercentage(b);
      return filters.sortOrder === 'desc' ? bScore - aScore : aScore - bScore;
    }
  });

  const subjects = [...new Set(results.map(r => r.exam?.subject).filter(Boolean))];

  if (loading) return <Loading message="Loading your results..." />;

  if (error) {
    return (
      <div className="results-list-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h2>Unable to Load Results</h2>
          <p>{error}</p>
          <button 
            onClick={fetchResults}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="results-list-container">
      <div className="results-header">
        <div className="header-content">
          <h1>📊 My Results</h1>
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
          <div className="no-results-icon">📚</div>
          <h3>No Results Yet</h3>
          <p>You haven't completed any exams yet. Start taking exams to see your results here!</p>
          <Link to="/exams" className="btn btn-primary">
            <span>🎯</span>
            View Available Exams
          </Link>
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="results-summary">
            <div className="summary-card">
              <div className="summary-icon">🎯</div>
              <div className="summary-info">
                <h3>{filteredResults.length}</h3>
                <p>Total Exams</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">⭐</div>
              <div className="summary-info">
                <h3>
                  {filteredResults.length > 0 
                    ? Math.round(filteredResults.reduce((sum, r) => sum + calculatePercentage(r), 0) / filteredResults.length)
                    : 0}%
                </h3>
                <p>Average Score</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">✅</div>
              <div className="summary-info">
                <h3>{filteredResults.filter(r => calculatePercentage(r) >= 60).length}</h3>
                <p>Passed</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">📈</div>
              <div className="summary-info">
                <h3>
                  {filteredResults.length > 0 
                    ? Math.max(...filteredResults.map(r => calculatePercentage(r)))
                    : 0}%
                </h3>
                <p>Best Score</p>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="results-grid">
            {filteredResults.map((submission) => {
              const percentage = calculatePercentage(submission);
              const grade = getGrade(percentage);
              const scoreText = getScoreText(submission);
              
              return (
                <div key={submission._id} className="result-card">
                  <div className="result-card-header">
                    <h3>{submission.exam?.title || 'Unknown Exam'}</h3>
                    <span className="subject-tag">{submission.exam?.subject || 'No Subject'}</span>
                  </div>
                  
                  <div className="result-card-body">
                    <div className="score-section">
                      <div className={`grade-circle ${getGradeColor(percentage)}`}>
                        <span className="percentage">{percentage}%</span>
                        <span className="grade">{grade}</span>
                      </div>
                      <div className="score-details">
                        <p className="score-text">{scoreText}</p>
                        <p className="date-text">
                          📅 {formatDate(submission.submittedAt)}
                        </p>
                        <p className="time-text">
                          ⏱️ {submission.timeTaken || 0} minutes
                        </p>
                        <p className="attempt-text">
                          🔄 Attempt #{submission.attemptNumber || 1}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="result-card-footer">
                    <Link 
                      to={`/exam-result/${submission._id}`} 
                      className="btn btn-primary"
                    >
                      📊 View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ResultsList;
