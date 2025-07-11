// frontend/src/components/Question.js
import React, { useState } from 'react';
import './Question.css';

const Question = ({ 
  question, 
  questionNumber, 
  totalQuestions, 
  selectedAnswer, 
  onAnswerSelect,
  isReview = false,
  correctAnswer = null,
  showExplanation = false 
}) => {
  const [selectedOption, setSelectedOption] = useState(selectedAnswer || null);

  const handleOptionSelect = (optionIndex) => {
    if (isReview) return;
    
    setSelectedOption(optionIndex);
    if (onAnswerSelect) {
      onAnswerSelect(question._id, optionIndex);
    }
  };

  const getOptionClass = (optionIndex) => {
    let classes = 'option';
    
    if (selectedOption === optionIndex) {
      classes += ' selected';
    }
    
    if (isReview && correctAnswer !== null) {
      if (optionIndex === correctAnswer) {
        classes += ' correct';
      } else if (optionIndex === selectedOption && optionIndex !== correctAnswer) {
        classes += ' incorrect';
      }
    }
    
    return classes;
  };

  const renderMedia = () => {
    if (!question.media) return null;
    
    const { type, url } = question.media;
    
    switch (type) {
      case 'image':
        return <img src={url} alt="Question media" className="question-media" />;
      case 'video':
        return (
          <video controls className="question-media">
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case 'audio':
        return (
          <audio controls className="question-media">
            <source src={url} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        );
      default:
        return null;
    }
  };

  return (
    <div className="question-container">
      <div className="question-header">
        <div className="question-number">
          Question {questionNumber} of {totalQuestions}
        </div>
        <div className="question-type">
          <span className={`type-badge ${question.type}`}>
            {question.type}
          </span>
        </div>
      </div>
      
      <div className="question-content">
        <div className="question-text">
          {question.text}
        </div>
        
        {renderMedia()}
        
        {question.type === 'multiple-choice' && (
          <div className="options-container">
            {question.options.map((option, index) => (
              <div
                key={index}
                className={getOptionClass(index)}
                onClick={() => handleOptionSelect(index)}
              >
                <div className="option-marker">
                  {String.fromCharCode(65 + index)}
                </div>
                <div className="option-text">
                  {option}
                </div>
                {isReview && correctAnswer === index && (
                  <div className="option-indicator correct">
                    <i className="fas fa-check"></i>
                  </div>
                )}
                {isReview && selectedOption === index && index !== correctAnswer && (
                  <div className="option-indicator incorrect">
                    <i className="fas fa-times"></i>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {question.type === 'true-false' && (
          <div className="options-container">
            {['True', 'False'].map((option, index) => (
              <div
                key={index}
                className={getOptionClass(index)}
                onClick={() => handleOptionSelect(index)}
              >
                <div className="option-marker">
                  {option === 'True' ? 'T' : 'F'}
                </div>
                <div className="option-text">
                  {option}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {question.type === 'text' && (
          <div className="text-answer">
            <textarea
              value={selectedOption || ''}
              onChange={(e) => handleOptionSelect(e.target.value)}
              placeholder="Enter your answer here..."
              rows="4"
              disabled={isReview}
            />
          </div>
        )}
        
        {showExplanation && question.explanation && (
          <div className="question-explanation">
            <h4>Explanation:</h4>
            <p>{question.explanation}</p>
          </div>
        )}
      </div>
      
      <div className="question-footer">
        {question.marks && (
          <div className="question-marks">
            <i className="fas fa-star"></i>
            {question.marks} mark{question.marks > 1 ? 's' : ''}
          </div>
        )}
        
        {question.difficulty && (
          <div className={`difficulty-badge ${question.difficulty}`}>
            {question.difficulty}
          </div>
        )}
      </div>
    </div>
  );
};

export default Question;