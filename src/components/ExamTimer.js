// frontend/src/components/ExamTimer.js
import React, { useState, useEffect } from 'react';
import './ExamTimer.css';

const ExamTimer = ({ duration, onTimeUp, autoSubmit = true, warningAt = 5 }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert minutes to seconds
  const [isWarning, setIsWarning] = useState(false);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let interval = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => {
          const newTimeLeft = timeLeft - 1;
          
          // Check if we should show warning
          if (newTimeLeft <= warningAt * 60 && !isWarning) {
            setIsWarning(true);
          }
          
          // Check if time is up
          if (newTimeLeft <= 0) {
            setIsRunning(false);
            if (onTimeUp) {
              onTimeUp();
            }
            return 0;
          }
          
          return newTimeLeft;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onTimeUp, warningAt, isWarning]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimerClass = () => {
    if (timeLeft === 0) return 'timer-expired';
    if (isWarning) return 'timer-warning';
    return 'timer-normal';
  };

  const getProgressPercentage = () => {
    return ((duration * 60 - timeLeft) / (duration * 60)) * 100;
  };

  return (
    <div className={`exam-timer ${getTimerClass()}`}>
      <div className="timer-display">
        <div className="timer-icon">
          <i className="fas fa-clock"></i>
        </div>
        <div className="timer-text">
          <div className="time-remaining">{formatTime(timeLeft)}</div>
          <div className="timer-label">Time Remaining</div>
        </div>
      </div>
      
      <div className="timer-progress">
        <div 
          className="progress-bar"
          style={{ width: `${getProgressPercentage()}%` }}
        ></div>
      </div>
      
      {isWarning && (
        <div className="timer-warning-message">
          <i className="fas fa-exclamation-triangle"></i>
          Only {Math.ceil(timeLeft / 60)} minutes left!
        </div>
      )}
      
      {timeLeft === 0 && (
        <div className="timer-expired-message">
          <i className="fas fa-times-circle"></i>
          Time's up!
        </div>
      )}
    </div>
  );
};

export default ExamTimer;