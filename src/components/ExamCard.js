import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ExamCard.css';
import api from '../services/api'; // ADD THIS IMPORT


const ExamCard = ({ exam, showEditButton = false, showStartButton = false , onDelete}) => {
  const { user } = useAuth();
  
  // Get user role from auth context
  const userRole = user?.role;
  const handleDeleteExam = async () => {
    if (!window.confirm(`Are you sure you want to delete the exam "${exam.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await api.delete(`/exams/${exam._id}`);
      
      if (response.data.success) {
        alert('Exam deleted successfully!');
        if (onDelete) {
          onDelete(exam._id); // Notify parent component to refresh the list
        } else {
          // Fallback: reload the page
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('Error deleting exam:', error);
      alert('Error deleting exam: ' + (error.response?.data?.message || error.message));
    }
  };


  const formatDate = (date) => {
    if (!date) return 'Not specified';
    
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return 'Invalid Date';
      
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getExamStatus = () => {
    const now = new Date();
    // Handle both field formats for compatibility
    const startTime = new Date(exam.schedule?.startDate || exam.startTime);
    const endTime = new Date(exam.schedule?.endDate || exam.endTime);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return 'unknown';
    }

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
    const startTime = new Date(exam.schedule?.startDate || exam.startTime);
    const endTime = new Date(exam.schedule?.endDate || exam.endTime);
    
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return 'Time not available';
    }
    
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
          <h3>{exam.title || 'Untitled Exam'}</h3>
          <span className="exam-subject">{exam.subject || 'No Subject'}</span>
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
              <span className="detail-value">
                {formatDate(exam.schedule?.startDate || exam.startTime)}
              </span>
            </div>
          </div>
          
          <div className="detail-item">
            <i className="fas fa-clock"></i>
            <div>
              <span className="detail-label">Duration</span>
              <span className="detail-value">{exam.duration || 0} minutes</span>
            </div>
          </div>
          
          <div className="detail-item">
            <i className="fas fa-question-circle"></i>
            <div>
              <span className="detail-label">Questions</span>
              <span className="detail-value">{exam.totalQuestions || exam.questions?.length || 0}</span>
            </div>
          </div>
          
          <div className="detail-item">
            <i className="fas fa-trophy"></i>
            <div>
              <span className="detail-label">Max Score</span>
              <span className="detail-value">{exam.totalMarks || exam.maxScore || 0} points</span>
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
            {!exam.isPublished && (
              <button className="btn btn-warning">
                <i className="fas fa-eye-slash"></i> Unpublished
              </button>
            )}
           
{status === 'upcoming' && (
  <button 
    className="btn btn-danger"
    onClick={handleDeleteExam}
    title="Delete Exam"
  >
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
  <>
    {exam.userAttempts?.hasAttempted && !exam.settings?.allowMultipleAttempts ? (
      <button className="btn btn-disabled" disabled>
        <i className="fas fa-ban"></i> Already Attempted
      </button>
    ) : exam.userAttempts?.attemptCount >= exam.settings?.maxAttempts ? (
      <button className="btn btn-disabled" disabled>
        <i className="fas fa-exclamation-triangle"></i> Max Attempts Reached
      </button>
    ) : (
      <Link to={`/exam/take/${exam._id}`} className="btn btn-primary">
        <i className="fas fa-play"></i> 
        {exam.userAttempts?.hasAttempted ? `Attempt ${exam.userAttempts.nextAttemptNumber}` : 'Take Exam'}
      </Link>
    )}
  </>
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
              <i className="fas fa-chart-line"></i> View Progress
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ExamCard;
