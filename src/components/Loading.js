import React from 'react';
import './Loading.css';

const Loading = ({ message = 'Loading...', size = 'medium', overlay = false }) => {
  const LoadingSpinner = () => (
    <div className={`loading-spinner ${size}`}>
      <div className="spinner-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );

  if (overlay) {
    return (
      <div className="loading-overlay">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="loading-container">
      <LoadingSpinner />
    </div>
  );
};

export default Loading;