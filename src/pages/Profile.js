import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Loading from '../components/Loading';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    address: '',
    bio: '',
    avatar: null
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [stats, setStats] = useState({
    totalExams: 0,
    completedExams: 0,
    averageScore: 0,
    totalStudents: 0,
    createdExams: 0
  });
  const [achievements, setAchievements] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingAchievements, setLoadingAchievements] = useState(false);

  useEffect(() => {
    if (user) {
      // Handle both firstName/lastName and name field
      const userName = user.name || (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName || '');
      
      setProfileData({
        name: userName,
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        address: user.address || '',
        bio: user.bio || '',
        avatar: user.avatar
      });
      fetchUserStats();
      fetchUserAchievements();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      setLoadingStats(true);
      const response = await api.get('/users/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchUserAchievements = async () => {
    try {
      setLoadingAchievements(true);
      const response = await api.get('/users/achievements');
      if (response.data.success) {
        setAchievements(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoadingAchievements(false);
    }
  };

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

 const handleAvatarChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, or GIF)');
      return;
    }
    
    setProfileData(prev => ({
      ...prev,
      avatar: file
    }));
    
    console.log('Avatar file selected:', file.name, file.size, file.type);
  }
};

  // ...existing code...


const handleProfileSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const formData = new FormData();
    
    // Split name into firstName and lastName
    const nameParts = profileData.name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Map frontend fields to backend expected fields
    const mappedData = {
      firstName: firstName,
      lastName: lastName,
      phone: profileData.phoneNumber, // Map phoneNumber to phone
      dateOfBirth: profileData.dateOfBirth,
      address: profileData.address
      // Note: bio is not accepted by backend, so we exclude it
    };
    
    // Only append non-empty values
    Object.keys(mappedData).forEach(key => {
      if (mappedData[key] !== null && mappedData[key] !== '') {
        formData.append(key, mappedData[key]);
      }
    });

    // Handle avatar file separately
    if (profileData.avatar instanceof File) {
      formData.append('avatar', profileData.avatar);
    }

    const response = await api.put('/users/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.data.success) {
      updateUser(response.data.data.user);
      setEditing(false);
      alert('Profile updated successfully!');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    
    // Show more detailed error message
    const errorMessage = error.response?.data?.message || 'Error updating profile. Please try again.';
    const validationErrors = error.response?.data?.errors;
    
    if (validationErrors && validationErrors.length > 0) {
      const errorMessages = validationErrors.map(err => err.msg).join('\n');
      alert(`Validation Error:\n${errorMessages}`);
    } else {
      alert(errorMessage);
    }
  } finally {
    setLoading(false);
  }
};

// ...existing code...

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await api.put('/users/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (response.data.success) {
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        alert('Password updated successfully!');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert(error.response?.data?.message || 'Error updating password');
    } finally {
      setLoading(false);
    }
  };

  const getRoleStats = () => {
    switch (user?.role) {
      case 'student':
        return [
          { label: 'Exams Available', value: stats.totalExams || 0, icon: 'fas fa-clipboard-list' },
          { label: 'Completed', value: stats.completedExams || 0, icon: 'fas fa-check-circle' },
          { label: 'Average Score', value: `${stats.averageScore || 0}%`, icon: 'fas fa-chart-line' },
          { label: 'Rank', value: `#${stats.rank || 'N/A'}`, icon: 'fas fa-trophy' }
        ];
      case 'teacher':
        return [
          { label: 'Exams Created', value: stats.createdExams || 0, icon: 'fas fa-plus-circle' },
          { label: 'Total Students', value: stats.totalStudents || 0, icon: 'fas fa-users' },
          { label: 'Active Exams', value: stats.activeExams || 0, icon: 'fas fa-play-circle' },
          { label: 'Success Rate', value: `${stats.successRate || 0}%`, icon: 'fas fa-chart-bar' }
        ];
      case 'parent':
        return [
          { label: 'Children', value: stats.totalChildren || 0, icon: 'fas fa-child' },
          { label: 'Notifications', value: stats.notifications || 0, icon: 'fas fa-bell' },
          { label: 'Reports Viewed', value: stats.reportsViewed || 0, icon: 'fas fa-file-alt' },
          { label: 'Meetings', value: stats.meetings || 0, icon: 'fas fa-handshake' }
        ];
      default:
        return [];
    }
  };

  const getUserDisplayName = () => {
    return user?.name || (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.firstName || 'User');
  };

  if (loading) return <Loading message="Updating profile..." overlay />;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img 
            src={profileData.avatar || user?.avatar || '/default-avatar.png'} 
            alt={getUserDisplayName()}
            className="avatar-image"
          />
          <div className="avatar-overlay">
            <i className="fas fa-camera"></i>
          </div>
        </div>
        <div className="profile-info">
          <h1>{getUserDisplayName()}</h1>
          <p className="profile-role">{user?.role?.toUpperCase()}</p>
          <p className="profile-email">{user?.email}</p>
          <div className="profile-stats">
            <span>Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : 'N/A'}</span>
            <span>Last login: {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}</span>
          </div>
        </div>
        <div className="profile-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setEditing(!editing)}
          >
            <i className="fas fa-edit"></i>
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="profile-nav">
            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <i className="fas fa-user"></i>
              Profile
            </button>
            <button 
              className={`nav-item ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveTab('stats')}
            >
              <i className="fas fa-chart-bar"></i>
              Statistics
            </button>
            <button 
              className={`nav-item ${activeTab === 'achievements' ? 'active' : ''}`}
              onClick={() => setActiveTab('achievements')}
            >
              <i className="fas fa-trophy"></i>
              Achievements
            </button>
            <button 
              className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <i className="fas fa-shield-alt"></i>
              Security
            </button>
          </div>
        </div>

        <div className="profile-main">
          {activeTab === 'profile' && (
            <div className="tab-content">
              <div className="section-header">
                <h2>Profile Information</h2>
                <p>Manage your personal information and preferences</p>
              </div>

              <form onSubmit={handleProfileSubmit} className="profile-form">
                <div className="form-section">
                  <h3>Personal Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => handleProfileChange('name', e.target.value)}
                        disabled={!editing}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleProfileChange('email', e.target.value)}
                        disabled={!editing}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        value={profileData.phoneNumber}
                        onChange={(e) => handleProfileChange('phoneNumber', e.target.value)}
                        disabled={!editing}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Date of Birth</label>
                      <input
                        type="date"
                        value={profileData.dateOfBirth}
                        onChange={(e) => handleProfileChange('dateOfBirth', e.target.value)}
                        disabled={!editing}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Address</label>
                    <textarea
                      value={profileData.address}
                      onChange={(e) => handleProfileChange('address', e.target.value)}
                      disabled={!editing}
                      rows="3"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => handleProfileChange('bio', e.target.value)}
                      disabled={!editing}
                      rows="4"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  
                 

{editing && (
  <div className="form-group">
    <label>Profile Picture</label>
    <div className="avatar-upload-section">
      {/* Current avatar preview */}
      <div className="current-avatar">
        {profileData.avatar ? (
          profileData.avatar instanceof File ? (
            <img 
              src={URL.createObjectURL(profileData.avatar)} 
              alt="Avatar preview" 
              className="avatar-preview"
              style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <img 
              src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${profileData.avatar}`} 
              alt="Current avatar" 
              className="avatar-preview"
              style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
            />
          )
        ) : (
          <div className="no-avatar" style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            backgroundColor: '#f0f0f0', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '24px',
            color: '#999'
          }}>
            <i className="fas fa-user"></i>
          </div>
        )}
      </div>
      
      {/* File input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleAvatarChange}
        className="file-input"
        style={{ marginTop: '10px' }}
      />
      <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '5px' }}>
        Supported formats: JPEG, PNG, GIF. Max size: 5MB
      </small>
    </div>
  </div>
)}
                </div>

                {editing && (
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      <i className="fas fa-save"></i>
                      Save Changes
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setEditing(false)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="tab-content">
              <div className="section-header">
                <h2>Statistics</h2>
                <p>Your performance and activity overview</p>
              </div>

              {loadingStats ? (
                <Loading message="Loading statistics..." />
              ) : (
                <div className="stats-grid">
                  {getRoleStats().map((stat, index) => (
                    <div key={index} className="stat-card">
                      <div className="stat-icon">
                        <i className={stat.icon}></i>
                      </div>
                      <div className="stat-info">
                        <h3>{stat.value}</h3>
                        <p>{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="tab-content">
              <div className="section-header">
                <h2>Achievements</h2>
                <p>Your accomplishments and milestones</p>
              </div>

              {loadingAchievements ? (
                <Loading message="Loading achievements..." />
              ) : (
                <div className="achievements-grid">
                  {achievements.length > 0 ? (
                    achievements.map((achievement, index) => (
                      <div key={index} className="achievement-card">
                        <div className="achievement-icon">
                          <i className={achievement.icon}></i>
                        </div>
                        <div className="achievement-info">
                          <h4>{achievement.title}</h4>
                          <p>{achievement.description}</p>
                          <span className="achievement-date">
                            {new Date(achievement.earnedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-achievements">
                      <i className="fas fa-trophy"></i>
                      <p>No achievements yet. Keep working to unlock them!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="tab-content">
              <div className="section-header">
                <h2>Security Settings</h2>
                <p>Manage your account security and password</p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="security-form">
                <div className="form-section">
                  <h3>Change Password</h3>
                  <div className="form-group">
                    <label>Current Password</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      required
                    />
                  </div>
                  
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-key"></i>
                    Update Password
                  </button>
                </div>
              </form>

              <div className="security-info">
                <h3>Security Information</h3>
                <div className="security-item">
                  <i className="fas fa-shield-alt"></i>
                  <div>
                    <h4>Account Security</h4>
                    <p>Your account is protected with industry-standard security measures</p>
                  </div>
                </div>
                <div className="security-item">
                  <i className="fas fa-clock"></i>
                  <div>
                    <h4>Last Login</h4>
                    <p>{user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;