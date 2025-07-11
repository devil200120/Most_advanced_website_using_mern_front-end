import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Loading from '../components/Loading';
import './Schedule.css';

const Schedule = () => {
  const { user } = useAuth();
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('upcoming'); // upcoming, past, all
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      let endpoint;
      
      // Different endpoints based on user role
      if (user.role === 'student') {
        endpoint = '/exams'; // Get exams for student
      } else if (user.role === 'teacher') {
        endpoint = '/exams'; // Get exams created by teacher
      } else {
        endpoint = '/exams'; // Admin sees all
      }
      
      const response = await api.get(endpoint);
      setScheduleData(response.data.data?.exams || []);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      setScheduleData([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getExamStatus = (exam) => {
    const now = new Date();
    const startDate = new Date(exam.schedule?.startDate || exam.startTime);
    const endDate = new Date(exam.schedule?.endDate || exam.endTime);

    if (now < startDate) return 'upcoming';
    if (now > endDate) return 'past';
    return 'active';
  };

  const filteredExams = scheduleData.filter(exam => {
    const status = getExamStatus(exam);
    if (currentView === 'upcoming') return status === 'upcoming';
    if (currentView === 'past') return status === 'past';
    if (currentView === 'active') return status === 'active';
    return true; // 'all'
  });

  const groupExamsByDate = (exams) => {
    const grouped = {};
    exams.forEach(exam => {
      const dateKey = new Date(exam.schedule?.startDate || exam.startTime).toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(exam);
    });
    return grouped;
  };

  const groupedExams = groupExamsByDate(filteredExams);

  if (loading) return <Loading />;

  return (
    <div className="schedule-container">
      <div className="schedule-header">
        <div className="header-content">
          <h1>Exam Schedule</h1>
          <p>View your upcoming and past exam schedule</p>
        </div>
        
        <div className="schedule-filters">
          <div className="view-buttons">
            <button 
              className={`btn ${currentView === 'upcoming' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setCurrentView('upcoming')}
            >
              Upcoming
            </button>
            <button 
              className={`btn ${currentView === 'active' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setCurrentView('active')}
            >
              Active
            </button>
            <button 
              className={`btn ${currentView === 'past' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setCurrentView('past')}
            >
              Past
            </button>
            <button 
              className={`btn ${currentView === 'all' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setCurrentView('all')}
            >
              All
            </button>
          </div>
        </div>
      </div>

      {Object.keys(groupedExams).length === 0 ? (
        <div className="no-schedule">
          <i className="fas fa-calendar-alt"></i>
          <h3>No Exams Scheduled</h3>
          <p>
            {currentView === 'upcoming' && "You don't have any upcoming exams."}
            {currentView === 'past' && "You don't have any past exams."}
            {currentView === 'active' && "You don't have any active exams."}
            {currentView === 'all' && "No exams are scheduled."}
          </p>
          {user.role === 'student' && (
            <Link to="/exams" className="btn btn-primary">
              Browse Available Exams
            </Link>
          )}
          {user.role === 'teacher' && (
            <Link to="/create-exam" className="btn btn-primary">
              Create New Exam
            </Link>
          )}
        </div>
      ) : (
        <div className="schedule-content">
          {Object.entries(groupedExams)
            .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
            .map(([dateKey, exams]) => (
              <div key={dateKey} className="schedule-day">
                <div className="day-header">
                  <h3>{formatDate(dateKey)}</h3>
                  <span className="exam-count">{exams.length} exam{exams.length !== 1 ? 's' : ''}</span>
                </div>
                
                <div className="day-exams">
                  {exams
                    .sort((a, b) => new Date(a.schedule?.startDate || a.startTime) - new Date(b.schedule?.startDate || b.startTime))
                    .map(exam => {
                      const status = getExamStatus(exam);
                      const startTime = exam.schedule?.startDate || exam.startTime;
                      const endTime = exam.schedule?.endDate || exam.endTime;
                      
                      return (
                        <div key={exam._id} className={`exam-card ${status}`}>
                          <div className="exam-time">
                            <div className="start-time">{formatTime(startTime)}</div>
                            {endTime && (
                              <div className="end-time">to {formatTime(endTime)}</div>
                            )}
                          </div>
                          
                          <div className="exam-details">
                            <h4>{exam.title}</h4>
                            <p className="exam-subject">{exam.subject}</p>
                            <div className="exam-meta">
                              <span className="duration">
                                <i className="fas fa-clock"></i>
                                {exam.duration} min
                              </span>
                              <span className="questions">
                                <i className="fas fa-question-circle"></i>
                                {exam.totalQuestions || 0} questions
                              </span>
                              {exam.maxScore && (
                                <span className="points">
                                  <i className="fas fa-star"></i>
                                  {exam.maxScore} pts
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="exam-actions">
                            <span className={`status-badge ${status}`}>
                              {status === 'upcoming' && 'Upcoming'}
                              {status === 'active' && 'Active'}
                              {status === 'past' && 'Completed'}
                            </span>
                            
                            {status === 'active' && user.role === 'student' && (
                              <Link to={`/exam/${exam._id}`} className="btn btn-primary btn-sm">
                                Take Exam
                              </Link>
                            )}
                            
                            {status === 'past' && user.role === 'student' && (
                              <Link to={`/exam/result/${exam._id}`} className="btn btn-outline btn-sm">
                                View Result
                              </Link>
                            )}
                            
                            {user.role === 'teacher' && (
                              <Link to={`/exam/${exam._id}/manage`} className="btn btn-outline btn-sm">
                                Manage
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Schedule;