// frontend/src/pages/Unauthorized.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Unauthorized.css';

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <div className="error-code">403</div>
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <div className="error-actions">
          <Link to="/login" className="btn-primary">
            Login
          </Link>
          <Link to="/" className="btn-secondary">
            Go Home
          </Link>
        </div>
      </div>
      <div className="error-illustration">
        <i className="fas fa-lock"></i>
      </div>
    </div>
  );
};

export default Unauthorized;