import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Loading from '../components/Loading';
import './ExamResult.css';

const ExamResult = () => {
  const { examId } = useParams();
  const { user } = useAuth();
  const [result, setResult] = useState(null);
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    fetchExamResult();
  }, [examId]);

  const fetchExamResult = async () => {
    try {
      const response = await api.get(`/exams/${examId}/result`);
      setResult(response.data.result);
      setExam(response.data.exam);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching exam result:', error);
      setLoading(false);
    }
  };

  const calculatePercentage = () => {
    if (!result || !exam) return 0;
    return Math.round((result.score / exam.maxScore) * 100);
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A+', color: '#28a745' };
    if (percentage >= 80) return { grade: 'A', color: '#28a745' };
    if (percentage >= 70) return { grade: 'B+', color: '#17a2b8' };
    if (percentage >= 60) return { grade: 'B', color: '#17a2b8' };
    if (percentage >= 50) return { grade: 'C', color: '#ffc107' };
    if (percentage >= 40) return { grade: 'D', color: '#fd7e14' };
    return { grade: 'F', color: '#dc3545' };
  };

  const getPerformanceMessage = (percentage) => {
    if (percentage >= 90) return 'Excellent performance! Outstanding work!';
    if (percentage >= 80) return 'Great job! You performed very well!';
    if (percentage >= 70) return 'Good work! You have a solid understanding!';
    if (percentage >= 60) return 'Satisfactory performance. Keep improving!';
    if (percentage >= 50) return 'You passed, but there\'s room for improvement.';
    return 'You need to study more. Don\'t give up!';
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getAnswerStatus = (question, userAnswer) => {
    if (question.type === 'multiple-choice' || question.type === 'true-false') {
      return userAnswer === question.correctAnswer ? 'correct' : 'incorrect';
    }
    // For essay questions, we'd need manual grading info
    return 'pending';
  };

  if (loading) return <Loading message="Loading exam result..." />;

  if (!result || !exam) {
    return (
      <div className="result-error">
        <h2>Result not found</h2>
        <p>Unable to load exam result. Please try again later.</p>
        <Link to="/dashboard" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const percentage = calculatePercentage();
  const gradeInfo = getGrade(percentage);

  return (
    <div className="exam-result-container">
      <div className="result-header">
        <div className="result-title">
          <h1>{exam.title}</h1>
          <p className="exam-subject">{exam.subject}</p>
        </div>
        <div className="result-actions">
          <button 
            className="btn btn-outline"
            onClick={() => setShowAnswers(!showAnswers)}
          >
            {showAnswers ? 'Hide' : 'Show'} Answers
          </button>
          <Link to="/dashboard" className="btn btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="result-content">
        <div className="result-summary">
          <div className="score-card">
            <div className="score-display">
              <div className="score-circle" style={{ borderColor: gradeInfo.color }}>
                <div className="score-percentage" style={{ color: gradeInfo.color }}>
                  {percentage}%
                </div>
                <div className="score-grade" style={{ color: gradeInfo.color }}>
                  {gradeInfo.grade}
                </div>
              </div>
              <div className="score-details">
                <h3>Your Score</h3>
                <p className="score-fraction">
                  {result.score} / {exam.maxScore} points
                </p>
                <p className="performance-message">
                  {getPerformanceMessage(percentage)}
                </p>
              </div>
            </div>
          </div>

          <div className="result-stats">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="stat-info">
                  <h4>Time Spent</h4>
                  <p>{formatTime(result.timeSpent)}</p>
                </div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">
                  <i className="fas fa-question-circle"></i>
                </div>
                <div className="stat-info">
                  <h4>Questions</h4>
                  <p>{result.totalQuestions} total</p>
                </div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="stat-info">
                  <h4>Correct</h4>
                  <p>{result.correctAnswers} answers</p>
                </div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">
                  <i className="fas fa-times-circle"></i>
                </div>
                <div className="stat-info">
                  <h4>Incorrect</h4>
                  <p>{result.incorrectAnswers} answers</p>
                </div>
              </div>
            </div>
          </div>

          <div className="result-chart">
            <h3>Performance Breakdown</h3>
            <div className="chart-container">
              <div className="performance-bars">
                <div className="performance-bar">
                  <div className="bar-label">Correct</div>
                  <div className="bar-track">
                    <div 
                      className="bar-fill correct"
                      style={{ width: `${(result.correctAnswers / result.totalQuestions) * 100}%` }}
                    ></div>
                  </div>
                  <div className="bar-value">{result.correctAnswers}</div>
                </div>
                
                <div className="performance-bar">
                  <div className="bar-label">Incorrect</div>
                  <div className="bar-track">
                    <div 
                      className="bar-fill incorrect"
                      style={{ width: `${(result.incorrectAnswers / result.totalQuestions) * 100}%` }}
                    ></div>
                  </div>
                  <div className="bar-value">{result.incorrectAnswers}</div>
                </div>
                
                <div className="performance-bar">
                  <div className="bar-label">Skipped</div>
                  <div className="bar-track">
                    <div 
                      className="bar-fill skipped"
                      style={{ width: `${(result.skippedAnswers / result.totalQuestions) * 100}%` }}
                    ></div>
                  </div>
                  <div className="bar-value">{result.skippedAnswers}</div>
                </div>
              </div>
            </div>
          </div>

          {result.securityFlags && (
            <div className="security-report">
              <h3>Security Report</h3>
              <div className="security-flags">
                {result.securityFlags.tabSwitches > 0 && (
                  <div className="security-flag warning">
                    <i className="fas fa-exclamation-triangle"></i>
                    <span>Tab switches detected: {result.securityFlags.tabSwitches}</span>
                  </div>
                )}
                {result.securityFlags.fullscreenExited > 0 && (
                  <div className="security-flag warning">
                    <i className="fas fa-expand-arrows-alt"></i>
                    <span>Fullscreen exits: {result.securityFlags.fullscreenExited}</span>
                  </div>
                )}
                {result.securityFlags.warningsReceived === 0 && (
                  <div className="security-flag success">
                    <i className="fas fa-shield-alt"></i>
                    <span>No security violations detected</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {showAnswers && (
          <div className="answers-section">
            <h3>Detailed Answers</h3>
            <div className="answers-list">
              {result.answers.map((answer, index) => {
                const question = exam.questions.find(q => q._id === answer.questionId);
                if (!question) return null;
                
                const status = getAnswerStatus(question, answer.userAnswer);
                
                return (
                  <div key={index} className={`answer-item ${status}`}>
                    <div className="answer-header">
                      <div className="question-number">
                        Question {index + 1}
                      </div>
                      <div className="answer-status">
                        {status === 'correct' && (
                          <span className="status-badge correct">
                            <i className="fas fa-check"></i> Correct
                          </span>
                        )}
                        {status === 'incorrect' && (
                          <span className="status-badge incorrect">
                            <i className="fas fa-times"></i> Incorrect
                          </span>
                        )}
                        {status === 'pending' && (
                          <span className="status-badge pending">
                            <i className="fas fa-clock"></i> Pending
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="question-content">
                      <p className="question-text">{question.question}</p>
                      
                      {question.type === 'multiple-choice' && (
                        <div className="mcq-answers">
                          {question.options.map((option, optionIndex) => (
                            <div 
                              key={optionIndex}
                              className={`mcq-option ${
                                option === answer.userAnswer ? 'user-answer' : ''
                              } ${
                                option === question.correctAnswer ? 'correct-answer' : ''
                              }`}
                            >
                              <span className="option-letter">
                                {String.fromCharCode(65 + optionIndex)}.
                              </span>
                              <span className="option-text">{option}</span>
                              {option === answer.userAnswer && (
                                <i className="fas fa-user-check"></i>
                              )}
                              {option === question.correctAnswer && (
                                <i className="fas fa-check-circle"></i>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {question.type === 'true-false' && (
                        <div className="tf-answers">
                          <div className={`tf-option ${answer.userAnswer === 'true' ? 'user-answer' : ''} ${question.correctAnswer === 'true' ? 'correct-answer' : ''}`}>
                            <span>True</span>
                            {answer.userAnswer === 'true' && <i className="fas fa-user-check"></i>}
                            {question.correctAnswer === 'true' && <i className="fas fa-check-circle"></i>}
                          </div>
                          <div className={`tf-option ${answer.userAnswer === 'false' ? 'user-answer' : ''} ${question.correctAnswer === 'false' ? 'correct-answer' : ''}`}>
                            <span>False</span>
                            {answer.userAnswer === 'false' && <i className="fas fa-user-check"></i>}
                            {question.correctAnswer === 'false' && <i className="fas fa-check-circle"></i>}
                          </div>
                        </div>
                      )}
                      
                      {question.type === 'essay' && (
                        <div className="essay-answers">
                          <div className="user-essay">
                            <h5>Your Answer:</h5>
                            <p>{answer.userAnswer || 'No answer provided'}</p>
                          </div>
                          {question.sampleAnswer && (
                            <div className="sample-essay">
                              <h5>Sample Answer:</h5>
                              <p>{question.sampleAnswer}</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {question.explanation && (
                        <div className="explanation">
                          <h5>Explanation:</h5>
                          <p>{question.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamResult;