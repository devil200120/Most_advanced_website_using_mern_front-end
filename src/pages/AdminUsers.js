import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';
import './AdminUsers.css';

const AdminUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    role: '',
    search: '',
    sort: 'createdAt'
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [createUserData, setCreateUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'student',
    phone: '',
    dateOfBirth: ''
  });
  const [editUserData, setEditUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    phone: '',
    dateOfBirth: ''
  });
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching users with filters:', filters);
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        sort: filters.sort
      });
      
      if (filters.role) params.append('role', filters.role);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get(`/users?${params.toString()}`);
      console.log('✅ Users response:', response.data);
      
      if (response.data.success) {
        setUsers(response.data.data.users);
        setTotalPages(response.data.data.totalPages);
      }
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!createUserData.firstName.trim() || !createUserData.lastName.trim() || 
        !createUserData.email.trim() || !createUserData.password.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (createUserData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      setModalLoading(true);
      console.log('📝 Creating new user:', createUserData);

      const response = await api.post('/auth/register', {
        firstName: createUserData.firstName.trim(),
        lastName: createUserData.lastName.trim(),
        email: createUserData.email.trim(),
        password: createUserData.password,
        role: createUserData.role,
        phone: createUserData.phone.trim() || undefined,
        dateOfBirth: createUserData.dateOfBirth || undefined
      });

      if (response.data.success) {
        toast.success('User created successfully!');
        setShowCreateModal(false);
        setCreateUserData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          role: 'student',
          phone: '',
          dateOfBirth: ''
        });
        fetchUsers(); // Refresh the users list
      }
    } catch (error) {
      console.error('❌ Error creating user:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create user';
      toast.error(errorMessage);
    } finally {
      setModalLoading(false);
    }
  };

  const handleEditUser = (userToEdit) => {
    setSelectedUser(userToEdit);
    setEditUserData({
      firstName: userToEdit.firstName || '',
      lastName: userToEdit.lastName || '',
      email: userToEdit.email || '',
      role: userToEdit.role || '',
      phone: userToEdit.phone || '',
      dateOfBirth: userToEdit.dateOfBirth ? userToEdit.dateOfBirth.split('T')[0] : ''
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    
    if (!editUserData.firstName.trim() || !editUserData.lastName.trim() || 
        !editUserData.email.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setModalLoading(true);
      console.log('📝 Updating user:', selectedUser._id, editUserData);

      const response = await api.put(`/users/${selectedUser._id}`, {
        firstName: editUserData.firstName.trim(),
        lastName: editUserData.lastName.trim(),
        email: editUserData.email.trim(),
        role: editUserData.role,
        phone: editUserData.phone.trim() || undefined,
        dateOfBirth: editUserData.dateOfBirth || undefined
      });

      if (response.data.success) {
        toast.success('User updated successfully!');
        setShowEditModal(false);
        setSelectedUser(null);
        setEditUserData({
          firstName: '',
          lastName: '',
          email: '',
          role: '',
          phone: '',
          dateOfBirth: ''
        });
        fetchUsers(); // Refresh the users list
      }
    } catch (error) {
      console.error('❌ Error updating user:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update user';
      toast.error(errorMessage);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await api.delete(`/users/${userId}`);
      if (response.data.success) {
        toast.success('User deleted successfully');
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setCreateUserData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'student',
      phone: '',
      dateOfBirth: ''
    });
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedUser(null);
    setEditUserData({
      firstName: '',
      lastName: '',
      email: '',
      role: '',
      phone: '',
      dateOfBirth: ''
    });
  };

  const getRoleBadgeClass = (role) => {
    const roleClasses = {
      admin: 'badge-danger',
      teacher: 'badge-primary',
      student: 'badge-success',
      parent: 'badge-info'
    };
    return roleClasses[role] || 'badge-secondary';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return null;
    
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
      return avatarPath;
    }
    
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const fileBaseUrl = baseUrl.replace('/api', '');
    
    if (avatarPath.startsWith('uploads/')) {
      return `${fileBaseUrl}/${avatarPath}`;
    } else if (avatarPath.startsWith('/uploads/')) {
      return `${fileBaseUrl}${avatarPath}`;
    } else {
      return `${fileBaseUrl}/uploads/avatars/${avatarPath}`;
    }
  };

  if (loading && users.length === 0) {
    return <Loading />;
  }

  return (
    <div className="admin-users">
      <div className="container">
        <div className="page-header">
          <div className="header-content">
            <h1>User Management</h1>
            <p>Manage all users in the system</p>
          </div>
          <div className="header-actions">
            <button 
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              Add New User
            </button>
            <Link to="/admin/dashboard" className="btn btn-secondary">
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-row">
            <div className="filter-group">
              <label htmlFor="search">Search Users:</label>
              <input
                type="text"
                id="search"
                placeholder="Search by name or email..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label htmlFor="role">Filter by Role:</label>
              <select
                id="role"
                value={filters.role}
                onChange={(e) => handleFilterChange('role', e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
                <option value="parent">Parent</option>
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="sort">Sort by:</label>
              <select
                id="sort"
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
              >
                <option value="createdAt">Date Created</option>
                <option value="firstName">First Name</option>
                <option value="lastName">Last Name</option>
                <option value="email">Email</option>
                <option value="role">Role</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="users-table-container">
          {loading ? (
            <div className="loading-overlay">
              <Loading />
            </div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((userItem) => (
                    <tr key={userItem._id}>
                      <td>
                        <div className="user-info">
                          <div className="user-avatar">
                            {getAvatarUrl(userItem.avatar) ? (
                              <img 
                                src={getAvatarUrl(userItem.avatar)} 
                                alt={`${userItem.firstName} ${userItem.lastName}`}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div 
                              className="avatar-placeholder"
                              style={{ display: getAvatarUrl(userItem.avatar) ? 'none' : 'flex' }}
                            >
                              {userItem.firstName?.[0]}{userItem.lastName?.[0]}
                            </div>
                          </div>
                          <div className="user-details">
                            <span className="user-name">
                              {userItem.firstName} {userItem.lastName}
                            </span>
                            <span className="user-id">ID: {userItem._id.slice(-6)}</span>
                          </div>
                        </div>
                      </td>
                      <td>{userItem.email}</td>
                      <td>
                        <span className={`badge ${getRoleBadgeClass(userItem.role)}`}>
                          {userItem.role}
                        </span>
                      </td>
                      <td>{formatDate(userItem.createdAt)}</td>
                      <td>
                        <span className={`status ${userItem.isActive !== false ? 'active' : 'inactive'}`}>
                          {userItem.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEditUser(userItem)}
                            title="Edit User"
                          >
                            Edit
                          </button>
                          {userItem._id !== user._id && (
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteUser(userItem._id)}
                              title="Delete User"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No users found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="btn btn-sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              className="btn btn-sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}

        {/* Statistics */}
        <div className="users-stats">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-number">{users.length}</p>
          </div>
          <div className="stat-card">
            <h3>Active Users</h3>
            <p className="stat-number">
              {users.filter(u => u.isActive !== false).length}
            </p>
          </div>
          <div className="stat-card">
            <h3>Teachers</h3>
            <p className="stat-number">
              {users.filter(u => u.role === 'teacher').length}
            </p>
          </div>
          <div className="stat-card">
            <h3>Students</h3>
            <p className="stat-number">
              {users.filter(u => u.role === 'student').length}
            </p>
          </div>
        </div>

        {/* Create User Modal */}
        {showCreateModal && (
          <div className="modal-overlay" onClick={closeCreateModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Add New User</h3>
                <button 
                  className="modal-close"
                  onClick={closeCreateModal}
                  type="button"
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleCreateUser}>
                <div className="modal-body">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="createFirstName">First Name *</label>
                      <input
                        type="text"
                        id="createFirstName"
                        value={createUserData.firstName}
                        onChange={(e) => setCreateUserData(prev => ({
                          ...prev,
                          firstName: e.target.value
                        }))}
                        required
                        disabled={modalLoading}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="createLastName">Last Name *</label>
                      <input
                        type="text"
                        id="createLastName"
                        value={createUserData.lastName}
                        onChange={(e) => setCreateUserData(prev => ({
                          ...prev,
                          lastName: e.target.value
                        }))}
                        required
                        disabled={modalLoading}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="createEmail">Email *</label>
                    <input
                      type="email"
                      id="createEmail"
                      value={createUserData.email}
                      onChange={(e) => setCreateUserData(prev => ({
                        ...prev,
                        email: e.target.value
                      }))}
                      required
                      disabled={modalLoading}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="createPassword">Password *</label>
                    <input
                      type="password"
                      id="createPassword"
                      value={createUserData.password}
                      onChange={(e) => setCreateUserData(prev => ({
                        ...prev,
                        password: e.target.value
                      }))}
                      required
                      minLength="6"
                      disabled={modalLoading}
                      placeholder="Minimum 6 characters"
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="createRole">Role *</label>
                      <select
                        id="createRole"
                        value={createUserData.role}
                        onChange={(e) => setCreateUserData(prev => ({
                          ...prev,
                          role: e.target.value
                        }))}
                        required
                        disabled={modalLoading}
                      >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="parent">Parent</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="createPhone">Phone</label>
                      <input
                        type="tel"
                        id="createPhone"
                        value={createUserData.phone}
                        onChange={(e) => setCreateUserData(prev => ({
                          ...prev,
                          phone: e.target.value
                        }))}
                        disabled={modalLoading}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="createDateOfBirth">Date of Birth</label>
                    <input
                      type="date"
                      id="createDateOfBirth"
                      value={createUserData.dateOfBirth}
                      onChange={(e) => setCreateUserData(prev => ({
                        ...prev,
                        dateOfBirth: e.target.value
                      }))}
                      disabled={modalLoading}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={closeCreateModal}
                    disabled={modalLoading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={modalLoading}
                  >
                    {modalLoading ? 'Creating...' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {showEditModal && selectedUser && (
          <div className="modal-overlay" onClick={closeEditModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Edit User</h3>
                <button 
                  className="modal-close"
                  onClick={closeEditModal}
                  type="button"
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleUpdateUser}>
                <div className="modal-body">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="editFirstName">First Name *</label>
                      <input
                        type="text"
                        id="editFirstName"
                        value={editUserData.firstName}
                        onChange={(e) => setEditUserData(prev => ({
                          ...prev,
                          firstName: e.target.value
                        }))}
                        required
                        disabled={modalLoading}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="editLastName">Last Name *</label>
                      <input
                        type="text"
                        id="editLastName"
                        value={editUserData.lastName}
                        onChange={(e) => setEditUserData(prev => ({
                          ...prev,
                          lastName: e.target.value
                        }))}
                        required
                        disabled={modalLoading}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="editEmail">Email *</label>
                    <input
                      type="email"
                      id="editEmail"
                      value={editUserData.email}
                      onChange={(e) => setEditUserData(prev => ({
                        ...prev,
                        email: e.target.value
                      }))}
                      required
                      disabled={modalLoading}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="editRole">Role *</label>
                      <select
                        id="editRole"
                        value={editUserData.role}
                        onChange={(e) => setEditUserData(prev => ({
                          ...prev,
                          role: e.target.value
                        }))}
                        required
                        disabled={modalLoading}
                      >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="parent">Parent</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="editPhone">Phone</label>
                      <input
                        type="tel"
                        id="editPhone"
                        value={editUserData.phone}
                        onChange={(e) => setEditUserData(prev => ({
                          ...prev,
                          phone: e.target.value
                        }))}
                        disabled={modalLoading}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="editDateOfBirth">Date of Birth</label>
                    <input
                      type="date"
                      id="editDateOfBirth"
                      value={editUserData.dateOfBirth}
                      onChange={(e) => setEditUserData(prev => ({
                        ...prev,
                        dateOfBirth: e.target.value
                      }))}
                      disabled={modalLoading}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={closeEditModal}
                    disabled={modalLoading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={modalLoading}
                  >
                    {modalLoading ? 'Updating...' : 'Update User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
