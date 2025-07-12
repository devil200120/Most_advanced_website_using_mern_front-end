import React, { useEffect, useState, useRef } from 'react';
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
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const heroRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse tracking for hero interactions
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      return () => heroElement.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Animate stats on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        totalUsers: 1250,
        totalExams: 340,
        totalQuestions: 8500,
        successRate: 94
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const FeatherIcon = ({ name, size = 18, className = '' }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`feather feather-${name} ${className}`}
    >
      {name === 'shield' && (
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      )}
      {name === 'help-circle' && (
        <>
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </>
      )}
      {name === 'eye' && (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
      {name === 'trending-up' && (
        <>
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </>
      )}
      {name === 'smartphone' && (
        <>
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </>
      )}
      {name === 'users' && (
        <>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </>
      )}
      {name === 'clipboard' && (
        <>
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        </>
      )}
      {name === 'database' && (
        <>
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </>
      )}
      {name === 'star' && (
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      )}
      {name === 'play' && (
        <polygon points="5 3 19 12 5 21 5 3" />
      )}
      {name === 'arrow-right' && (
        <>
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </>
      )}
      {name === 'check' && (
        <polyline points="20 6 9 17 4 12" />
      )}
      {name === 'rocket' && (
        <>
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
          <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
        </>
      )}
      {name === 'grid' && (
        <>
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </>
      )}
    </svg>
  );

  const features = [
    {
      icon: 'shield',
      title: 'Advanced Security',
      description: 'Bank-grade encryption with anti-cheating measures, screen monitoring, and secure browser integration.',
      color: 'var(--success)'
    },
    {
      icon: 'help-circle',
      title: 'Smart Question Types',
      description: 'Multiple choice, essays, file uploads, and multimedia content with AI-powered question generation.',
      color: 'var(--primary)'
    },
    {
      icon: 'eye',
      title: 'Real-time Proctoring',
      description: 'Live monitoring with webcam surveillance, screen recording, and AI-powered behavior analysis.',
      color: 'var(--warning)'
    },
    {
      icon: 'trending-up',
      title: 'Advanced Analytics',
      description: 'Comprehensive insights with performance tracking, detailed reports, and predictive analytics.',
      color: 'var(--info)'
    },
    {
      icon: 'smartphone',
      title: 'Mobile First',
      description: 'Responsive design optimized for all devices with native mobile app experience.',
      color: 'var(--purple)'
    },
    {
      icon: 'users',
      title: 'Multi-Role Platform',
      description: 'Dedicated interfaces for teachers, students, parents, and administrators with custom permissions.',
      color: 'var(--orange)'
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Professor of Mathematics',
      content: 'ExamPro has revolutionized how we conduct examinations. The security features and ease of use are exceptional.',
      rating: 5,
      avatar: 'SJ'
    },
    {
      name: 'Michael Chen',
      role: 'Computer Science Student',
      content: 'Taking exams has never been easier. The interface is intuitive and the instant results feature is fantastic.',
      rating: 5,
      avatar: 'MC'
    },
    {
      name: 'Lisa Rodriguez',
      role: 'Parent & Educator',
      content: 'I love being able to track my child\'s progress and receive instant notifications about exam results.',
      rating: 5,
      avatar: 'LR'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Account',
      description: 'Sign up with your institutional email and get verified instantly',
      icon: 'users'
    },
    {
      number: '02',
      title: 'Design Exam',
      description: 'Use our intuitive builder to create comprehensive examinations',
      icon: 'clipboard'
    },
    {
      number: '03',
      title: 'Monitor Live',
      description: 'Track student performance with real-time analytics and proctoring',
      icon: 'eye'
    },
    {
      number: '04',
      title: 'Analyze Results',
      description: 'Get detailed insights with automated grading and reporting',
      icon: 'trending-up'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section 
        className="hero-section" 
        ref={heroRef}
        style={{
          '--mouse-x': `${mousePosition.x}%`,
          '--mouse-y': `${mousePosition.y}%`,
        }}
      >
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="floating-shapes">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="floating-shape"
                style={{
                  '--delay': `${i * 0.8}s`,
                  '--duration': `${8 + (i % 3)}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="hero-container">
          <div className="hero-left">
            <div className="hero-badge">
              <span>✨ The Future of Online Testing</span>
            </div>
            
            <h1 className="hero-title">
              Transform Your
              <br />
              <span className="title-gradient">Examination</span>
              <br />
              Experience
            </h1>
            
            <p className="hero-description">
              Secure, intelligent, and user-friendly examination platform designed 
              for modern educational institutions. Experience seamless exam management 
              with advanced security and real-time analytics.
            </p>
            
            <div className="hero-actions">
              {!user ? (
                <>
                  <Link to="/register" className="btn-hero primary">
                    <FeatherIcon name="rocket" size={20} />
                    <span>Get Started Free</span>
                  </Link>
                  <Link to="/demo" className="btn-hero secondary">
                    <FeatherIcon name="play" size={18} />
                    <span>Watch Demo</span>
                  </Link>
                </>
              ) : (
                <Link to="/dashboard" className="btn-hero primary">
                  <FeatherIcon name="grid" size={20} />
                  <span>Go to Dashboard</span>
                </Link>
              )}
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Students</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Institutions</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">99.9%</span>
                <span className="stat-label">Uptime</span>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <div className="exam-mockup">
              <div className="mockup-header">
                <div className="mockup-controls">
                  <span className="control red"></span>
                  <span className="control yellow"></span>
                  <span className="control green"></span>
                </div>
                <div className="mockup-title">Mathematics Final Exam</div>
              </div>
              
              <div className="mockup-content">
                <div className="exam-info">
                  <div className="info-item">
                    <span className="info-label">Duration:</span>
                    <span className="info-value">2 hours</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Questions:</span>
                    <span className="info-value">45</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Students:</span>
                    <span className="info-value active">89 Active</span>
                  </div>
                </div>
                
                <div className="progress-section">
                  <div className="progress-header">
                    <span className="progress-label">Overall Progress</span>
                    <span className="progress-percentage">67% Complete</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '67%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of the sections remain the same... */}
      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon users">
                <FeatherIcon name="users" size={24} />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{stats.totalUsers.toLocaleString()}+</h3>
                <p className="stat-label">Active Users</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon exams">
                <FeatherIcon name="clipboard" size={24} />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{stats.totalExams.toLocaleString()}+</h3>
                <p className="stat-label">Exams Conducted</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon questions">
                <FeatherIcon name="database" size={24} />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{stats.totalQuestions.toLocaleString()}+</h3>
                <p className="stat-label">Question Bank</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon success">
                <FeatherIcon name="trending-up" size={24} />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{stats.successRate}%</h3>
                <p className="stat-label">Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="section-header">
            <div className="section-badge">Features</div>
            <h2 className="section-title">Everything You Need</h2>
            <p className="section-description">
              Powerful tools designed for modern educational excellence
            </p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card" style={{ '--delay': `${index * 0.1}s` }}>
                <div className="feature-icon" style={{ color: feature.color }}>
                  <FeatherIcon name={feature.icon} size={24} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <div className="feature-learn-more">
                  <span>Learn more</span>
                  <FeatherIcon name="arrow-right" size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="steps-section">
        <div className="steps-container">
          <div className="section-header">
            <div className="section-badge">Process</div>
            <h2 className="section-title">How It Works</h2>
            <p className="section-description">
              Get started in minutes with our intuitive platform
            </p>
          </div>
          
          <div className="steps-grid">
            {steps.map((step, index) => (
              <div key={index} className="step-card" style={{ '--delay': `${index * 0.1}s` }}>
                <div className="step-number">{step.number}</div>
                <div className="step-icon">
                  <FeatherIcon name={step.icon} size={20} />
                </div>
                <div className="step-content">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
                {index < steps.length - 1 && <div className="step-connector"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <div className="section-header">
            <div className="section-badge">Testimonials</div>
            <h2 className="section-title">Loved by Educators</h2>
            <p className="section-description">
              Trusted by thousands of institutions worldwide
            </p>
          </div>
          
          <div className="testimonials-wrapper">
            <div className="testimonial-card active">
              <div className="testimonial-content">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <FeatherIcon key={i} name="star" size={16} className="star-filled" />
                  ))}
                </div>
                <blockquote>
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
              </div>
              
              <div className="testimonial-author">
                <div className="author-avatar">
                  {testimonials[currentTestimonial].avatar}
                </div>
                <div className="author-info">
                  <h4 className="author-name">{testimonials[currentTestimonial].name}</h4>
                  <p className="author-role">{testimonials[currentTestimonial].role}</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentTestimonial ? 'active' : ''}`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">
              Ready to Transform Your
              <span className="title-gradient"> Examination Process?</span>
            </h2>
            <p className="cta-description">
              Join thousands of educators who trust ExamPro for their examination needs
            </p>
            
            <div className="cta-actions">
              <Link to="/register" className="btn-cta primary">
                <FeatherIcon name="rocket" size={20} />
                <span>Start Free Trial</span>
              </Link>
              <Link to="/contact" className="btn-cta secondary">
                <span>Contact Sales</span>
                <FeatherIcon name="arrow-right" size={16} />
              </Link>
            </div>
            
            <div className="cta-features">
              <div className="cta-feature">
                <FeatherIcon name="check" size={16} />
                <span>14-day free trial</span>
              </div>
              <div className="cta-feature">
                <FeatherIcon name="check" size={16} />
                <span>No credit card required</span>
              </div>
              <div className="cta-feature">
                <FeatherIcon name="check" size={16} />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
