// frontend/src/components/Toast.js
import React, { useState, useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle';
      case 'error':
        return 'fas fa-times-circle';
      case 'warning':
        return 'fas fa-exclamation-triangle';
      default:
        return 'fas fa-info-circle';
    }
  };

  return (
    <div className={`toast ${type} ${isVisible ? 'show' : ''}`}>
      <div className="toast-icon">
        <i className={getIcon()}></i>
      </div>
      <div className="toast-message">
        {message}
      </div>
      <button className="toast-close" onClick={() => setIsVisible(false)}>
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};

export default Toast;