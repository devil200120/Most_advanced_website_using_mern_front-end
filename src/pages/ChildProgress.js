import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';
import './ChildProgress.css';

const ChildProgress = () => {
  const { childId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    fetchChildProgress();
  }, [childId, timeRange]);

  const fetchChildProgress = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/parent/child/${childId}/progress`);
      setProgressData(response.data.data);
    } catch (error) {
      console.error('Error fetching child progress:', error);
      toast.error('Failed to load progress data');
      if (error.response?.status === 404) {
        navigate('/parent/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 90) return '#28a745';
    if (percentage >= 80) return '#17a2b8';
    if (percentage >= 70) return '#ffc107';
    if (percentage >= 60) return '#fd7e14';
    return '#dc3545';
  };

  const getGradeColor = (grade) => {
    const gradeColors = {
      'A+': '#28a745',
      'A': '#28a745',
      'B+': '#17a2b8',
      'B': '#17a2b8',
      'C+': '#ffc107',
      'C': '#ffc107',
      'D': '#fd7e14',
      'F': '#dc3545'
    };
    return gradeColors[grade] || '#6c757d';
  };

  const prepareSubjectData = () => {
    if (!progressData?.submissions) return [];
    
    const subjectStats = {};
    progressData.submissions.forEach(submission => {
      if (!subjectStats[submission.subject]) {
        subjectStats[submission.subject] = {
          subject: submission.subject,
          totalExams: 0,
          totalScore: 0,
          averageScore: 0
        };
      }
      subjectStats[submission.subject].totalExams++;
      subjectStats[submission.subject].totalScore += submission.percentage;
    });
    
    return Object.values(subjectStats).map(stat => ({
      ...stat,
      averageScore: Math.round(stat.totalScore / stat.totalExams)
    }));
  };

  const ProgressBar = ({ value, max = 100, color = '#667eea', label }) => (
    <div className="progress-bar-container">
      <div className="progress-bar-header">
        <span className="progress-label">{label}</span>
        <span className="progress-value">{value}%</span>
      </div>
      <div className="progress-bar-track">
        <div 
          className="progress-bar-fill"
          style={{ 
            width: `${Math.min((value / max) * 100, 100)}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );

  const SimpleChart = ({ data, title }) => (
    <div className="simple-chart">
      <h3>{title}</h3>
      <div className="chart-bars">
        {data.map((item, index) => (
          <div key={index} className="chart-bar-item">
            <div className="bar-label">{item.subject || `Exam ${index + 1}`}</div>
            <div className="bar-container">
              <div 
                className="bar-fill"
                style={{ 
                  height: `${Math.max(item.averageScore || item.score || 0, 5)}%`,
                  backgroundColor: getPerformanceColor(item.averageScore || item.score || 0)
                }}
              />
            </div>
            <div className="bar-value">{item.averageScore || item.score || 0}%</div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return <Loading message="Loading progress data..." />;
  }

  if (!progressData) {
    return (
      <div className="error-container">
        <h2>Unable to load progress data</h2>
        <button onClick={fetchChildProgress} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  const subjectData = prepareSubjectData();
  const recentScores = progressData.submissions.slice(0, 10).reverse().map((sub, index) => ({
    score: sub.percentage,
    exam: `Exam ${index + 1}`,
    subject: sub.subject,
    date: new Date(sub.date).toLocaleDateString()
  }));

  return (
    <div className="child-progress">
      <div className="progress-header">
        <div className="header-content">
          <button 
            className="back-btn"
            onClick={() => navigate('/parent/dashboard')}
          >
            <i className="fas fa-arrow-left"></i>
            Back to Dashboard
          </button>
          
          <div className="child-info">
            <h1>{progressData.child.name}'s Progress</h1>
            <p>{progressData.child.email}</p>
          </div>
        </div>
        
        <div className="time-range-selector">
          <label>Time Range:</label>
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="month">Last Month</option>
            <option value="week">Last Week</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon exams">
            <i className="fas fa-clipboard-list"></i>
          </div>
          <div className="stat-content">
            <h3>{progressData.stats.totalExams}</h3>
            <p>Total Exams</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon average">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-content">
            <h3 style={{ color: getPerformanceColor(progressData.stats.averageScore) }}>
              {progressData.stats.averageScore}%
            </h3>
            <p>Average Score</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon best">
            <i className="fas fa-trophy"></i>
          </div>
          <div className="stat-content">
            <h3>{progressData.stats.bestScore}%</h3>
            <p>Best Score</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon trend">
            <i className="fas fa-trending-up"></i>
          </div>
          <div className="stat-content">
            <h3>
              {progressData.stats.averageScore >= 75 ? (
                <span style={{ color: '#28a745' }}>Improving</span>
              ) : (
                <span style={{ color: '#ffc107' }}>Needs Focus</span>
              )}
            </h3>
            <p>Trend</p>
          </div>
        </div>
      </div>

      <div className="progress-content">
        <div className="left-section">
          {/* Performance Chart */}
          <div className="chart-section">
            <h2>Performance Over Time</h2>
            <div className="performance-timeline">
              {recentScores.length > 0 ? (
                <SimpleChart data={recentScores} title="Recent Exam Scores" />
              ) : (
                <div className="no-data">
                  <i className="fas fa-chart-line"></i>
                  <p>No exam data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Subject Performance */}
          <div className="chart-section">
            <h2>Subject-wise Performance</h2>
            <div className="subjects-grid">
              {subjectData.length > 0 ? (
                subjectData.map((subject, index) => (
                  <div key={index} className="subject-card">
                    <h3>{subject.subject}</h3>
                    <div className="subject-stats">
                      <div className="stat">
                        <span className="stat-number">{subject.totalExams}</span>
                        <span className="stat-text">Exams</span>
                      </div>
                      <div className="subject-progress">
                        <ProgressBar 
                          value={subject.averageScore}
                          color={getPerformanceColor(subject.averageScore)}
                          label="Average Score"
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">
                  <i className="fas fa-book"></i>
                  <p>No subject data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="right-section">
          {/* Recent Exams */}
          <div className="recent-exams">
            <h2>Recent Exams</h2>
            <div className="exams-list">
              {progressData.submissions.slice(0, 10).map((submission) => (
                <div key={submission.id} className="exam-item">
                  <div className="exam-info">
                    <h4>{submission.examTitle}</h4>
                    <p className="exam-subject">{submission.subject}</p>
                    <p className="exam-date">
                      {new Date(submission.date).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="exam-score">
                    <div 
                      className="score-circle"
                      style={{ borderColor: getPerformanceColor(submission.percentage) }}
                    >
                      <span style={{ color: getPerformanceColor(submission.percentage) }}>
                        {submission.percentage}%
                      </span>
                    </div>
                    <p>{submission.score}/{submission.totalMarks}</p>
                  </div>
                </div>
              ))}
              
              {progressData.submissions.length === 0 && (
                <div className="no-exams">
                  <i className="fas fa-clipboard"></i>
                  <p>No exams taken yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Progress Insights */}
          <div className="insights-section">
            <h2>Insights</h2>
            <div className="insights-list">
              {progressData.stats.averageScore >= 85 && (
                <div className="insight-item positive">
                  <i className="fas fa-star"></i>
                  <p>Excellent performance! Keep up the great work!</p>
                </div>
              )}
              
              {progressData.stats.averageScore < 70 && (
                <div className="insight-item warning">
                  <i className="fas fa-lightbulb"></i>
                  <p>Consider additional study time to improve performance</p>
                </div>
              )}
              
              {subjectData.length > 0 && (
                <div className="insight-item neutral">
                  <i className="fas fa-chart-bar"></i>
                  <p>
                    Strongest subject: {subjectData.reduce((prev, current) => 
                      prev.averageScore > current.averageScore ? prev : current
                    ).subject}
                  </p>
                </div>
              )}
              
              <div className="insight-item neutral">
                <i className="fas fa-calendar-check"></i>
                <p>Completed {progressData.stats.totalExams} exam{progressData.stats.totalExams !== 1 ? 's' : ''} so far</p>
              </div>
              
              {progressData.stats.bestScore > 0 && (
                <div className="insight-item positive">
                  <i className="fas fa-trophy"></i>
                  <p>Best score: {progressData.stats.bestScore}% - Fantastic achievement!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildProgress;
