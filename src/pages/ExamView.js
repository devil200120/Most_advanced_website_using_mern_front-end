import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';

const ExamView = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExamData();
  }, [examId]);

  // Replace the fetchExamData function (around lines 20-42):

  const fetchExamData = async () => {
    try {
      setLoading(true);
      
      // Fetch exam details with questions included
      const examResponse = await api.get(`/exams/${examId}`);
      if (examResponse.data.success) {
        const examData = examResponse.data.data.exam || examResponse.data.data;
        setExam(examData);
        // Questions are already included in the exam data
        setQuestions(examData.questions || []);
      }
    } catch (error) {
      console.error('Error fetching exam data:', error);
      toast.error('Failed to load exam details');
      navigate('/admin/exams');
    } finally {
      setLoading(false);
    }
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <Loading />;

  if (!exam) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <h4>Exam Not Found</h4>
          <p>The exam you're looking for doesn't exist or has been deleted.</p>
          <Link to="/admin/exams" className="btn btn-primary">
            Back to Exams
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Exam Details</h2>
        <div>
          <Link 
            to={`/exam/${examId}/edit`} 
            className="btn btn-primary me-2"
          >
            Edit Exam
          </Link>
          <Link 
            to="/admin/exams" 
            className="btn btn-secondary"
          >
            Back to Exams
          </Link>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h4>{exam.title}</h4>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-6">
                  <strong>Subject:</strong> {exam.subject}
                </div>
                <div className="col-md-6">
                  <strong>Duration:</strong> {exam.duration} minutes
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <strong>Total Questions:</strong> {questions.length}
                </div>
                <div className="col-md-6">
                  <strong>Total Marks:</strong> {exam.totalMarks || questions.length}
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <strong>Status:</strong>{' '}
                  <span className={`badge ${exam.isActive ? 'bg-success' : 'bg-secondary'}`}>
                    {exam.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="col-md-6">
                  <strong>Created:</strong> {formatDate(exam.createdAt)}
                </div>
              </div>

              {exam.description && (
                <div className="mb-3">
                  <strong>Description:</strong>
                  <p className="mt-2">{exam.description}</p>
                </div>
              )}

              {exam.instructions && (
                <div className="mb-3">
                  <strong>Instructions:</strong>
                  <p className="mt-2">{exam.instructions}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <Link 
                  to={`/exam/${examId}/questions`} 
                  className="btn btn-outline-primary"
                >
                  Manage Questions
                </Link>
                <Link 
                  to={`/exam/${examId}/submissions`} 
                  className="btn btn-outline-info"
                >
                  View Submissions
                </Link>
                <Link 
                  to={`/exam/${examId}/results`} 
                  className="btn btn-outline-success"
                >
                  View Results
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {questions.length > 0 && (
        <div className="card mt-4">
          <div className="card-header">
            <h5>Questions ({questions.length})</h5>
          </div>
          <div className="card-body">

            {questions.map((question, index) => (
              <div key={question._id} className="mb-3 p-3 border rounded">
                <h6>Question {index + 1}</h6>
                <p><strong>{question.text || question.question}</strong></p>
                <div className="row">
                  {question.options && question.options.map((option, optIndex) => (
                    <div key={option._id || optIndex} className="col-md-6">
                      <span className={option.isCorrect ? 'text-success fw-bold' : ''}>
                        {String.fromCharCode(65 + optIndex)}. {option.text}
                        {option.isCorrect && ' ✓'}
                      </span>
                    </div>
                  ))}
                </div>
                <small className="text-muted">
                  Points: {question.marks || question.points || 1} | 
                  Difficulty: {question.difficulty || 'Medium'}
                </small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamView;
