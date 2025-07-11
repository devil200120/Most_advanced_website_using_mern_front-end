import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';
import './Students.css';

const Students = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    grade: 'all',
    status: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterAndSortStudents();
  }, [students, searchTerm, filters]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/students/list');
      
      if (response.data.success) {
        setStudents(response.data.data.students || []);
      } else {
        throw new Error(response.data.message || 'Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortStudents = () => {
    let filtered = [...students];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(student =>
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.studentId && student.studentId.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply grade filter
    if (filters.grade !== 'all') {
      filtered = filtered.filter(student => student.grade === filters.grade);
    }

    // Apply status filter
    if (filters.status !== 'all') {
      if (filters.status === 'active') {
        filtered = filtered.filter(student => student.isActive);
      } else if (filters.status === 'inactive') {
        filtered = filtered.filter(student => !student.isActive);
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (filters.sortBy) {
        case 'name':
          aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
          bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'grade':
          aValue = a.grade || '';
          bValue = b.grade || '';
          break;
        case 'date':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          aValue = a.firstName.toLowerCase();
          bValue = b.firstName.toLowerCase();
      }

      if (filters.sortOrder === 'desc') {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      } else {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
    });

    setFilteredStudents(filtered);
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="students-container">
      <div className="students-header">
        <h1>Students Management</h1>
        <p>Manage and monitor student accounts</p>
      </div>

      <div className="students-controls">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <select
            value={filters.grade}
            onChange={(e) => handleFilterChange('grade', e.target.value)}
          >
            <option value="all">All Grades</option>
            <option value="1">Grade 1</option>
            <option value="2">Grade 2</option>
            <option value="3">Grade 3</option>
            <option value="4">Grade 4</option>
            <option value="5">Grade 5</option>
            <option value="6">Grade 6</option>
            <option value="7">Grade 7</option>
            <option value="8">Grade 8</option>
            <option value="9">Grade 9</option>
            <option value="10">Grade 10</option>
            <option value="11">Grade 11</option>
            <option value="12">Grade 12</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="email">Sort by Email</option>
            <option value="grade">Sort by Grade</option>
            <option value="date">Sort by Date</option>
          </select>

          <button
            className="sort-order-btn"
            onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            <i className={`fas fa-sort-${filters.sortOrder === 'asc' ? 'up' : 'down'}`}></i>
          </button>
        </div>
      </div>

      <div className="students-stats">
        <div className="stat-card">
          <i className="fas fa-users"></i>
          <div>
            <h3>{students.length}</h3>
            <p>Total Students</p>
          </div>
        </div>
        <div className="stat-card">
          <i className="fas fa-user-check"></i>
          <div>
            <h3>{students.filter(s => s.isActive).length}</h3>
            <p>Active Students</p>
          </div>
        </div>
        <div className="stat-card">
          <i className="fas fa-graduation-cap"></i>
          <div>
            <h3>{new Set(students.map(s => s.grade)).size}</h3>
            <p>Different Grades</p>
          </div>
        </div>
        <div className="stat-card">
          <i className="fas fa-filter"></i>
          <div>
            <h3>{filteredStudents.length}</h3>
            <p>Filtered Results</p>
          </div>
        </div>
      </div>

      <div className="students-list">
        {filteredStudents.length === 0 ? (
          <div className="no-students">
            <i className="fas fa-user-slash"></i>
            <h3>No students found</h3>
            <p>Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="students-grid">
            {filteredStudents.map((student) => (
              <div key={student._id} className="student-card">
                <div className="student-avatar">
                  {student.avatar ? (
                    <img src={student.avatar} alt={`${student.firstName} ${student.lastName}`} />
                  ) : (
                    <div className="avatar-placeholder">
                      {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                    </div>
                  )}
                  <div className={`status-indicator ${student.isActive ? 'active' : 'inactive'}`}></div>
                </div>

                <div className="student-info">
                  <h3>{student.firstName} {student.lastName}</h3>
                  <p className="email">{student.email}</p>
                  {student.studentId && <p className="student-id">ID: {student.studentId}</p>}
                  {student.grade && <p className="grade">Grade: {student.grade}</p>}
                  {student.section && <p className="section">Section: {student.section}</p>}
                </div>

                <div className="student-meta">
                  <span className={`status-badge ${student.isActive ? 'active' : 'inactive'}`}>
                    {student.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="join-date">
                    Joined: {new Date(student.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="student-actions">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleViewStudent(student)}
                  >
                    <i className="fas fa-eye"></i>
                    View Details
                  </button>
                  <Link
                    to={`/reports/student/${student._id}/progress`}
                    className="btn btn-secondary btn-sm"
                  >
                    <i className="fas fa-chart-line"></i>
                    Progress
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Student Details Modal */}
      {showModal && selectedStudent && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Student Details</h2>
              <button className="close-btn" onClick={handleCloseModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="student-details">
                <div className="detail-row">
                  <label>Name:</label>
                  <span>{selectedStudent.firstName} {selectedStudent.lastName}</span>
                </div>
                <div className="detail-row">
                  <label>Email:</label>
                  <span>{selectedStudent.email}</span>
                </div>
                {selectedStudent.studentId && (
                  <div className="detail-row">
                    <label>Student ID:</label>
                    <span>{selectedStudent.studentId}</span>
                  </div>
                )}
                {selectedStudent.grade && (
                  <div className="detail-row">
                    <label>Grade:</label>
                    <span>{selectedStudent.grade}</span>
                  </div>
                )}
                {selectedStudent.section && (
                  <div className="detail-row">
                    <label>Section:</label>
                    <span>{selectedStudent.section}</span>
                  </div>
                )}
                {selectedStudent.phone && (
                  <div className="detail-row">
                    <label>Phone:</label>
                    <span>{selectedStudent.phone}</span>
                  </div>
                )}
                <div className="detail-row">
                  <label>Status:</label>
                  <span className={`status-badge ${selectedStudent.isActive ? 'active' : 'inactive'}`}>
                    {selectedStudent.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="detail-row">
                  <label>Joined:</label>
                  <span>{new Date(selectedStudent.createdAt).toLocaleDateString()}</span>
                </div>
                {selectedStudent.lastLogin && (
                  <div className="detail-row">
                    <label>Last Login:</label>
                    <span>{new Date(selectedStudent.lastLogin).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="modal-footer">
              <Link
                to={`/reports/student/${selectedStudent._id}/progress`}
                className="btn btn-primary"
                onClick={handleCloseModal}
              >
                View Progress Report
              </Link>
              <button className="btn btn-secondary" onClick={handleCloseModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;