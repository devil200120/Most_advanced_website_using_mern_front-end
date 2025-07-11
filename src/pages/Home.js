import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalExams: 0,
    totalQuestions: 0,
    successRate: 0
  });

  useEffect(() => {
    // Simulate loading stats
    const timer = setTimeout(() => {
      setStats({
        totalUsers: 1250,
        totalExams: 340,
        totalQuestions: 8500,
        successRate: 94
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: 'fas fa-shield-alt',
      title: 'Secure Examinations',
      description: 'Advanced security features including anti-cheating measures, screen monitoring, and secure browser integration.',
      color: '#28a745'
    },
    {
      icon: 'fas fa-question-circle',
      title: 'Multiple Question Types',
      description: 'Support for MCQ, essay questions, file uploads, and multimedia content with rich text editing.',
      color: '#007bff'
    },
    {
      icon: 'fas fa-eye',
      title: 'Real-time Monitoring',
      description: 'Live proctoring capabilities with webcam monitoring, screen recording, and suspicious activity detection.',
      color: '#ffc107'
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Instant Analytics',
      description: 'Comprehensive reporting and analytics with detailed performance insights and progress tracking.',
      color: '#17a2b8'
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'Mobile Responsive',
      description: 'Fully responsive design that works seamlessly across all devices and screen sizes.',
      color: '#6f42c1'
    },
    {
      icon: 'fas fa-users',
      title: 'Multi-Role Support',
      description: 'Dedicated interfaces for teachers, students, parents, and administrators with role-based permissions.',
      color: '#fd7e14'
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Professor of Mathematics',
      content: 'ExamPro has revolutionized how we conduct examinations. The security features and ease of use are exceptional.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Student',
      content: 'Taking exams has never been easier. The interface is intuitive and the instant results feature is fantastic.',
      rating: 5
    },
    {
      name: 'Lisa Rodriguez',
      role: 'Parent',
      content: 'I love being able to track my child\'s progress and receive instant notifications about exam results.',
      rating: 5
    }
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              The Future of
              <span className="gradient-text"> Online Examinations</span>
            </h1>
            <p>
              Secure, intelligent, and user-friendly examination platform designed 
              for modern educational institutions. Experience seamless exam management 
              with advanced security and real-time analytics.
            </p>
            <div className="hero-buttons">
              {!user ? (
                <>
                  <Link to="/register" className="btn btn-primary">
                    <i className="fas fa-rocket"></i>
                    Get Started
                  </Link>
                  <Link to="/demo" className="btn btn-outline">
                    <i className="fas fa-play"></i>
                    Watch Demo
                  </Link>
                </>
              ) : (
                <Link to="/dashboard" className="btn btn-primary">
                  <i className="fas fa-tachometer-alt"></i>
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-card">
              <div className="exam-preview">
                <div className="exam-header">
                  <h3>Mathematics Final Exam</h3>
                  <span className="status-badge">Live</span>
                </div>
                <div className="exam-stats">
                  <div className="stat">
                    <span className="number">45</span>
                    <span className="label">Questions</span>
                  </div>
                  <div className="stat">
                    <span className="number">120</span>
                    <span className="label">Minutes</span>
                  </div>
                  <div className="stat">
                    <span className="number">89</span>
                    <span className="label">Students</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-content">
                <h3>{stats.totalUsers.toLocaleString()}</h3>
                <p>Active Users</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-clipboard-list"></i>
              </div>
              <div className="stat-content">
                <h3>{stats.totalExams.toLocaleString()}</h3>
                <p>Exams Conducted</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-question-circle"></i>
              </div>
              <div className="stat-content">
                <h3>{stats.totalQuestions.toLocaleString()}</h3>
                <p>Questions Bank</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="stat-content">
                <h3>{stats.successRate}%</h3>
                <p>Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Powerful Features</h2>
            <p>Everything you need for secure and efficient online examinations</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon" style={{ color: feature.color }}>
                  <i className={feature.icon}></i>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Simple steps to get started with ExamPro</p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Create Account</h3>
                <p>Sign up as a teacher, student, or parent with your institutional email</p>
              </div>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Set Up Exam</h3>
                <p>Create exams with various question types and configure security settings</p>
              </div>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Monitor Progress</h3>
                <p>Track student performance with real-time monitoring and analytics</p>
              </div>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Review Results</h3>
                <p>Get instant results with detailed reports and performance insights</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>What Our Users Say</h2>
            <p>Trusted by educators and students worldwide</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-content">
                  <div className="stars">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <i key={i} className="fas fa-star"></i>
                    ))}
                  </div>
                  <p>"{testimonial.content}"</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-info">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Examination Process?</h2>
            <p>Join thousands of educators who trust ExamPro for their examination needs</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary">
                Start Free Trial
              </Link>
              <Link to="/contact" className="btn btn-outline">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;