import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Loading from '../components/Loading';
import './ExamQuestions.css';

const ExamQuestions = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');

  useEffect(() => {
    fetchExamData();
    fetchExamQuestions();
    fetchAvailableQuestions();
  }, [examId]);

  const fetchExamData = async () => {
    try {
      const response = await api.get(`/exams/${examId}`);
      if (response.data.success) {
        setExam(response.data.data.exam);
      }
    } catch (error) {
      console.error('Error fetching exam:', error);
      navigate('/exams');
    }
  };

  const fetchExamQuestions = async () => {
    try {
      const response = await api.get(`/exams/${examId}/questions`);
      if (response.data.success) {
        setQuestions(response.data.data.questions || []);
      }
    } catch (error) {
      console.error('Error fetching exam questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableQuestions = async () => {
    try {
      const response = await api.get('/questions');
      if (response.data.success) {
        setAvailableQuestions(response.data.data.questions || []);
      }
    } catch (error) {
      console.error('Error fetching available questions:', error);
    }
  };

  const addQuestionsToExam = async () => {
    if (selectedQuestions.length === 0) {
      alert('Please select at least one question');
      return;
    }

    try {
      const response = await api.post(`/exams/${examId}/questions`, {
        questionIds: selectedQuestions
      });

      if (response.data.success) {
        setShowAddModal(false);
        setSelectedQuestions([]);
        fetchExamQuestions();
        alert('Questions added successfully!');
      }
    } catch (error) {
      console.error('Error adding questions:', error);
      alert('Error adding questions: ' + (error.response?.data?.message || error.message));
    }
  };

  const removeQuestionFromExam = async (questionId) => {
    if (!window.confirm('Are you sure you want to remove this question from the exam?')) {
      return;
    }

    try {
      const response = await api.delete(`/exams/${examId}/questions/${questionId}`);
      if (response.data.success) {
        fetchExamQuestions();
        alert('Question removed successfully!');
      }
    } catch (error) {
      console.error('Error removing question:', error);
      alert('Error removing question: ' + (error.response?.data?.message || error.message));
    }
  };

  const toggleQuestionSelection = (questionId) => {
    setSelectedQuestions(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const filteredAvailableQuestions = availableQuestions.filter(question => {
    // Don't show questions already in the exam
    if (questions.some(q => q._id === question._id)) return false;
    
    // Apply filters
    if (searchTerm && !question.text.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filterSubject && question.subject !== filterSubject) return false;
    if (filterDifficulty && question.difficulty !== filterDifficulty) return false;
    
    return true;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'difficulty-easy';
      case 'medium': return 'difficulty-medium';
      case 'hard': return 'difficulty-hard';
      default: return 'difficulty-medium';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'multiple-choice': return 'fas fa-list';
      case 'true-false': return 'fas fa-check-circle';
      case 'essay': return 'fas fa-edit';
      case 'fill-blank': return 'fas fa-keyboard';
      default: return 'fas fa-question';
    }
  };

  if (loading) return <Loading message="Loading exam questions..." />;

  return (
    <div className="exam-questions-container">
      <div className="questions-header">
        <div className="header-info">
          <button 
            onClick={() => navigate('/exams')} 
            className="back-btn"
          >
            <i className="fas fa-arrow-left"></i> Back to Exams
          </button>
          <div>
            <h1>{exam?.title} - Questions</h1>
            <p className="exam-meta">
              {exam?.subject} • {exam?.grade} • {questions.length} questions
            </p>
          </div>
        </div>
        <div className="header-actions">
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
          >
            <i className="fas fa-plus"></i> Add Questions
          </button>
        </div>
      </div>

      {/* Current Questions */}
      <div className="current-questions-section">
        <h2>Current Questions ({questions.length})</h2>
        
        {questions.length === 0 ? (
          <div className="no-questions">
            <i className="fas fa-question-circle"></i>
            <h3>No Questions Added</h3>
            <p>Start by adding questions to this exam.</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary"
            >
              <i className="fas fa-plus"></i> Add First Question
            </button>
          </div>
        ) : (
          <div className="questions-list">
            {questions.map((question, index) => (
              <div key={question._id} className="question-card">
                <div className="question-header">
                  <div className="question-number">Q{index + 1}</div>
                  <div className="question-meta">
                    <span className={`difficulty-badge ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </span>
                    <span className="type-badge">
                      <i className={getTypeIcon(question.type)}></i>
                      {question.type}
                    </span>
                    <span className="marks-badge">
                      {question.marks} mark{question.marks !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <button
                    onClick={() => removeQuestionFromExam(question._id)}
                    className="remove-btn"
                    title="Remove Question"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
                
                <div className="question-content">
                  <p className="question-text">{question.text}</p>
                  
                  {question.options && question.options.length > 0 && (
                    <div className="question-options">
                      {question.options.map((option, optIndex) => (
                        <div 
                          key={optIndex} 
                          className={`option ${option.isCorrect ? 'correct' : ''}`}
                        >
                          <span className="option-letter">
                            {String.fromCharCode(65 + optIndex)}.
                          </span>
                          <span className="option-text">{option.text}</span>
                          {option.isCorrect && (
                            <i className="fas fa-check correct-icon"></i>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {question.explanation && (
                    <div className="question-explanation">
                      <strong>Explanation:</strong> {question.explanation}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Questions Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Questions to Exam</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="close-btn"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              {/* Filters */}
              <div className="filters-section">
                <div className="search-box">
                  <i className="fas fa-search"></i>
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Subjects</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="science">Science</option>
                  <option value="english">English</option>
                  <option value="history">History</option>
                  <option value="geography">Geography</option>
                </select>
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              {/* Available Questions */}
              <div className="available-questions">
                <h3>Available Questions ({filteredAvailableQuestions.length})</h3>
                
                {filteredAvailableQuestions.length === 0 ? (
                  <div className="no-available-questions">
                    <p>No questions found matching your criteria.</p>
                  </div>
                ) : (
                  <div className="questions-grid">
                    {filteredAvailableQuestions.map((question) => (
                      <div 
                        key={question._id} 
                        className={`question-item ${selectedQuestions.includes(question._id) ? 'selected' : ''}`}
                        onClick={() => toggleQuestionSelection(question._id)}
                      >
                        <div className="question-item-header">
                          <input
                            type="checkbox"
                            checked={selectedQuestions.includes(question._id)}
                            onChange={() => toggleQuestionSelection(question._id)}
                          />
                          <div className="question-item-meta">
                            <span className={`difficulty-badge ${getDifficultyColor(question.difficulty)}`}>
                              {question.difficulty}
                            </span>
                            <span className="marks-badge">
                              {question.marks} pts
                            </span>
                          </div>
                        </div>
                        <p className="question-preview">
                          {question.text.substring(0, 100)}
                          {question.text.length > 100 && '...'}
                        </p>
                        <div className="question-item-footer">
                          <span className="subject-tag">{question.subject}</span>
                          <span className="type-tag">
                            <i className={getTypeIcon(question.type)}></i>
                            {question.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="modal-footer">
              <div className="selected-count">
                {selectedQuestions.length} question{selectedQuestions.length !== 1 ? 's' : ''} selected
              </div>
              <div className="modal-actions">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  onClick={addQuestionsToExam}
                  className="btn btn-primary"
                  disabled={selectedQuestions.length === 0}
                >
                  Add Selected Questions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamQuestions;
