import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Loading from '../components/Loading';
import './CreateExam.css';

const CreateExam = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [examData, setExamData] = useState({
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
      timezone: 'UTC'
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

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    type: 'multiple-choice',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    points: 1,
    explanation: '',
    image: null
  });

  const handleExamDataChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setExamData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setExamData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSettingChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setExamData(prev => ({
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
      setExamData(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          [field]: value
        }
      }));
    }
  };

  const handleQuestionChange = (field, value) => {
    setCurrentQuestion(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const addOption = () => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removeOption = (index) => {
    if (currentQuestion.options.length > 2) {
      const newOptions = currentQuestion.options.filter((_, i) => i !== index);
      setCurrentQuestion(prev => ({
        ...prev,
        options: newOptions
      }));
    }
  };

  const validateQuestion = () => {
    if (!currentQuestion.question.trim()) {
      alert('Question text is required');
      return false;
    }

    if (currentQuestion.question.trim().length < 10) {
      alert('Question text must be at least 10 characters');
      return false;
    }

    if (currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'true-false') {
      const validOptions = currentQuestion.options.filter(opt => opt.trim() !== '');
      if (validOptions.length < 2) {
        alert('At least 2 options are required for multiple choice questions');
        return false;
      }
      
      if (!currentQuestion.correctAnswer || !validOptions.includes(currentQuestion.correctAnswer)) {
        alert('Please select a valid correct answer');
        return false;
      }
    }

    if (currentQuestion.points <= 0) {
      alert('Points must be greater than 0');
      return false;
    }

    return true;
  };

  const addQuestion = () => {
    if (!validateQuestion()) return;

    const questionToAdd = {
      ...currentQuestion,
      id: Date.now(),
      options: currentQuestion.options.filter(opt => opt.trim() !== '')
    };

    setQuestions(prev => [...prev, questionToAdd]);
    
    setCurrentQuestion({
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 1,
      explanation: '',
      image: null
    });

    alert('Question added successfully');
  };

  const removeQuestion = (id) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    alert('Question removed');
  };

  const validateExamData = () => {
    if (!examData.title.trim()) {
      alert('Exam title is required');
      return false;
    }

    if (examData.title.length < 3) {
      alert('Exam title must be at least 3 characters');
      return false;
    }

    if (!examData.description.trim()) {
      alert('Exam description is required');
      return false;
    }

    if (examData.description.length < 10) {
      alert('Exam description must be at least 10 characters');
      return false;
    }

    if (!examData.subject) {
      alert('Subject is required');
      return false;
    }

    if (!examData.grade) {
      alert('Grade is required');
      return false;
    }

    if (!examData.duration || examData.duration < 1) {
      alert('Duration must be at least 1 minute');
      return false;
    }

    if (!examData.passingMarks || examData.passingMarks < 0) {
      alert('Passing marks must be 0 or greater');
      return false;
    }

    if (!examData.schedule.startDate) {
      alert('Start date is required');
      return false;
    }

    if (!examData.schedule.endDate) {
      alert('End date is required');
      return false;
    }

    const startDate = new Date(examData.schedule.startDate);
    const endDate = new Date(examData.schedule.endDate);

    if (startDate >= endDate) {
      alert('End date must be after start date');
      return false;
    }

    if (startDate < new Date()) {
      alert('Start date cannot be in the past');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateExamData()) return;
    
    if (questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    setLoading(true);
    
    try {
      const examPayload = {
        title: examData.title.trim(),
        description: examData.description.trim(),
        subject: examData.subject,
        grade: examData.grade,
        duration: parseInt(examData.duration),
        passingMarks: parseInt(examData.passingMarks),
        examType: examData.examType,
        difficulty: examData.difficulty,
        schedule: {
          startDate: examData.schedule.startDate,
          endDate: examData.schedule.endDate,
          timezone: examData.schedule.timezone
        },
        settings: examData.settings,
        instructions: examData.instructions.trim(),
        eligibleStudents: examData.eligibleStudents,
        tags: examData.tags
      };

      console.log('Submitting exam payload:', examPayload);

      // Step 1: Create the exam
      const examResponse = await api.post('/exams', examPayload);
      
      if (examResponse.data.success) {
        const examId = examResponse.data.data.exam._id;
        
        // Step 2: Create questions and get their IDs
        if (questions.length > 0) {
          const createdQuestionIds = [];
          
          for (const question of questions) {
            try {
              // Prepare options in the correct format for the backend
              let formattedOptions = [];
              let correctAnswerData = null;

              if (question.type === 'multiple-choice' || question.type === 'true-false') {
                formattedOptions = question.options.map(option => ({
                  text: option,
                  isCorrect: option === question.correctAnswer
                }));
                correctAnswerData = question.correctAnswer;
              }

              const questionPayload = {
                text: question.question.trim(),
                type: question.type,
                subject: examData.subject,
                topic: examData.title, // Use exam title as topic
                marks: parseInt(question.points),
                difficulty: examData.difficulty,
                options: formattedOptions,
                correctAnswer: correctAnswerData,
                explanation: question.explanation?.trim() || ''
              };
              
              console.log('Creating question:', questionPayload);
              const questionResponse = await api.post('/questions', questionPayload);
              
              if (questionResponse.data.success) {
                createdQuestionIds.push(questionResponse.data.data.question._id);
              }
            } catch (questionError) {
              console.error('Error creating question:', questionError);
              
              // Log the detailed error for debugging
              if (questionError.response?.data?.errors) {
                console.error('Question validation errors:', questionError.response.data.errors);
              }
              
              throw new Error(`Failed to create question: ${question.question.substring(0, 50)}...`);
            }
          }
          
          // Step 3: Add questions to exam
          if (createdQuestionIds.length > 0) {
            try {
              await api.post(`/exams/${examId}/questions`, {
                questionIds: createdQuestionIds
              });
            } catch (addQuestionsError) {
              console.error('Error adding questions to exam:', addQuestionsError);
              throw new Error('Failed to add questions to exam');
            }
          }
        }
        
        alert('Exam created successfully!');
        navigate('/exams');
      }
    } catch (error) {
      console.error('Error creating exam:', error);
      
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map(err => 
          `${err.path || err.param || err.field || 'Field'}: ${err.msg || err.message}`
        ).join('\n');
        alert(`Validation errors:\n${errorMessages}`);
      } else if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else if (error.message) {
        alert(error.message);
      } else {
        alert('Error creating exam. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateExamData()) return;
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const getTotalPoints = () => {
    return questions.reduce((total, question) => total + question.points, 0);
  };

  const generateDateTimeLocal = (daysFromNow = 0, hours = 9) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    date.setHours(hours, 0, 0, 0);
    return date.toISOString().slice(0, 16);
  };

  if (loading) return <Loading />;

  return (
    <div className="create-exam-container">
      <div className="create-exam-header">
        <h1>Create New Exam</h1>
        <div className="step-indicator">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <span>1</span>
            <label>Exam Details</label>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <span>2</span>
            <label>Questions</label>
          </div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <span>3</span>
            <label>Review & Submit</label>
          </div>
        </div>
      </div>

      {currentStep === 1 && (
        <div className="step-content">
          <h2>Exam Information</h2>
          
          <div className="form-group">
            <label>Exam Title *</label>
            <input
              type="text"
              value={examData.title}
              onChange={(e) => handleExamDataChange('title', e.target.value)}
              placeholder="Enter exam title"
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={examData.description}
              onChange={(e) => handleExamDataChange('description', e.target.value)}
              placeholder="Enter exam description"
              className="form-control"
              rows={4}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Subject *</label>
              <select
                value={examData.subject}
                onChange={(e) => handleExamDataChange('subject', e.target.value)}
                className="form-control"
                required
              >
                <option value="">Select Subject</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
                <option value="History">History</option>
                <option value="Geography">Geography</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
              </select>
            </div>

            <div className="form-group">
              <label>Grade *</label>
              <select
                value={examData.grade}
                onChange={(e) => handleExamDataChange('grade', e.target.value)}
                className="form-control"
                required
              >
                <option value="">Select Grade</option>
                <option value="6">Grade 6</option>
                <option value="7">Grade 7</option>
                <option value="8">Grade 8</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Duration (minutes) *</label>
              <input
                type="number"
                value={examData.duration}
                onChange={(e) => handleExamDataChange('duration', parseInt(e.target.value))}
                min="1"
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label>Passing Marks *</label>
              <input
                type="number"
                value={examData.passingMarks}
                onChange={(e) => handleExamDataChange('passingMarks', parseInt(e.target.value))}
                min="0"
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Exam Type</label>
              <select
                value={examData.examType}
                onChange={(e) => handleExamDataChange('examType', e.target.value)}
                className="form-control"
              >
                <option value="practice">Practice</option>
                <option value="assessment">Assessment</option>
                <option value="final">Final Exam</option>
              </select>
            </div>

            <div className="form-group">
              <label>Difficulty</label>
              <select
                value={examData.difficulty}
                onChange={(e) => handleExamDataChange('difficulty', e.target.value)}
                className="form-control"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date *</label>
              <input
                type="datetime-local"
                value={examData.schedule.startDate}
                onChange={(e) => handleExamDataChange('schedule.startDate', e.target.value)}
                min={generateDateTimeLocal()}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label>End Date *</label>
              <input
                type="datetime-local"
                value={examData.schedule.endDate}
                onChange={(e) => handleExamDataChange('schedule.endDate', e.target.value)}
                min={examData.schedule.startDate || generateDateTimeLocal()}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Instructions</label>
            <textarea
              value={examData.instructions}
              onChange={(e) => handleExamDataChange('instructions', e.target.value)}
              placeholder="Enter exam instructions for students"
              className="form-control"
              rows={3}
            />
          </div>

          <h3>Settings</h3>
          
          <div className="settings-grid">
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={examData.settings.randomizeQuestions}
                  onChange={(e) => handleSettingChange('randomizeQuestions', e.target.checked)}
                />
                Randomize Questions
              </label>
            </div>

            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={examData.settings.randomizeOptions}
                  onChange={(e) => handleSettingChange('randomizeOptions', e.target.checked)}
                />
                Randomize Options
              </label>
            </div>

            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={examData.settings.allowReview}
                  onChange={(e) => handleSettingChange('allowReview', e.target.checked)}
                />
                Allow Review
              </label>
            </div>

            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={examData.settings.showResultsImmediately}
                  onChange={(e) => handleSettingChange('showResultsImmediately', e.target.checked)}
                />
                Show Results Immediately
              </label>
            </div>

            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={examData.settings.showCorrectAnswers}
                  onChange={(e) => handleSettingChange('showCorrectAnswers', e.target.checked)}
                />
                Show Correct Answers
              </label>
            </div>

            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={examData.settings.allowMultipleAttempts}
                  onChange={(e) => handleSettingChange('allowMultipleAttempts', e.target.checked)}
                />
                Allow Multiple Attempts
              </label>
            </div>
          </div>

          {examData.settings.allowMultipleAttempts && (
            <div className="form-group">
              <label>Max Attempts</label>
              <input
                type="number"
                value={examData.settings.maxAttempts}
                onChange={(e) => handleSettingChange('maxAttempts', parseInt(e.target.value))}
                min="1"
                max="10"
                className="form-control"
              />
            </div>
          )}

          <h4>Proctoring Settings</h4>
          
          <div className="settings-grid">
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={examData.settings.proctoring.enabled}
                  onChange={(e) => handleSettingChange('proctoring.enabled', e.target.checked)}
                />
                Enable Proctoring
              </label>
            </div>

            {examData.settings.proctoring.enabled && (
              <>
                <div className="setting-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={examData.settings.proctoring.preventTabSwitching}
                      onChange={(e) => handleSettingChange('proctoring.preventTabSwitching', e.target.checked)}
                    />
                    Prevent Tab Switching
                  </label>
                </div>

                <div className="setting-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={examData.settings.proctoring.requireFullscreen}
                      onChange={(e) => handleSettingChange('proctoring.requireFullscreen', e.target.checked)}
                    />
                    Require Fullscreen
                  </label>
                </div>

                <div className="setting-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={examData.settings.proctoring.disableRightClick}
                      onChange={(e) => handleSettingChange('proctoring.disableRightClick', e.target.checked)}
                    />
                    Disable Right Click
                  </label>
                </div>

                <div className="setting-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={examData.settings.proctoring.preventCopyPaste}
                      onChange={(e) => handleSettingChange('proctoring.preventCopyPaste', e.target.checked)}
                    />
                    Prevent Copy/Paste
                  </label>
                </div>

                <div className="setting-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={examData.settings.proctoring.enableCamera}
                      onChange={(e) => handleSettingChange('proctoring.enableCamera', e.target.checked)}
                    />
                    Enable Camera
                  </label>
                </div>

                <div className="setting-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={examData.settings.proctoring.enableMicrophone}
                      onChange={(e) => handleSettingChange('proctoring.enableMicrophone', e.target.checked)}
                    />
                    Enable Microphone
                  </label>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="step-content">
          <h2>Add Questions</h2>
          
          <div className="question-form">
            <div className="form-group">
              <label>Question Type</label>
              <select
                value={currentQuestion.type}
                onChange={(e) => handleQuestionChange('type', e.target.value)}
                className="form-control"
              >
                <option value="multiple-choice">Multiple Choice</option>
                <option value="true-false">True/False</option>
                <option value="fill-blanks">Fill in the Blanks</option>
                <option value="essay">Essay</option>
              </select>
            </div>

            <div className="form-group">
              <label>Question Text *</label>
              <textarea
                value={currentQuestion.question}
                onChange={(e) => handleQuestionChange('question', e.target.value)}
                placeholder="Enter your question here"
                className="form-control"
                rows={3}
                required
              />
            </div>

            {(currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'true-false') && (
              <div className="options-section">
                <label>Options *</label>
                {currentQuestion.type === 'true-false' ? (
                  <div className="true-false-options">
                    <div className="option-item">
                      <input
                        type="radio"
                        name="trueFalseAnswer"
                        value="True"
                        checked={currentQuestion.correctAnswer === 'True'}
                        onChange={(e) => {
                          handleQuestionChange('correctAnswer', e.target.value);
                          handleQuestionChange('options', ['True', 'False']);
                        }}
                      />
                      <label>True</label>
                    </div>
                    <div className="option-item">
                      <input
                        type="radio"
                        name="trueFalseAnswer"
                        value="False"
                        checked={currentQuestion.correctAnswer === 'False'}
                        onChange={(e) => {
                          handleQuestionChange('correctAnswer', e.target.value);
                          handleQuestionChange('options', ['True', 'False']);
                        }}
                      />
                      <label>False</label>
                    </div>
                  </div>
                ) : (
                  <div className="options-list">
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="option-item">
                        <input
                          type="radio"
                          name="correctAnswer"
                          value={option}
                          checked={currentQuestion.correctAnswer === option}
                          onChange={(e) => handleQuestionChange('correctAnswer', e.target.value)}
                          disabled={!option.trim()}
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          className="form-control option-input"
                        />
                        {currentQuestion.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="btn btn-danger btn-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addOption}
                      className="btn btn-secondary btn-sm"
                    >
                      Add Option
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label>Points *</label>
                <input
                  type="number"
                  value={currentQuestion.points}
                  onChange={(e) => handleQuestionChange('points', parseInt(e.target.value))}
                  min="1"
                  className="form-control"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Explanation (Optional)</label>
              <textarea
                value={currentQuestion.explanation}
                onChange={(e) => handleQuestionChange('explanation', e.target.value)}
                placeholder="Explain the correct answer"
                className="form-control"
                rows={2}
              />
            </div>

            <div className="question-actions">
              <button
                type="button"
                onClick={addQuestion}
                className="btn btn-primary"
              >
                Add Question
              </button>
            </div>
          </div>

          {questions.length > 0 && (
            <div className="questions-list">
              <h3>Added Questions ({questions.length})</h3>
              <div className="questions-summary">
                <p>Total Points: {getTotalPoints()}</p>
              </div>
              
              {questions.map((question, index) => (
                <div key={question.id} className="question-preview">
                  <div className="question-header">
                    <span className="question-number">Q{index + 1}</span>
                    <span className="question-type">{question.type}</span>
                    <span className="question-points">{question.points} pts</span>
                    <button
                      type="button"
                      onClick={() => removeQuestion(question.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="question-content">
                    <p>{question.question}</p>
                    {question.options && question.options.length > 0 && (
                      <ul className="options-preview">
                        {question.options.map((option, optIndex) => (
                          <li
                            key={optIndex}
                            className={option === question.correctAnswer ? 'correct' : ''}
                          >
                            {option}
                            {option === question.correctAnswer && ' ✓'}
                          </li>
                        ))}
                      </ul>
                    )}
                    {question.explanation && (
                      <p className="explanation"><strong>Explanation:</strong> {question.explanation}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {currentStep === 3 && (
        <div className="step-content">
          <h2>Review & Submit</h2>
          
          <div className="exam-summary">
            <div className="summary-section">
              <h3>Exam Details</h3>
              <div className="summary-grid">
                <div><strong>Title:</strong> {examData.title}</div>
                <div><strong>Subject:</strong> {examData.subject}</div>
                <div><strong>Grade:</strong> {examData.grade}</div>
                <div><strong>Duration:</strong> {examData.duration} minutes</div>
                <div><strong>Passing Marks:</strong> {examData.passingMarks}</div>
                <div><strong>Total Questions:</strong> {questions.length}</div>
                <div><strong>Total Points:</strong> {getTotalPoints()}</div>
                <div><strong>Start Date:</strong> {new Date(examData.schedule.startDate).toLocaleString()}</div>
                <div><strong>End Date:</strong> {new Date(examData.schedule.endDate).toLocaleString()}</div>
              </div>
            </div>

            <div className="summary-section">
              <h3>Description</h3>
              <p>{examData.description}</p>
            </div>

            {examData.instructions && (
              <div className="summary-section">
                <h3>Instructions</h3>
                <p>{examData.instructions}</p>
              </div>
            )}

            <div className="summary-section">
              <h3>Settings</h3>
              <div className="settings-summary">
                <div>Randomize Questions: {examData.settings.randomizeQuestions ? 'Yes' : 'No'}</div>
                <div>Randomize Options: {examData.settings.randomizeOptions ? 'Yes' : 'No'}</div>
                <div>Allow Review: {examData.settings.allowReview ? 'Yes' : 'No'}</div>
                <div>Show Results Immediately: {examData.settings.showResultsImmediately ? 'Yes' : 'No'}</div>
                <div>Show Correct Answers: {examData.settings.showCorrectAnswers ? 'Yes' : 'No'}</div>
                <div>Multiple Attempts: {examData.settings.allowMultipleAttempts ? `Yes (${examData.settings.maxAttempts} max)` : 'No'}</div>
                <div>Proctoring: {examData.settings.proctoring.enabled ? 'Enabled' : 'Disabled'}</div>
              </div>
            </div>

            <div className="summary-section">
              <h3>Questions Preview</h3>
              {questions.map((question, index) => (
                <div key={question.id} className="question-summary">
                  <div className="question-title">
                    Q{index + 1}: {question.question.substring(0, 100)}
                    {question.question.length > 100 && '...'}
                  </div>
                  <div className="question-details">
                    Type: {question.type} | Points: {question.points}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="step-navigation">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={prevStep}
            className="btn btn-secondary"
            disabled={loading}
          >
            Previous
          </button>
        )}
        
        {currentStep < 3 ? (
          <button
            type="button"
            onClick={nextStep}
            className="btn btn-primary"
            disabled={loading}
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-success"
            disabled={loading || questions.length === 0}
          >
            {loading ? 'Creating Exam...' : 'Create Exam'}
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateExam;