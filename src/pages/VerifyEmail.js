import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import './Auth.css'; // Use the same styles as Login/Register

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('Verifying your email...');
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided. Please check your email link.');
      return;
    }

    handleVerification(token);
  }, [searchParams]);

  const handleVerification = async (token) => {
    try {
      setMessage('Verifying your email address...');
      
      const result = await verifyEmail(token);
      
      if (result.success) {
        setStatus('success');
        setMessage('Email verified successfully! You can now log in to your account.');
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(result.error || 'Email verification failed. The link may be expired or invalid.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setMessage('Email verification failed. Please try again or contact support.');
    }
  };

  if (status === 'verifying') {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Email Verification</h2>
            <p>Please wait while we verify your email address...</p>
          </div>
          <Loading />
          <p className="text-center">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Email Verification</h2>
        </div>
        
        <div className={`verification-message ${status}`}>
          <div className="message-icon">
            {status === 'success' ? '✅' : '❌'}
          </div>
          <h3>{status === 'success' ? 'Verification Successful!' : 'Verification Failed'}</h3>
          <p>{message}</p>
        </div>
        
        {status === 'success' && (
          <div className="success-actions">
            <p className="redirect-notice">
              You will be redirected to the login page in 3 seconds...
            </p>
            <button 
              onClick={() => navigate('/login')} 
              className="btn btn-primary btn-full"
            >
              Go to Login Now
            </button>
          </div>
        )}
        
        {status === 'error' && (
          <div className="error-actions">
            <button 
              onClick={() => navigate('/login')} 
              className="btn btn-primary btn-full"
            >
              Go to Login
            </button>
            <button 
              onClick={() => navigate('/register')} 
              className="btn btn-secondary btn-full"
              style={{ marginTop: '10px' }}
            >
              Register Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;