import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import './Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { notifications } = useNotification();
  const location = useLocation();
  const navigate = useNavigate();

  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getNavLinks = () => {
    if (!user) {
      return [
        { path: '/', label: 'Home', icon: 'fas fa-home' },
        { path: '/about', label: 'About', icon: 'fas fa-info-circle' },
        { path: '/contact', label: 'Contact', icon: 'fas fa-envelope' },
      ];
    }

    const commonLinks = [
      { path: '/dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
      { path: '/profile', label: 'Profile', icon: 'fas fa-user' },
    ];

    switch (user.role) {
      case 'teacher':
        return [
          ...commonLinks,
          { path: '/exams', label: 'My Exams', icon: 'fas fa-clipboard-list' },
          { path: '/create-exam', label: 'Create Exam', icon: 'fas fa-plus-circle' },
          { path: '/results', label: 'Results', icon: 'fas fa-chart-bar' },
          { path: '/students', label: 'Students', icon: 'fas fa-users' },
        ];
      case 'student':
        return [
          ...commonLinks,
         { path: '/exams', label: 'Available Exams', icon: 'fas fa-clipboard-list' },
          { path: '/results', label: 'My Results', icon: 'fas fa-chart-line' },
          { path: '/schedule', label: 'Schedule', icon: 'fas fa-calendar-alt' },
        ];
      case 'parent':
        return [
          ...commonLinks,
          { path: '/children', label: 'Children', icon: 'fas fa-child' },
          { path: '/progress', label: 'Progress', icon: 'fas fa-chart-line' },
          { path: '/reports', label: 'Reports', icon: 'fas fa-file-alt' },
        ];
      case 'admin':
        return [
          ...commonLinks,
          { path: '/admin/users', label: 'Users', icon: 'fas fa-users-cog' },
          { path: '/admin/exams', label: 'All Exams', icon: 'fas fa-clipboard-list' },
          { path: '/admin/analytics', label: 'Analytics', icon: 'fas fa-chart-pie' },
          { path: '/admin/settings', label: 'Settings', icon: 'fas fa-cog' },
        ];
      default:
        return commonLinks;
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <i className="fas fa-graduation-cap"></i>
          <span>ExamPro</span>
        </Link>

        <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <div className="navbar-nav">
            {getNavLinks().map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className={link.icon}></i>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="navbar-actions">
            {user ? (
              <>
                <div className="notification-icon">
                  <Link to="/notifications" className="nav-action-btn">
                    <i className="fas fa-bell"></i>
                    {unreadCount > 0 && (
                      <span className="notification-badge">{unreadCount}</span>
                    )}
                  </Link>
                </div>

                <div className="profile-dropdown">
                  <button 
                    className="profile-btn"
                    onClick={toggleProfileMenu}
                  >
                    <div className="profile-avatar">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} />
                      ) : (
                        <i className="fas fa-user"></i>
                      )}
                    </div>
                    <div className="profile-info">
                      <span className="profile-name">{user.name}</span>
                      <span className="profile-role">{user.role}</span>
                    </div>
                    <i className="fas fa-chevron-down"></i>
                  </button>

                  {isProfileMenuOpen && (
                    <div className="profile-menu">
                      <Link to="/profile" className="profile-menu-item">
                        <i className="fas fa-user"></i>
                        Profile
                      </Link>
                      <Link to="/settings" className="profile-menu-item">
                        <i className="fas fa-cog"></i>
                        Settings
                      </Link>
                      <Link to="/help" className="profile-menu-item">
                        <i className="fas fa-question-circle"></i>
                        Help
                      </Link>
                      <hr className="profile-menu-divider" />
                      <button 
                        onClick={handleLogout}
                        className="profile-menu-item logout-btn"
                      >
                        <i className="fas fa-sign-out-alt"></i>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;