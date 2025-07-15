import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Loading from '../components/Loading';
import './ExamTake.css';

const ExamTake = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [warning, setWarning] = useState('');
  const [submissionId, setSubmissionId] = useState(null);

  const [tabSwitches, setTabSwitches] = useState(0);
  const [fullscreenExited, setFullscreenExited] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchExamData();
    setupSecurityMeasures();
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [examId]);

  const fetchExamData = async () => {
  try {
    console.log('Fetching exam with ID:', examId); // Add debugging
    const response = await api.get(`/exams/${examId}`);
    console.log('API Response:', response.data); // Add debugging
    
    if (response.data.success) {
      setExam(response.data.data.exam);
      setQuestions(response.data.data.questions || []);
      setTimeRemaining(response.data.data.exam.duration * 60);
    } else {
      console.error('API returned error:', response.data.message);
      alert(response.data.message || 'Failed to load exam');
      navigate('/exams');
      return;
    }
    setLoading(false);
  } catch (error) {
    console.error('Error fetching exam:', error);
    
    // Better error handling
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      
      if (error.response.status === 403) {
        alert('You do not have permission to access this exam or it is not available yet.');
      } else if (error.response.status === 404) {
        alert('Exam not found.');
      } else {
        alert(`Error: ${error.response.data.message || 'Failed to load exam'}`);
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
      alert('Network error: Unable to connect to server.');
    } else {
      console.error('Request setup error:', error.message);
      alert('Error setting up request.');
    }
    
    navigate('/exams'); // Go to exam list instead of dashboard
  }
};

  const setupSecurityMeasures = () => {
    // Prevent right-click
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Detect tab switching
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Prevent copy/paste
    document.addEventListener('copy', (e) => e.preventDefault());
    document.addEventListener('paste', (e) => e.preventDefault());
    
    // Detect fullscreen exit
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    // Prevent certain key combinations
    document.addEventListener('keydown', handleKeyDown);
  };

  const handleVisibilityChange = () => {
    if (document.hidden && examStarted) {
      setTabSwitches(prev => prev + 1);
      setWarning('Warning: Tab switching detected. This activity is being monitored.');
      
      if (tabSwitches >= 3) {
        handleAutoSubmit('Too many tab switches detected');
      }
    }
  };

  const handleFullscreenChange = () => {
    if (!document.fullscreenElement && examStarted) {
      setFullscreenExited(prev => prev + 1);
      setWarning('Warning: Fullscreen mode exited. Please return to fullscreen.');
      
      if (fullscreenExited >= 2) {
        handleAutoSubmit('Fullscreen mode exited multiple times');
      }
    }
  };

  const handleKeyDown = (e) => {
    // Prevent Alt+Tab, Ctrl+Shift+I, F12, etc.
    if (
      (e.altKey && e.key === 'Tab') ||
      (e.ctrlKey && e.shiftKey && e.key === 'I') ||
      e.key === 'F12' ||
      (e.ctrlKey && e.key === 'u')
    ) {
      e.preventDefault();
      setWarning('Warning: Restricted key combination detected.');
    }
  };

  const startExam = async () => {
  try {
    // Request fullscreen
    await document.documentElement.requestFullscreen();
    
    setExamStarted(true);
    startTimer();
    
    // Start exam and get submission ID
    const response = await api.post(`/exams/${examId}/start`);
    if (response.data.success && response.data.data.submission) {
      setSubmissionId(response.data.data.submission._id);
    } else {
      throw new Error('Failed to start exam properly');
    }
  } catch (error) {
    console.error('Error starting exam:', error);
    alert('Error starting exam: ' + (error.response?.data?.message || error.message));
  }
};

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleAutoSubmit('Time expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleQuestionNavigation = (index) => {
    setCurrentQuestion(index);
  };

  const handleSubmit = async () => {
    if (window.confirm('Are you sure you want to submit your exam? This action cannot be undone.')) {
      await submitExam();
    }
  };

  const handleAutoSubmit = async (reason) => {
    setWarning(`Auto-submitting exam: ${reason}`);
    await submitExam();
  };

  // Update the navigation in submitExam function around line 220

const submitExam = async () => {
  setSubmitting(true);
  
  try {
    const submissionData = {
      examId,
      answers,
      timeSpent: (exam.duration * 60) - timeRemaining,
      securityFlags: {
        tabSwitches,
        fullscreenExited,
        warningsReceived: tabSwitches + fullscreenExited
      }
    };

    const response = await api.post('/submissions', submissionData);
    
    // Exit fullscreen
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    
    // Navigate to the correct result route
    if (response.data.success && response.data.data.submissionId) {
      navigate(`/exam-result/${response.data.data.submissionId}`);
    } else {
      // Fallback navigation
      navigate('/exams');
    }
  } catch (error) {
    console.error('Error submitting exam:', error);
    alert('Error submitting exam: ' + (error.response?.data?.message || error.message));
    setSubmitting(false);
  }
};

  const getAnswerStatus = (index) => {
    const question = questions[index];
    if (!question) return 'not-visited';
    
    const answer = answers[question._id];
    if (answer === undefined || answer === '') return 'not-answered';
    return 'answered';
  };

  const getTimeColor = () => {
    const percentage = (timeRemaining / (exam.duration * 60)) * 100;
    if (percentage <= 10) return '#dc3545';
    if (percentage <= 25) return '#ffc107';
    return '#28a745';
  };

  if (loading) return <Loading message="Loading exam..." />;
  if (submitting) return <Loading message="Submitting exam..." overlay />;

  if (!examStarted) {
    return (
      <div className="exam-start-container">
        <div className="exam-start-card">
          <h2>Ready to Start?</h2>
          <div className="exam-info">
            <h3>{exam.title}</h3>
            <div className="exam-details">
              <p><strong>Duration:</strong> {exam.duration} minutes</p>
              <p><strong>Total Questions:</strong> {questions.length}</p>
              <p><strong>Max Score:</strong> {exam.maxScore} points</p>
            </div>
          </div>
          
          <div className="exam-instructions">
            <h4>Instructions:</h4>
            <ul>
              <li>This exam will open in fullscreen mode</li>
              <li>Do not switch tabs or exit fullscreen</li>
              <li>Do not use browser back/forward buttons</li>
              <li>Your activity will be monitored</li>
              <li>Auto-submit will occur if suspicious activity is detected</li>
            </ul>
          </div>
          
          <button 
            className="btn btn-primary btn-large"
            onClick={startExam}
          >
            Start Exam
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="exam-take-container">
      {warning && (
        <div className="warning-banner">
          <i className="fas fa-exclamation-triangle"></i>
          {warning}
          <button onClick={() => setWarning('')}>×</button>
        </div>
      )}
      
      <div className="exam-header">
        <div className="exam-title">
          <h2>{exam.title}</h2>
          <div className="exam-meta">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
          </div>
        </div>
        
        <div className="exam-timer">
          <div className="timer-display" style={{ color: getTimeColor() }}>
            <i className="fas fa-clock"></i>
            <span>{formatTime(timeRemaining)}</span>
          </div>
        </div>
      </div>
      
      <div className="exam-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="progress-text">{Math.round(progress)}% Complete</span>
      </div>
      
      <div className="exam-content">
        <div className="question-panel">
          <div className="question-header">
            <div className="question-number">
              Question {currentQuestion + 1}
            </div>
            <div className="question-points">
              {currentQ.points} point{currentQ.points !== 1 ? 's' : ''}
            </div>
          </div>
          
          <div className="question-content">
            <div className="question-text">
              {currentQ.question}
            </div>
            
            {currentQ.image && (
              <div className="question-image">
                <img src={currentQ.image} alt="Question" />
              </div>
            )}
            
            // Update the multiple-choice options rendering around line 352
            <div className="question-options">
              {currentQ.type === 'multiple-choice' && (
                <div className="mcq-options">
                  {currentQ.options.map((option, index) => (
                    <label key={option._id || index} className="mcq-option">
                      <input
                        type="radio"
                        name={`question-${currentQ._id}`}
                        value={option.text || option} // Handle both object and string options
                        checked={answers[currentQ._id] === (option.text || option)}
                        onChange={(e) => handleAnswerChange(currentQ._id, e.target.value)}
                      />
                      <span className="option-text">{option.text || option}</span>
                    </label>
                  ))}
                </div>
              )}
              
              {currentQ.type === 'essay' && (
                <div className="essay-input">
                  <textarea
                    placeholder="Type your answer here..."
                    value={answers[currentQ._id] || ''}
                    onChange={(e) => handleAnswerChange(currentQ._id, e.target.value)}
                    rows="10"
                  />
                </div>
              )}
              
              {currentQ.type === 'true-false' && (
                <div className="tf-options">
                  <label className="tf-option">
                    <input
                      type="radio"
                      name={`question-${currentQ._id}`}
                      value="true"
                      checked={answers[currentQ._id] === 'true'}
                      onChange={(e) => handleAnswerChange(currentQ._id, e.target.value)}
                    />
                    <span>True</span>
                  </label>
                  <label className="tf-option">
                    <input
                      type="radio"
                      name={`question-${currentQ._id}`}
                      value="false"
                      checked={answers[currentQ._id] === 'false'}
                      onChange={(e) => handleAnswerChange(currentQ._id, e.target.value)}
                    />
                    <span>False</span>
                  </label>
                </div>
              )}
            </div>
          </div>
          
          <div className="question-navigation">
            <button
              className="btn btn-secondary"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              <i className="fas fa-chevron-left"></i>
              Previous
            </button>
            
            <div className="question-actions">
              <button
                className="btn btn-outline"
                onClick={() => handleAnswerChange(currentQ._id, '')}
              >
                Clear Answer
              </button>
            </div>
            
            <button
              className="btn btn-primary"
              onClick={handleNext}
              disabled={currentQuestion === questions.length - 1}
            >
              Next
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        
        <div className="question-sidebar">
          <div className="question-palette">
            <h4>Question Palette</h4>
            <div className="palette-grid">
              {questions.map((_, index) => (
                <button
                  key={index}
                  className={`palette-item ${getAnswerStatus(index)} ${
                    index === currentQuestion ? 'current' : ''
                  }`}
                  onClick={() => handleQuestionNavigation(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            
            <div className="palette-legend">
              <div className="legend-item">
                <div className="legend-color answered"></div>
                <span>Answered</span>
              </div>
              <div className="legend-item">
                <div className="legend-color not-answered"></div>
                <span>Not Answered</span>
              </div>
              <div className="legend-item">
                <div className="legend-color current"></div>
                <span>Current</span>
              </div>
            </div>
          </div>
          
          <div className="exam-summary">
            <h4>Summary</h4>
            <div className="summary-stats">
              <div className="stat">
                <span className="stat-label">Answered:</span>
                <span className="stat-value">
                  {Object.keys(answers).filter(key => answers[key] !== '').length}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Remaining:</span>
                <span className="stat-value">
                  {questions.length - Object.keys(answers).filter(key => answers[key] !== '').length}
                </span>
              </div>
            </div>
          </div>
          
          <button
            className="btn btn-success btn-submit"
            onClick={handleSubmit}
          >
            <i className="fas fa-check"></i>
            Submit Exam
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamTake;
