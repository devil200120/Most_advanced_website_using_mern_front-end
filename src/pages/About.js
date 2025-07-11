import React from 'react';
import './About.css';

const About = () => {
  const features = [
    {
      icon: 'fas fa-shield-alt',
      title: 'Advanced Security',
      description: 'State-of-the-art security measures including proctoring, anti-cheating detection, and secure exam environments.'
    },
    {
      icon: 'fas fa-users',
      title: 'Multi-Role Support',
      description: 'Comprehensive platform supporting teachers, students, parents, and administrators with role-specific features.'
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Real-time Analytics',
      description: 'Detailed performance analytics and reporting for informed decision-making and progress tracking.'
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'Cross-Platform',
      description: 'Seamless experience across all devices - desktop, tablet, and mobile with responsive design.'
    },
    {
      icon: 'fas fa-clock',
      title: 'Flexible Scheduling',
      description: 'Advanced scheduling system with timezone support, recurring exams, and automated reminders.'
    },
    {
      icon: 'fas fa-graduation-cap',
      title: 'Educational Focus',
      description: 'Purpose-built for educational institutions with features designed specifically for academic assessments.'
    }
  ];

  const teamMembers = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Chief Executive Officer',
      image: '/team/sarah-johnson.jpg',
      description: 'Former education technology researcher with 15+ years of experience in digital learning platforms.',
      social: {
        linkedin: '#',
        twitter: '#'
      }
    },
    {
      name: 'Michael Chen',
      role: 'Chief Technology Officer',
      image: '/team/michael-chen.jpg',
      description: 'Software architect specializing in secure, scalable educational technology solutions.',
      social: {
        linkedin: '#',
        github: '#'
      }
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Head of Education',
      image: '/team/emily-rodriguez.jpg',
      description: 'Educational psychologist focused on assessment methodologies and learning outcome optimization.',
      social: {
        linkedin: '#',
        twitter: '#'
      }
    },
    {
      name: 'David Park',
      role: 'Lead Developer',
      image: '/team/david-park.jpg',
      description: 'Full-stack developer with expertise in modern web technologies and educational software.',
      social: {
        linkedin: '#',
        github: '#'
      }
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Company Founded',
      description: 'ExamPro was founded with a vision to revolutionize online examinations.'
    },
    {
      year: '2021',
      title: 'First Product Launch',
      description: 'Launched our MVP with basic exam creation and taking capabilities.'
    },
    {
      year: '2022',
      title: 'Security Enhancement',
      description: 'Introduced advanced security features including anti-cheating detection.'
    },
    {
      year: '2023',
      title: 'Multi-Role Platform',
      description: 'Expanded to support teachers, students, parents, and administrators.'
    },
    {
      year: '2024',
      title: 'AI Integration',
      description: 'Integrated AI-powered analytics and automated grading capabilities.'
    },
    {
      year: '2025',
      title: 'Global Expansion',
      description: 'Serving over 1000+ institutions worldwide with continuous innovation.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Active Users' },
    { number: '1,000+', label: 'Institutions' },
    { number: '100,000+', label: 'Exams Conducted' },
    { number: '99.9%', label: 'Uptime' }
  ];

  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>About ExamPro</h1>
          <p className="hero-subtitle">
            Empowering education through secure, intelligent, and user-friendly examination technology
          </p>
          <p className="hero-description">
            ExamPro is a cutting-edge online examination platform designed to meet the evolving needs 
            of modern educational institutions. We combine advanced security, intuitive design, and 
            powerful analytics to create the ultimate assessment experience.
          </p>
        </div>
        <div className="hero-image">
          <div className="floating-card">
            <i className="fas fa-graduation-cap"></i>
            <h3>Innovation in Education</h3>
            <p>Leading the future of digital assessments</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <h2>Our Impact in Numbers</h2>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <h3>{stat.number}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <div className="mission-text">
              <h2>Our Mission</h2>
              <p>
                To democratize access to high-quality, secure online examinations while maintaining 
                the highest standards of academic integrity. We believe that technology should enhance 
                the educational experience, not complicate it.
              </p>
              <div className="mission-points">
                <div className="mission-point">
                  <i className="fas fa-target"></i>
                  <div>
                    <h4>Accessibility</h4>
                    <p>Making quality assessment tools available to institutions of all sizes</p>
                  </div>
                </div>
                <div className="mission-point">
                  <i className="fas fa-shield-alt"></i>
                  <div>
                    <h4>Security</h4>
                    <p>Maintaining the highest standards of exam security and academic integrity</p>
                  </div>
                </div>
                <div className="mission-point">
                  <i className="fas fa-lightbulb"></i>
                  <div>
                    <h4>Innovation</h4>
                    <p>Continuously evolving our platform with the latest educational technology</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mission-visual">
              <div className="mission-circle">
                <div className="circle-content">
                  <i className="fas fa-rocket"></i>
                  <span>Driving Educational Excellence</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Why Choose ExamPro?</h2>
          <p className="section-subtitle">
            Our platform combines cutting-edge technology with educational expertise
          </p>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <i className={feature.icon}></i>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="container">
          <h2>Our Journey</h2>
          <p className="section-subtitle">
            From startup to industry leader - our evolution in education technology
          </p>
          <div className="timeline">
            {milestones.map((milestone, index) => (
              <div key={index} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                <div className="timeline-content">
                  <div className="timeline-year">{milestone.year}</div>
                  <h3>{milestone.title}</h3>
                  <p>{milestone.description}</p>
                </div>
                <div className="timeline-marker"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2>Meet Our Team</h2>
          <p className="section-subtitle">
            Passionate professionals dedicated to transforming education
          </p>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-image">
                  <img src={member.image} alt={member.name} />
                  <div className="team-overlay">
                    <div className="social-links">
                      {member.social.linkedin && (
                        <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                          <i className="fab fa-linkedin"></i>
                        </a>
                      )}
                      {member.social.twitter && (
                        <a href={member.social.twitter} target="_blank" rel="noopener noreferrer">
                          <i className="fab fa-twitter"></i>
                        </a>
                      )}
                      {member.social.github && (
                        <a href={member.social.github} target="_blank" rel="noopener noreferrer">
                          <i className="fab fa-github"></i>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="team-info">
                  <h3>{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p className="team-description">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-heart"></i>
              </div>
              <h3>Student-Centric</h3>
              <p>Every decision we make prioritizes the student experience and learning outcomes.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-handshake"></i>
              </div>
              <h3>Integrity</h3>
              <p>We maintain the highest ethical standards in everything we do, from product development to customer service.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-cogs"></i>
              </div>
              <h3>Innovation</h3>
              <p>We continuously push the boundaries of what's possible in educational technology.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-globe"></i>
              </div>
              <h3>Accessibility</h3>
              <p>We believe quality education tools should be accessible to everyone, everywhere.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Examinations?</h2>
            <p>
              Join thousands of educational institutions who trust ExamPro for their assessment needs.
            </p>
            <div className="cta-buttons">
              <a href="/register" className="btn btn-primary">Get Started Free</a>
              <a href="/contact" className="btn btn-outline">Contact Sales</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;