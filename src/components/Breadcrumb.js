// frontend/src/components/Breadcrumb.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Breadcrumb.css';

const Breadcrumb = ({ customPath = null }) => {
  const location = useLocation();
  const pathnames = customPath || location.pathname.split('/').filter(x => x);

  const breadcrumbNameMap = {
    dashboard: 'Dashboard',
    'create-exam': 'Create Exam',
    'exam-list': 'Exam List',
    'exam-result': 'Exam Results',
    profile: 'Profile',
    settings: 'Settings',
    notifications: 'Notifications',
    help: 'Help',
    about: 'About',
    contact: 'Contact',
    payment: 'Payment',
    admin: 'Admin Panel',
    teacher: 'Teacher Portal',
    student: 'Student Portal',
    parent: 'Parent Portal'
  };

  const getBreadcrumbName = (path) => {
    return breadcrumbNameMap[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <nav className="breadcrumb-container">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/">
            <i className="fas fa-home"></i>
            Home
          </Link>
        </li>
        {pathnames.map((path, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          
          return (
            <li key={path} className={`breadcrumb-item ${isLast ? 'active' : ''}`}>
              <i className="fas fa-chevron-right breadcrumb-separator"></i>
              {isLast ? (
                <span>{getBreadcrumbName(path)}</span>
              ) : (
                <Link to={routeTo}>{getBreadcrumbName(path)}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;