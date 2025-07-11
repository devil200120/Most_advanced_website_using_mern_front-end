import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ExamCard.css';

const ExamCard = ({ exam, showEditButton = false, showStartButton = false }) => {
  const { user } = useAuth();
  
  // Get user role from auth context
  const userRole = user?.role;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getExamStatus = () => {
    const now = new Date();
    const startTime = new Date(exam.schedule?.startDate || exam.startTime);
    const endTime = new Date(exam.schedule?.endDate || exam.endTime);

    if (now < startTime) return 'upcoming';
    if (now >= startTime && now <= endTime) return 'ongoing';
    return 'completed';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return '#28a745';
      case 'ongoing': return '#ffc107';
      case 'completed': return '#6c757d';
      default: return '#007bff';
    }
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const startTime = new Date(exam.startTime);
    const endTime = new Date(exam.endTime);
    
    if (now < startTime) {
      const diff = startTime - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      if (days > 0) return `Starts in ${days} day${days > 1 ? 's' : ''}`;
      if (hours > 0) return `Starts in ${hours} hour${hours > 1 ? 's' : ''}`;
      return 'Starting soon';
    }
    
    if (now >= startTime && now <= endTime) {
      const diff = endTime - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 0) return `${hours}h ${minutes}m remaining`;
      return `${minutes} minutes remaining`;
    }
    
    return 'Completed';
  };

  const status = getExamStatus();
  const timeRemaining = getTimeRemaining();

  return (
    <div className="exam-card">
      <div className="exam-header">
        <div className="exam-title">
          <h3>{exam.title}</h3>
          <span className="exam-subject">{exam.subject}</span>
        </div>
        <div className="exam-status-container">
          <span 
            className="exam-status"
            style={{ backgroundColor: getStatusColor(status) }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
          <span className="time-remaining">{timeRemaining}</span>
        </div>
      </div>
      
      <div className="exam-details">
        <div className="detail-grid">
          <div className="detail-item">
            <i className="fas fa-calendar-alt"></i>
            <div>
              <span className="detail-label">Start Time</span>
              <span className="detail-value">{formatDate(exam.startTime)}</span>
            </div>
          </div>
          
          <div className="detail-item">
            <i className="fas fa-clock"></i>
            <div>
              <span className="detail-label">Duration</span>
              <span className="detail-value">{exam.duration} minutes</span>
            </div>
          </div>
          
          <div className="detail-item">
            <i className="fas fa-question-circle"></i>
            <div>
              <span className="detail-label">Questions</span>
              <span className="detail-value">{exam.totalQuestions}</span>
            </div>
          </div>
          
          <div className="detail-item">
            <i className="fas fa-trophy"></i>
            <div>
              <span className="detail-label">Max Score</span>
              <span className="detail-value">{exam.maxScore} points</span>
            </div>
          </div>
        </div>
        
        {exam.description && (
          <div className="exam-description">
            <p>{exam.description}</p>
          </div>
        )}
      </div>
      
      <div className="exam-actions">
        {/* Teacher Actions */}
        {userRole === 'teacher' && (
          <>
            <Link to={`/exam/edit/${exam._id}`} className="btn btn-secondary">
              <i className="fas fa-edit"></i> Edit
            </Link>
            <Link to={`/exam/questions/${exam._id}`} className="btn btn-info">
              <i className="fas fa-list"></i> Questions
            </Link>
            <Link to={`/exam/results/${exam._id}`} className="btn btn-success">
              <i className="fas fa-chart-bar"></i> Results
            </Link>
            {status === 'upcoming' && (
              <button className="btn btn-danger">
                <i className="fas fa-trash"></i> Delete
              </button>
            )}
          </>
        )}
        
        {/* Student Actions */}
        {userRole === 'student' && (
          <>
            {status === 'upcoming' && (
              <button className="btn btn-outline" disabled>
                <i className="fas fa-clock"></i> Not Started
              </button>
            )}
            
            {status === 'ongoing' && (
              <Link to={`/exam/take/${exam._id}`} className="btn btn-primary">
                <i className="fas fa-play"></i> Take Exam
              </Link>
            )}
            
            {status === 'completed' && (
              <Link to={`/exam/result/${exam._id}`} className="btn btn-info">
                <i className="fas fa-eye"></i> View Result
              </Link>
            )}
            
            <Link to={`/exam/details/${exam._id}`} className="btn btn-secondary">
              <i className="fas fa-info-circle"></i> Details
            </Link>
          </>
        )}
        
        {/* Parent Actions */}
        {userRole === 'parent' && (
          <>
            <Link to={`/exam/progress/${exam._id}`} className="btn btn-info">
              <i className="fas fa-chart-line"></i> Progress
            </Link>
            <Link to={`/exam/details/${exam._id}`} className="btn btn-secondary">
              <i className="fas fa-info-circle"></i> Details
            </Link>
          </>
        )}
        
        {/* Admin Actions */}
        {userRole === 'admin' && (
          <>
            <Link to={`/admin/exam/${exam._id}`} className="btn btn-primary">
              <i className="fas fa-cog"></i> Manage
            </Link>
            <Link to={`/admin/exam/analytics/${exam._id}`} className="btn btn-info">
              <i className="fas fa-analytics"></i> Analytics
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ExamCard;