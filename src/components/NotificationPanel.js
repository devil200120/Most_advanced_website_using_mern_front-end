import React, { useState } from 'react';
import './NotificationPanel.css';

const NotificationPanel = ({ notifications = [] }) => {
  const [filter, setFilter] = useState('all');
  const [showAll, setShowAll] = useState(false);

  const formatTimeAgo = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffMs = now - notificationDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notificationDate.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'exam':
        return 'fas fa-clipboard-list';
      case 'result':
        return 'fas fa-chart-bar';
      case 'reminder':
        return 'fas fa-bell';
      case 'system':
        return 'fas fa-cog';
      case 'payment':
        return 'fas fa-credit-card';
      default:
        return 'fas fa-info-circle';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'exam':
        return '#007bff';
      case 'result':
        return '#28a745';
      case 'reminder':
        return '#ffc107';
      case 'system':
        return '#6c757d';
      case 'payment':
        return '#17a2b8';
      default:
        return '#007bff';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    return notification.type === filter;
  });

  const displayedNotifications = showAll 
    ? filteredNotifications 
    : filteredNotifications.slice(0, 5);

  return (
    <div className="notification-panel">
      <div className="notification-header">
        <h3>Notifications</h3>
        <div className="notification-badge">
          {notifications.filter(n => !n.read).length}
        </div>
      </div>

      <div className="notification-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-btn ${filter === 'exam' ? 'active' : ''}`}
          onClick={() => setFilter('exam')}
        >
          Exams
        </button>
        <button 
          className={`filter-btn ${filter === 'result' ? 'active' : ''}`}
          onClick={() => setFilter('result')}
        >
          Results
        </button>
        <button 
          className={`filter-btn ${filter === 'reminder' ? 'active' : ''}`}
          onClick={() => setFilter('reminder')}
        >
          Reminders
        </button>
      </div>

      <div className="notification-list">
        {displayedNotifications.length > 0 ? (
          displayedNotifications.map((notification, index) => (
            <div 
              key={notification._id || index} 
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
            >
              <div className="notification-content">
                <div className="notification-icon-container">
                  <div 
                    className="notification-icon"
                    style={{ backgroundColor: getNotificationColor(notification.type) }}
                  >
                    <i className={getNotificationIcon(notification.type)}></i>
                  </div>
                  {!notification.read && <div className="unread-dot"></div>}
                </div>
                
                <div className="notification-details">
                  <div className="notification-title">
                    {notification.title}
                  </div>
                  <div className="notification-message">
                    {notification.message}
                  </div>
                  <div className="notification-time">
                    {formatTimeAgo(notification.createdAt)}
                  </div>
                </div>
              </div>
              
              {!notification.read && (
                <button className="mark-read-btn">
                  <i className="fas fa-check"></i>
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="no-notifications">
            <i className="fas fa-bell-slash"></i>
            <p>No notifications</p>
          </div>
        )}
      </div>

      {filteredNotifications.length > 5 && (
        <div className="notification-footer">
          <button 
            className="show-more-btn"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : `Show All (${filteredNotifications.length})`}
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;