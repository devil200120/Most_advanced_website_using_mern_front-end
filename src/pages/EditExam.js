import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Loading from '../components/Loading';
import './EditExam.css';

const EditExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exam, setExam] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    grade: '',
    duration: 60,
    passingMarks: 60,
    examType: 'practice',
    difficulty: 'medium',
    schedule: {
      startDate: '',
      endDate: '',
      timezone: 'Asia/Kolkata'
    },
    settings: {
      randomizeQuestions: false,
      randomizeOptions: false,
      allowReview: true,
      showResultsImmediately: true,
      showCorrectAnswers: false,
      allowMultipleAttempts: false,
      maxAttempts: 1,
      proctoring: {
        enabled: false,
        preventTabSwitching: true,
        requireFullscreen: true,
        disableRightClick: true,
        preventCopyPaste: true,
        enableCamera: false,
        enableMicrophone: false
      }
    },
    instructions: '',
    eligibleStudents: [],
    tags: []
  });

  useEffect(() => {
    fetchExamData();
  }, [examId]);

  const fetchExamData = async () => {
    try {
      const response = await api.get(`/exams/${examId}`);
      if (response.data.success) {
        const examData = response.data.data.exam;
        setExam(examData);
        setFormData({
          ...examData,
          schedule: {
            ...examData.schedule,
            startDate: examData.schedule.startDate ? new Date(examData.schedule.startDate).toISOString().slice(0, 16) : '',
            endDate: examData.schedule.endDate ? new Date(examData.schedule.endDate).toISOString().slice(0, 16) : ''
          }
        });
      }
    } catch (error) {
      console.error('Error fetching exam:', error);
      alert('Error loading exam data');
      navigate('/exams');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSettingChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          [parent]: {
            ...prev.settings[parent],
            [child]: value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          [field]: value
        }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updateData = {
        ...formData,
        schedule: {
          ...formData.schedule,
          startDate: new Date(formData.schedule.startDate).toISOString(),
          endDate: new Date(formData.schedule.endDate).toISOString()
        }
      };

      const response = await api.put(`/exams/${examId}`, updateData);
      
      if (response.data.success) {
        alert('Exam updated successfully!');
        navigate('/exams');
      }
    } catch (error) {
      console.error('Error updating exam:', error);
      alert('Error updating exam: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading message="Loading exam data..." />;
  if (!exam) return <div>Exam not found</div>;

  return (
    <div className="edit-exam-container">
      <div className="edit-exam-header">
        <h1>Edit Exam</h1>
        <button 
          onClick={() => navigate('/exams')} 
          className="btn btn-secondary"
        >
          <i className="fas fa-arrow-left"></i> Back to Exams
        </button>
      </div>

      <form onSubmit={handleSubmit} className="edit-exam-form">
        <div className="form-section">
          <h2>Basic Information</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label>Subject *</label>
              <select
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                required
                className="form-control"
              >
                <option value="">Select Subject</option>
                <option value="mathematics">Mathematics</option>
                <option value="science">Science</option>
                <option value="english">English</option>
                <option value="history">History</option>
                <option value="geography">Geography</option>
                <option value="computer-science">Computer Science</option>
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
                <option value="biology">Biology</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              required
              className="form-control"
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Grade *</label>
              <select
                value={formData.grade}
                onChange={(e) => handleInputChange('grade', e.target.value)}
                required
                className="form-control"
              >
                <option value="">Select Grade</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={`Grade ${i + 1}`}>Grade {i + 1}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Duration (minutes) *</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                min="1"
                required
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label>Passing Marks *</label>
              <input
                type="number"
                value={formData.passingMarks}
                onChange={(e) => handleInputChange('passingMarks', parseInt(e.target.value))}
                min="0"
                required
                className="form-control"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Exam Type</label>
              <select
                value={formData.examType}
                onChange={(e) => handleInputChange('examType', e.target.value)}
                className="form-control"
              >
                <option value="practice">Practice</option>
                <option value="assessment">Assessment</option>
                <option value="final">Final</option>
                <option value="quiz">Quiz</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => handleInputChange('difficulty', e.target.value)}
                className="form-control"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Schedule</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>Start Date & Time *</label>
              <input
                type="datetime-local"
                value={formData.schedule.startDate}
                onChange={(e) => handleInputChange('schedule.startDate', e.target.value)}
                required
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label>End Date & Time *</label>
              <input
                type="datetime-local"
                value={formData.schedule.endDate}
                onChange={(e) => handleInputChange('schedule.endDate', e.target.value)}
                required
                className="form-control"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Instructions</h2>
          <div className="form-group">
            <textarea
              value={formData.instructions}
              onChange={(e) => handleInputChange('instructions', e.target.value)}
              placeholder="Enter exam instructions for students"
              className="form-control"
              rows={3}
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Settings</h2>
          
          <div className="settings-grid">
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={formData.settings.randomizeQuestions}
                  onChange={(e) => handleSettingChange('randomizeQuestions', e.target.checked)}
                />
                Randomize Questions
              </label>
            </div>

            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={formData.settings.randomizeOptions}
                  onChange={(e) => handleSettingChange('randomizeOptions', e.target.checked)}
                />
                Randomize Options
              </label>
            </div>

            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={formData.settings.allowReview}
                  onChange={(e) => handleSettingChange('allowReview', e.target.checked)}
                />
                Allow Review
              </label>
            </div>

            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={formData.settings.showResultsImmediately}
                  onChange={(e) => handleSettingChange('showResultsImmediately', e.target.checked)}
                />
                Show Results Immediately
              </label>
            </div>

            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={formData.settings.showCorrectAnswers}
                  onChange={(e) => handleSettingChange('showCorrectAnswers', e.target.checked)}
                />
                Show Correct Answers
              </label>
            </div>

            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={formData.settings.allowMultipleAttempts}
                  onChange={(e) => handleSettingChange('allowMultipleAttempts', e.target.checked)}
                />
                Allow Multiple Attempts
              </label>
            </div>
          </div>

          {formData.settings.allowMultipleAttempts && (
            <div className="form-group">
              <label>Max Attempts</label>
              <input
                type="number"
                value={formData.settings.maxAttempts}
                onChange={(e) => handleSettingChange('maxAttempts', parseInt(e.target.value))}
                min="1"
                max="10"
                className="form-control"
              />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/exams')} 
            className="btn btn-secondary"
            disabled={saving}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Update Exam'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditExam;
