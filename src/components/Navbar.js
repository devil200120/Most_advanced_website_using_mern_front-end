import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import './Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { notifications } = useNotification();
  const location = useLocation();
  const navigate = useNavigate();

  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsProfileMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const getNavLinks = () => {
    if (!user) {
      return [
        { path: '/', label: 'Home', icon: 'home' },
        { path: '/about', label: 'About', icon: 'info' },
        { path: '/contact', label: 'Contact', icon: 'mail' },
      ];
    }

    const baseLinks = [
      { path: '/dashboard', label: 'Dashboard', icon: 'grid' },
    ];

    const roleLinks = {
      teacher: [
        { path: '/exams', label: 'My Exams', icon: 'clipboard' },
        { path: '/create-exam', label: 'Create', icon: 'plus' },
        { path: '/students', label: 'Students', icon: 'users' },
        { path: '/results', label: 'Results', icon: 'bar-chart' },
      ],
      student: [
        { path: '/exams', label: 'Exams', icon: 'clipboard' },
        { path: '/results', label: 'Results', icon: 'trending-up' },
        { path: '/schedule', label: 'Schedule', icon: 'calendar' },
      ],
      parent: [
        { path: '/children', label: 'Children', icon: 'heart' },
        { path: '/progress', label: 'Progress', icon: 'trending-up' },
        { path: '/reports', label: 'Reports', icon: 'file-text' },
      ],
      admin: [
        { path: '/admin/users', label: 'Users', icon: 'users' },
        { path: '/admin/exams', label: 'Exams', icon: 'clipboard' },
        { path: '/admin/analytics', label: 'Analytics', icon: 'pie-chart' },
        { path: '/admin/settings', label: 'Settings', icon: 'settings' },
      ],
    };

    return [...baseLinks, ...(roleLinks[user.role] || [])];
  };

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
      {name === 'home' && <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />}
      {name === 'info' && (
        <>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </>
      )}
      {name === 'mail' && (
        <>
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
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
      {name === 'clipboard' && (
        <>
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        </>
      )}
      {name === 'plus' && (
        <>
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
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
      {name === 'bar-chart' && (
        <>
          <line x1="12" y1="20" x2="12" y2="10" />
          <line x1="18" y1="20" x2="18" y2="4" />
          <line x1="6" y1="20" x2="6" y2="16" />
        </>
      )}
      {name === 'trending-up' && (
        <>
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </>
      )}
      {name === 'calendar' && (
        <>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </>
      )}
      {name === 'heart' && (
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      )}
      {name === 'file-text' && (
        <>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14,2 14,8 20,8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10,9 9,9 8,9" />
        </>
      )}
      {name === 'pie-chart' && (
        <>
          <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
          <path d="M22 12A10 10 0 0 0 12 2v10z" />
        </>
      )}
      {name === 'settings' && (
        <>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </>
      )}
      {name === 'bell' && (
        <>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </>
      )}
      {name === 'user' && (
        <>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </>
      )}
      {name === 'log-out' && (
        <>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </>
      )}
      {name === 'chevron-down' && <polyline points="6 9 12 15 18 9" />}
      {name === 'book-open' && (
        <>
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </>
      )}
    </svg>
  );

  // Helper function to get avatar URL
  const getAvatarUrl = (avatar) => {
    if (!avatar) return null;
    
    // If it's a full URL, return as is
    if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
      return avatar;
    }
    
    // If it's a relative path, construct the full URL
    if (avatar.startsWith('/uploads/') || avatar.startsWith('uploads/')) {
      const cleanPath = avatar.startsWith('/') ? avatar : `/${avatar}`;
      return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${cleanPath}`;
    }
    
    return avatar;
  };

  return (
    <header className={`nav-header ${scrolled ? 'scrolled' : ''}`}>
      <nav className="nav-container">
        {/* Enhanced Brand with Logo and Text */}
        <Link to="/" className="nav-brand">
          <div className="brand-logo">
            <img 
              src="/images/Exam_logo.jpg" 
              alt="A3 E SCHOOL - Olympiad Exams & Online Tuition" 
              className="logo-image"
              onError={(e) => {
                console.error('Logo failed to load');
                e.target.style.display = 'none';
              }}
            />
          </div>
          <div className="brand-text">
            <span className="brand-name">A3 E SCHOOL</span>
            <span className="brand-subtitle">Olympiad Exams & Online Tuition</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className={`nav-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <ul className="nav-links">
            {getNavLinks().map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <FeatherIcon name={link.icon} size={16} />
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="nav-actions">
            {user ? (
              <>
                {/* Notifications */}
                <Link to="/notifications" className="nav-action notification-action" onClick={closeMobileMenu}>
                  <FeatherIcon name="bell" size={18} />
                  {unreadCount > 0 && <span className="notification-dot">{unreadCount}</span>}
                </Link>

                {/* Profile */}
                <div className="profile-wrapper">
                  <button
                    className="profile-trigger"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  >
                    <div className="profile-avatar">
                      {user.avatar ? (
                        <img src={getAvatarUrl(user.avatar)} alt={user.firstName || user.name} />
                      ) : (
                        <span>{(user.firstName?.[0] || user.name?.[0] || 'U').toUpperCase()}</span>
                      )}
                    </div>
                    <div className="profile-details">
                      <span className="profile-name">{user.firstName || user.name}</span>
                      <span className="profile-role">{user.role}</span>
                    </div>
                    <FeatherIcon 
                      name="chevron-down" 
                      size={14} 
                      className={`profile-chevron ${isProfileMenuOpen ? 'open' : ''}`} 
                    />
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileMenuOpen && (
                    <>
                      <div className="profile-backdrop" onClick={() => setIsProfileMenuOpen(false)} />
                      <div className="profile-dropdown">
                        <div className="profile-header">
                          <div className="profile-avatar-large">
                            {user.avatar ? (
                              <img src={getAvatarUrl(user.avatar)} alt={user.firstName || user.name} />
                            ) : (
                              <span>{(user.firstName?.[0] || user.name?.[0] || 'U').toUpperCase()}</span>
                            )}
                          </div>
                          <div className="profile-info">
                            <h4>{user.firstName || user.name} {user.lastName || ''}</h4>
                            <p>{user.email}</p>
                            <span className="role-tag">{user.role}</span>
                          </div>
                        </div>
                        <div className="profile-menu">
                          <Link to="/profile" className="profile-item" onClick={() => setIsProfileMenuOpen(false)}>
                            <FeatherIcon name="user" size={16} />
                            <span>My Profile</span>
                          </Link>
                          <Link to="/settings" className="profile-item" onClick={() => setIsProfileMenuOpen(false)}>
                            <FeatherIcon name="settings" size={16} />
                            <span>Settings</span>
                          </Link>
                          <div className="profile-divider" />
                          <button className="profile-item logout" onClick={handleLogout}>
                            <FeatherIcon name="log-out" size={16} />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="auth-actions">
                <Link to="/login" className="auth-btn login" onClick={closeMobileMenu}>
                  Login
                </Link>
                <Link to="/register" className="auth-btn register" onClick={closeMobileMenu}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`mobile-toggle ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div className="mobile-backdrop" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </header>
  );
};

export default Navbar;
