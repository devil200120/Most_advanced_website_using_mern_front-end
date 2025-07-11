// frontend/src/components/ExamResults.js
import React from 'react';
import Chart from './Chart';
import './ExamResults.css';

const ExamResults = ({ 
  examResult, 
  exam, 
  showDetailedAnalysis = true,
  showQuestionReview = true 
}) => {
  const getGradeInfo = (percentage) => {
    if (percentage >= 90) return { letter: 'A', color: '#28a745', label: 'Excellent' };
    if (percentage >= 80) return { letter: 'B', color: '#17a2b8', label: 'Good' };
    if (percentage >= 70) return { letter: 'C', color: '#ffc107', label: 'Average' };
    if (percentage >= 60) return { letter: 'D', color: '#fd7e14', label: 'Below Average' };
    return { letter: 'F', color: '#dc3545', label: 'Fail' };
  };

  const percentage = Math.round((examResult.score / exam.totalMarks) * 100);
  const gradeInfo = getGradeInfo(percentage);

  const subjectAnalysis = examResult.subjectAnalysis || [];
  const difficultyAnalysis = examResult.difficultyAnalysis || [];
  const timeAnalysis = examResult.timeAnalysis || {};

  const chartData = subjectAnalysis.map(subject => ({
    label: subject.name,
    value: subject.percentage
  }));

  const difficultyChartData = difficultyAnalysis.map(difficulty => ({
    label: difficulty.level,
    value: difficulty.correct
  }));

  return (
    <div className="exam-results">
      <div className="results-header">
        <h1>Exam Results</h1>
        <div className="exam-info">
          <h2>{exam.title}</h2>
          <p>{exam.subject} • {exam.duration} minutes</p>
        </div>
      </div>

      <div className="results-summary">
        <div className="score-card">
          <div className="score-display">
            <div className="score-circle" style={{ borderColor: gradeInfo.color }}>
              <div className="score-percentage" style={{ color: gradeInfo.color }}>
                {percentage}%
              </div>
              <div className="score-grade" style={{ color: gradeInfo.color }}>
                {gradeInfo.letter}
              </div>
            </div>
            <div className="score-details">
              <div className="score-fraction">
                {examResult.score} / {exam.totalMarks}
              </div>
              <div className="score-label" style={{ color: gradeInfo.color }}>
                {gradeInfo.label}
              </div>
            </div>
          </div>
        </div>

        <div className="results-stats">
          <div className="stat-item">
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{timeAnalysis.timeTaken || 'N/A'}</div>
              <div className="stat-label">Time Taken</div>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{examResult.correctAnswers || 0}</div>
              <div className="stat-label">Correct Answers</div>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">
              <i className="fas fa-times-circle"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{examResult.incorrectAnswers || 0}</div>
              <div className="stat-label">Incorrect Answers</div>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">
              <i className="fas fa-question-circle"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{examResult.unansweredQuestions || 0}</div>
              <div className="stat-label">Unanswered</div>
            </div>
          </div>
        </div>
      </div>

      {showDetailedAnalysis && (
        <div className="detailed-analysis">
          <h3>Performance Analysis</h3>
          
          <div className="analysis-grid">
            {subjectAnalysis.length > 0 && (
              <div className="analysis-card">
                <h4>Subject-wise Performance</h4>
                <Chart 
                  data={chartData}
                  type="bar"
                  height={200}
                />
                <div className="subject-details">
                  {subjectAnalysis.map(subject => (
                    <div key={subject.name} className="subject-item">
                      <span className="subject-name">{subject.name}</span>
                      <div className="subject-progress">
                        <div 
                          className="progress-bar"
                          style={{ 
                            width: `${subject.percentage}%`,
                            backgroundColor: getGradeInfo(subject.percentage).color 
                          }}
                        ></div>
                      </div>
                      <span className="subject-score">{subject.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {difficultyAnalysis.length > 0 && (
              <div className="analysis-card">
                <h4>Difficulty-wise Performance</h4>
                <Chart 
                  data={difficultyChartData}
                  type="pie"
                  height={200}
                />
                <div className="difficulty-details">
                  {difficultyAnalysis.map(difficulty => (
                    <div key={difficulty.level} className="difficulty-item">
                      <span className="difficulty-name">{difficulty.level}</span>
                      <span className="difficulty-score">
                        {difficulty.correct}/{difficulty.total}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showQuestionReview && examResult.questionReview && (
        <div className="question-review">
          <h3>Question Review</h3>
          <div className="review-summary">
            <div className="review-filters">
              <button className="filter-btn active" data-filter="all">
                All Questions
              </button>
              <button className="filter-btn" data-filter="correct">
                Correct ({examResult.correctAnswers})
              </button>
              <button className="filter-btn" data-filter="incorrect">
                Incorrect ({examResult.incorrectAnswers})
              </button>
              <button className="filter-btn" data-filter="unanswered">
                Unanswered ({examResult.unansweredQuestions})
              </button>
            </div>
          </div>
          
          <div className="questions-review-list">
            {examResult.questionReview.map((question, index) => (
              <div key={index} className="review-question">
                <div className="review-question-header">
                  <span className="question-number">Q{index + 1}</span>
                  <span className={`question-status ${question.status}`}>
                    {question.status === 'correct' && <i className="fas fa-check"></i>}
                    {question.status === 'incorrect' && <i className="fas fa-times"></i>}
                    {question.status === 'unanswered' && <i className="fas fa-minus"></i>}
                    {question.status}
                  </span>
                </div>
                
                <div className="review-question-content">
                  <p className="question-text">{question.text}</p>
                  
                  <div className="answer-comparison">
                    <div className="answer-item">
                      <span className="answer-label">Your Answer:</span>
                      <span className={`answer-value ${question.status}`}>
                        {question.userAnswer || 'Not answered'}
                      </span>
                    </div>
                    
                    <div className="answer-item">
                      <span className="answer-label">Correct Answer:</span>
                      <span className="answer-value correct">
                        {question.correctAnswer}
                      </span>
                    </div>
                  </div>
                  
                  {question.explanation && (
                    <div className="question-explanation">
                      <h5>Explanation:</h5>
                      <p>{question.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="results-actions">
        <button className="btn-primary">
          <i className="fas fa-download"></i>
          Download Results
        </button>
        <button className="btn-secondary">
          <i className="fas fa-share"></i>
          Share Results
        </button>
        <button className="btn-tertiary">
          <i className="fas fa-redo"></i>
          Retake Exam
        </button>
      </div>
    </div>
  );
};

export default ExamResults;