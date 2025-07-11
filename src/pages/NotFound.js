// frontend/src/pages/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-code">404</div>
        <h1>Page Not Found</h1>
        <p>Oops! The page you're looking for doesn't exist.</p>
        <div className="error-actions">
          <Link to="/" className="btn-primary">
            Go Home
          </Link>
          <Link to="/dashboard" className="btn-secondary">
            Go to Dashboard
          </Link>
        </div>
      </div>
      <div className="error-illustration">
        <i className="fas fa-search"></i>
      </div>
    </div>
  );
};

export default NotFound;