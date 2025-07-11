// frontend/src/components/ExamNavigation.js
import React from 'react';
import './ExamNavigation.css';

const ExamNavigation = ({ 
  questions, 
  currentQuestion, 
  onQuestionSelect, 
  answeredQuestions = [],
  flaggedQuestions = [],
  onPrevious,
  onNext,
  onSubmit,
  isLastQuestion = false
}) => {
  const getQuestionStatus = (index) => {
    if (answeredQuestions.includes(index)) return 'answered';
    if (flaggedQuestions.includes(index)) return 'flagged';
    if (index === currentQuestion) return 'current';
    return 'unanswered';
  };

  const getQuestionClass = (index) => {
    const status = getQuestionStatus(index);
    return `question-nav-item ${status}`;
  };

  return (
    <div className="exam-navigation">
      <div className="navigation-header">
        <h3>Question Navigator</h3>
        <div className="progress-info">
          {answeredQuestions.length} / {questions.length} answered
        </div>
      </div>
      
      <div className="questions-grid">
        {questions.map((_, index) => (
          <button
            key={index}
            className={getQuestionClass(index)}
            onClick={() => onQuestionSelect(index)}
            title={`Question ${index + 1}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      
      <div className="navigation-legend">
        <div className="legend-item">
          <div className="legend-color current"></div>
          <span>Current</span>
        </div>
        <div className="legend-item">
          <div className="legend-color answered"></div>
          <span>Answered</span>
        </div>
        <div className="legend-item">
          <div className="legend-color flagged"></div>
          <span>Flagged</span>
        </div>
        <div className="legend-item">
          <div className="legend-color unanswered"></div>
          <span>Unanswered</span>
        </div>
      </div>
      
      <div className="navigation-controls">
        <button
          className="nav-btn prev"
          onClick={onPrevious}
          disabled={currentQuestion === 0}
        >
          <i className="fas fa-chevron-left"></i>
          Previous
        </button>
        
        {isLastQuestion ? (
          <button
            className="nav-btn submit"
            onClick={onSubmit}
          >
            Submit Exam
            <i className="fas fa-paper-plane"></i>
          </button>
        ) : (
          <button
            className="nav-btn next"
            onClick={onNext}
            disabled={currentQuestion === questions.length - 1}
          >
            Next
            <i className="fas fa-chevron-right"></i>
          </button>
        )}
      </div>
      
      <div className="exam-summary">
        <div className="summary-item">
          <span className="summary-label">Total Questions:</span>
          <span className="summary-value">{questions.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Answered:</span>
          <span className="summary-value answered">{answeredQuestions.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Flagged:</span>
          <span className="summary-value flagged">{flaggedQuestions.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Remaining:</span>
          <span className="summary-value unanswered">
            {questions.length - answeredQuestions.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExamNavigation;