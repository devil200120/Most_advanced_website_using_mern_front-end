import React, { useState, useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';
import Loading from '../components/Loading';
import './Notifications.css';

const Notifications = () => {
  const { notifications, fetchNotifications, markAsRead, markAllAsRead } = useNotification();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      await fetchNotifications();
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffMs = now - notificationDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return notificationDate.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    const icons = {
      exam: 'fas fa-clipboard-list',
      result: 'fas fa-chart-bar',
      reminder: 'fas fa-bell',
      system: 'fas fa-cog',
      payment: 'fas fa-credit-card',
      message: 'fas fa-envelope',
      achievement: 'fas fa-trophy',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle'
    };
    return icons[type] || 'fas fa-bell';
  };

  const getNotificationColor = (type) => {
    const colors = {
      exam: '#007bff',
      result: '#28a745',
      reminder: '#ffc107',
      system: '#6c757d',
      payment: '#17a2b8',
      message: '#6f42c1',
      achievement: '#fd7e14',
      warning: '#dc3545',
      info: '#17a2b8'
    };
    return colors[type] || '#007bff';
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification._id);
    }
    
    // Handle notification action based on type
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  const handleSelectNotification = (notificationId) => {
    setSelectedNotifications(prev => {
      if (prev.includes(notificationId)) {
        return prev.filter(id => id !== notificationId);
      } else {
        return [...prev, notificationId];
      }
    });
  };
  const handleBulkDelete = async () => {
  if (selectedNotifications.length === 0) {
    alert('Please select notifications to delete');
    return;
  }

  if (!window.confirm(`Are you sure you want to delete ${selectedNotifications.length} notifications?`)) {
    return;
  }

  try {
    await api.delete('/notifications/bulk', {
      data: { notificationIds: selectedNotifications }
    });
    
    // Remove deleted notifications from state
    setSelectedNotifications([]);
    await loadNotifications();
    alert('Notifications deleted successfully');
  } catch (error) {
    console.error('Error deleting notifications:', error);
    alert('Error deleting notifications. Please try again.');
  }
};


  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n._id));
    }
  };

  const handleBulkMarkAsRead = async () => {
    try {
      await Promise.all(
        selectedNotifications.map(id => markAsRead(id))
      );
      setSelectedNotifications([]);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

// Removed redundant JSX block outside of return statement
  const deleteNotification = async (notificationId) => {
    if (window.confirm('Delete this notification?')) {
      try {
        await api.delete(`/notifications/${notificationId}`);
        await fetchNotifications();
      } catch (error) {
        console.error('Error deleting notification:', error);
      }
    }
  };

  if (loading) return <Loading message="Loading notifications..." />;

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <div className="header-info">
          <h1>Notifications</h1>
          <p>
            {unreadCount > 0 ? (
              <>You have <span className="unread-count">{unreadCount}</span> unread notifications</>
            ) : (
              'All notifications are read'
            )}
          </p>
        </div>
        <div className="header-actions">
          {unreadCount > 0 && (
            <button className="btn btn-outline" onClick={markAllAsRead}>
              <i className="fas fa-check-double"></i>
              Mark All Read
            </button>
          )}
        </div>
      </div>

      <div className="notifications-content">
        <div className="notifications-filters">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({notifications.length})
            </button>
            <button 
              className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
              onClick={() => setFilter('unread')}
            >
              Unread ({unreadCount})
            </button>
            <button 
              className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
              onClick={() => setFilter('read')}
            >
              Read ({notifications.length - unreadCount})
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
              className={`filter-btn ${filter === 'system' ? 'active' : ''}`}
              onClick={() => setFilter('system')}
            >
              System
            </button>
          </div>

          {filteredNotifications.length > 0 && (
            <div className="bulk-actions">
              <div className="select-all">
                <label>
                  <input
                    type="checkbox"
                    checked={selectedNotifications.length === filteredNotifications.length}
                    onChange={handleSelectAll}
                  />
                  Select All
                </label>
              </div>
              
              {selectedNotifications.length > 0 && (
                <div className="action-buttons">
                  <button 
                    className="btn btn-sm btn-outline"
                    onClick={handleBulkMarkAsRead}
                  >
                    Mark Read ({selectedNotifications.length})
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={handleBulkDelete}
                  >
                    Delete ({selectedNotifications.length})
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="notifications-list">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div 
                key={notification._id}
                className={`notification-item ${!notification.read ? 'unread' : ''}`}
              >
                <div className="notification-select">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification._id)}
                    onChange={() => handleSelectNotification(notification._id)}
                  />
                </div>
                
                <div 
                  className="notification-content"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-icon">
                    <div 
                      className="icon-circle"
                      style={{ backgroundColor: getNotificationColor(notification.type) }}
                    >
                      <i className={getNotificationIcon(notification.type)}></i>
                    </div>
                    {!notification.read && <div className="unread-dot"></div>}
                  </div>
                  
                  <div className="notification-details">
                    <div className="notification-header">
                      <h3 className="notification-title">{notification.title}</h3>
                      <span className="notification-time">
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>
                    <p className="notification-message">{notification.message}</p>
                    {notification.metadata && (
                      <div className="notification-metadata">
                        {notification.metadata.examTitle && (
                          <span className="metadata-item">
                            <i className="fas fa-clipboard-list"></i>
                            {notification.metadata.examTitle}
                          </span>
                        )}
                        {notification.metadata.score && (
                          <span className="metadata-item">
                            <i className="fas fa-star"></i>
                            Score: {notification.metadata.score}%
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="notification-actions">
                  <button 
                    className="action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification._id);
                    }}
                    title="Delete notification"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-notifications">
              <div className="empty-icon">
                <i className="fas fa-bell-slash"></i>
              </div>
              <h3>No notifications found</h3>
              <p>
                {filter === 'all' 
                  ? "You don't have any notifications yet."
                  : `No ${filter} notifications found.`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;