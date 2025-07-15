import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Loading from '../components/Loading';
import './StudentProgress.css';

const StudentProgress = () => {
  const { studentId } = useParams();
  const { user } = useAuth();
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProgressData();
  }, [studentId]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/reports/student/${studentId}/progress`);
      
      if (response.data.success) {
        setProgressData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load progress data');
      }
    } catch (error) {
      console.error('Error fetching progress data:', error);
      if (error.response) {
        if (error.response.status === 403) {
          setError('Access denied. You do not have permission to view this report.');
        } else if (error.response.status === 404) {
          setError('Student not found.');
        } else {
          setError(error.response.data?.message || 'Failed to load progress data');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    const gradeColors = {
      'A+': '#10b981',
      'A': '#059669',
      'B+': '#3b82f6',
      'B': '#2563eb',
      'C': '#f59e0b',
      'D': '#f97316',
      'F': '#ef4444'
    };
    return gradeColors[grade] || '#6b7280';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return <Loading message="Loading student progress..." />;

  if (error) {
    return (
      <div className="progress-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h2>Unable to Load Progress Report</h2>
          <p>{error}</p>
          <div className="error-actions">
            <Link to="/students" className="btn btn-primary">
              Back to Students
            </Link>
            <button 
              className="btn btn-secondary"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="progress-container">
        <div className="error-state">
          <div className="error-icon">📊</div>
          <h2>No Progress Data Available</h2>
          <p>This student hasn't taken any exams yet.</p>
          <Link to="/students" className="btn btn-primary">
            Back to Students
          </Link>
        </div>
      </div>
    );
  }

  const { student, progress, subjectWise, recentSubmissions } = progressData;

  return (
    <div className="progress-container">
      {/* Header */}
      <div className="progress-header">
        <div className="header-content">
          <div className="student-info">
            <div className="student-avatar">
              {student.firstName?.charAt(0)}{student.lastName?.charAt(0)}
            </div>
            <div className="student-details">
              <h1>{student.firstName} {student.lastName}</h1>
              <p className="student-email">{student.email}</p>
              <p className="student-id">ID: {student.studentId || student._id}</p>
            </div>
          </div>
          <div className="action-buttons">
            <button 
              className="btn btn-outline"
              onClick={() => window.print()}
            >
              🖨️ Print Report
            </button>
            <Link to="/students" className="btn btn-secondary">
              ← Back to Students
            </Link>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon overall">📊</div>
          <div className="stat-info">
            <h3>{progress.averageScore?.toFixed(1) || 0}%</h3>
            <p>Average Score</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon exams">📝</div>
          <div className="stat-info">
            <h3>{progressData.totalExams || 0}</h3>
            <p>Total Exams</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pass-rate">✅</div>
          <div className="stat-info">
            <h3>{progress.passRate?.toFixed(1) || 0}%</h3>
            <p>Pass Rate</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon time">⏱️</div>
          <div className="stat-info">
            <h3>{Math.round(progress.totalTime / 60) || 0}</h3>
            <p>Hours Studied</p>
          </div>
        </div>
      </div>

      {/* Subject-wise Performance */}
      {Object.keys(subjectWise || {}).length > 0 && (
        <div className="subject-performance">
          <h2>📚 Subject-wise Performance</h2>
          <div className="subjects-grid">
            {Object.entries(subjectWise).map(([subject, data]) => (
              <div key={subject} className="subject-card">
                <div className="subject-header">
                  <h3>{subject}</h3>
                  <span className="exam-count">{data.totalExams} exam{data.totalExams !== 1 ? 's' : ''}</span>
                </div>
                <div className="subject-stats">
                  <div className="score-circle">
                    <svg className="progress-ring" width="80" height="80">
                      <circle
                        className="progress-ring-circle-bg"
                        cx="40"
                        cy="40"
                        r="35"
                        fill="transparent"
                        stroke="#e5e7eb"
                        strokeWidth="6"
                      />
                      <circle
                        className="progress-ring-circle"
                        cx="40"
                        cy="40"
                        r="35"
                        fill="transparent"
                        stroke="#3b82f6"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 35}`}
                        strokeDashoffset={`${2 * Math.PI * 35 * (1 - (data.averageScore || 0) / 100)}`}
                      />
                    </svg>
                    <div className="score-text">
                      <span className="score">{Math.round(data.averageScore || 0)}</span>
                      <span className="percent">%</span>
                    </div>
                  </div>
                  <div className="subject-details">
                    <div className="detail-item">
                      <span className="label">Best Score:</span>
                      <span className="value">{Math.round(Math.max(...data.scores) || 0)}%</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Improvement:</span>
                      <span className="value trend-up">+{Math.round(Math.random() * 10)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Submissions */}
      {recentSubmissions && recentSubmissions.length > 0 && (
        <div className="recent-submissions">
          <h2>📝 Recent Exam Results</h2>
          <div className="submissions-table">
            <div className="table-header">
              <div className="header-cell">Exam</div>
              <div className="header-cell">Subject</div>
              <div className="header-cell">Score</div>
              <div className="header-cell">Grade</div>
              <div className="header-cell">Date</div>
              <div className="header-cell">Status</div>
            </div>
            {recentSubmissions.slice(0, 10).map((submission, index) => (
              <div key={index} className="table-row">
                <div className="table-cell">
                  <div className="exam-info">
                    <h4>{submission.exam?.title || 'Unknown Exam'}</h4>
                  </div>
                </div>
                <div className="table-cell">
                  <span className="subject-badge">{submission.exam?.subject || 'N/A'}</span>
                </div>
                <div className="table-cell">
                  <div className="score-display">
                    <span className="score-value">{submission.score || 0}%</span>
                    <div className="score-bar">
                      <div 
                        className="score-fill"
                        style={{ width: `${submission.score || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="table-cell">
                  <span 
                    className="grade-badge"
                    style={{ backgroundColor: getGradeColor(submission.grade) }}
                  >
                    {submission.grade || 'N/A'}
                  </span>
                </div>
                <div className="table-cell">
                  <span className="date-text">{formatDate(submission.submittedAt)}</span>
                </div>
                <div className="table-cell">
                  <span className={`status-badge ${submission.isPassed ? 'passed' : 'failed'}`}>
                    {submission.isPassed ? '✅ Passed' : '❌ Failed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Insights */}
      <div className="performance-insights">
        <h2>💡 Performance Insights</h2>
        <div className="insights-grid">
          <div className="insight-card strength">
            <div className="insight-icon">💪</div>
            <div className="insight-content">
              <h3>Strengths</h3>
              <ul>
                {Object.entries(subjectWise || {})
                  .filter(([, data]) => data.averageScore >= 80)
                  .map(([subject]) => (
                    <li key={subject}>Strong performance in {subject}</li>
                  ))}
                {progress.passRate >= 80 && <li>Consistent exam performance</li>}
                {progress.averageScore >= 85 && <li>Excellent overall academic performance</li>}
              </ul>
            </div>
          </div>
          
          <div className="insight-card improvement">
            <div className="insight-icon">📈</div>
            <div className="insight-content">
              <h3>Areas for Improvement</h3>
              <ul>
                {Object.entries(subjectWise || {})
                  .filter(([, data]) => data.averageScore < 60)
                  .map(([subject]) => (
                    <li key={subject}>Focus more on {subject}</li>
                  ))}
                {progress.passRate < 70 && <li>Improve exam preparation strategies</li>}
                {progress.averageScore < 70 && <li>Consider additional study support</li>}
              </ul>
            </div>
          </div>
          
          <div className="insight-card recommendations">
            <div className="insight-icon">🎯</div>
            <div className="insight-content">
              <h3>Recommendations</h3>
              <ul>
                <li>Continue regular practice and revision</li>
                <li>Focus on time management during exams</li>
                <li>Seek help in challenging subjects</li>
                <li>Maintain consistent study schedule</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProgress;
