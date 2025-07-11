import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Loading from '../components/Loading';
import './Settings.css';

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      examReminders: true,
      resultNotifications: true,
      systemUpdates: false
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      allowMessages: true
    },
    preferences: {
      language: 'en',
      timezone: 'UTC',
      theme: 'light',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h'
    },
    exam: {
      autoSave: true,
      confirmBeforeSubmit: true,
      showTimer: true,
      playSound: false,
      enableKeyboardShortcuts: true
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users/settings');
      if (response.data.success) {
        setSettings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (category, key, value) => {
    try {
      // Update local state immediately
      setSettings(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [key]: value
        }
      }));

      // Update on server
      await api.put('/users/settings', {
        category,
        key,
        value
      });
    } catch (error) {
      console.error('Error updating setting:', error);
      // Revert local state on error
      fetchSettings();
    }
  };

  const saveAllSettings = async () => {
    setSaving(true);
    try {
      const response = await api.put('/users/settings/bulk', settings);
      if (response.data.success) {
        alert('Settings saved successfully!');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const resetSettings = async () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      setLoading(true);
      try {
        const response = await api.post('/users/settings/reset');
        if (response.data.success) {
          setSettings(response.data.data.settings);
          alert('Settings reset successfully!');
        }
      } catch (error) {
        console.error('Error resetting settings:', error);
        alert('Error resetting settings. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings</h1>
        <div className="settings-actions">
          <button 
            className="btn btn-secondary" 
            onClick={resetSettings}
            disabled={saving}
          >
            Reset to Default
          </button>
          <button 
            className="btn btn-primary" 
            onClick={saveAllSettings}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save All'}
          </button>
        </div>
      </div>

      <div className="settings-content">
        <div className="settings-tabs">
          <button 
            className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button 
            className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </button>
          <button 
            className={`tab-button ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            Privacy
          </button>
          <button 
            className={`tab-button ${activeTab === 'exam' ? 'active' : ''}`}
            onClick={() => setActiveTab('exam')}
          >
            Exam Settings
          </button>
        </div>

        <div className="settings-panel">
          {activeTab === 'general' && (
            <div className="settings-section">
              <h3>General Preferences</h3>
              
              <div className="setting-item">
                <label>Language</label>
                <select 
                  value={settings.preferences.language}
                  onChange={(e) => updateSetting('preferences', 'language', e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div className="setting-item">
                <label>Timezone</label>
                <select 
                  value={settings.preferences.timezone}
                  onChange={(e) => updateSetting('preferences', 'timezone', e.target.value)}
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time</option>
                  <option value="PST">Pacific Time</option>
                  <option value="GMT">GMT</option>
                </select>
              </div>

              <div className="setting-item">
                <label>Theme</label>
                <select 
                  value={settings.preferences.theme}
                  onChange={(e) => updateSetting('preferences', 'theme', e.target.value)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div className="setting-item">
                <label>Date Format</label>
                <select 
                  value={settings.preferences.dateFormat}
                  onChange={(e) => updateSetting('preferences', 'dateFormat', e.target.value)}
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div className="setting-item">
                <label>Time Format</label>
                <select 
                  value={settings.preferences.timeFormat}
                  onChange={(e) => updateSetting('preferences', 'timeFormat', e.target.value)}
                >
                  <option value="12h">12 Hour</option>
                  <option value="24h">24 Hour</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h3>Notification Settings</h3>
              
              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.emailNotifications}
                    onChange={(e) => updateSetting('notifications', 'emailNotifications', e.target.checked)}
                  />
                  Email Notifications
                </label>
                <p>Receive notifications via email</p>
              </div>

              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.pushNotifications}
                    onChange={(e) => updateSetting('notifications', 'pushNotifications', e.target.checked)}
                  />
                  Push Notifications
                </label>
                <p>Receive push notifications in your browser</p>
              </div>

              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.examReminders}
                    onChange={(e) => updateSetting('notifications', 'examReminders', e.target.checked)}
                  />
                  Exam Reminders
                </label>
                <p>Get reminded about upcoming exams</p>
              </div>

              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.resultNotifications}
                    onChange={(e) => updateSetting('notifications', 'resultNotifications', e.target.checked)}
                  />
                  Result Notifications
                </label>
                <p>Get notified when exam results are available</p>
              </div>

              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.systemUpdates}
                    onChange={(e) => updateSetting('notifications', 'systemUpdates', e.target.checked)}
                  />
                  System Updates
                </label>
                <p>Receive notifications about system updates</p>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="settings-section">
              <h3>Privacy Settings</h3>
              
              <div className="setting-item">
                <label>Profile Visibility</label>
                <select 
                  value={settings.privacy.profileVisibility}
                  onChange={(e) => updateSetting('privacy', 'profileVisibility', e.target.value)}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="friends">Friends Only</option>
                </select>
              </div>

              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.privacy.showEmail}
                    onChange={(e) => updateSetting('privacy', 'showEmail', e.target.checked)}
                  />
                  Show Email Address
                </label>
                <p>Allow others to see your email address</p>
              </div>

              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.privacy.showPhone}
                    onChange={(e) => updateSetting('privacy', 'showPhone', e.target.checked)}
                  />
                  Show Phone Number
                </label>
                <p>Allow others to see your phone number</p>
              </div>

              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.privacy.allowMessages}
                    onChange={(e) => updateSetting('privacy', 'allowMessages', e.target.checked)}
                  />
                  Allow Messages
                </label>
                <p>Allow other users to send you messages</p>
              </div>
            </div>
          )}

          {activeTab === 'exam' && (
            <div className="settings-section">
              <h3>Exam Settings</h3>
              
              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.exam.autoSave}
                    onChange={(e) => updateSetting('exam', 'autoSave', e.target.checked)}
                  />
                  Auto Save
                </label>
                <p>Automatically save your progress during exams</p>
              </div>

              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.exam.confirmBeforeSubmit}
                    onChange={(e) => updateSetting('exam', 'confirmBeforeSubmit', e.target.checked)}
                  />
                  Confirm Before Submit
                </label>
                <p>Show confirmation dialog before submitting exam</p>
              </div>

              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.exam.showTimer}
                    onChange={(e) => updateSetting('exam', 'showTimer', e.target.checked)}
                  />
                  Show Timer
                </label>
                <p>Display remaining time during exams</p>
              </div>

              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.exam.playSound}
                    onChange={(e) => updateSetting('exam', 'playSound', e.target.checked)}
                  />
                  Play Sound Alerts
                </label>
                <p>Play sound notifications during exams</p>
              </div>

              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.exam.enableKeyboardShortcuts}
                    onChange={(e) => updateSetting('exam', 'enableKeyboardShortcuts', e.target.checked)}
                  />
                  Enable Keyboard Shortcuts
                </label>
                <p>Use keyboard shortcuts during exams</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;