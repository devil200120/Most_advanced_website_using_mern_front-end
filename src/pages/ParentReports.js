import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';
import './ParentReports.css';

const ParentReports = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('all');
  const [reportType, setReportType] = useState('performance');

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      fetchReportData();
    }
  }, [selectedChild, timeRange, reportType]);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching children for reports...');
      
      const response = await api.get('/parent/dashboard');
      const data = response.data?.data || response.data;
      const childrenList = data.children || [];
      
      setChildren(childrenList);
      if (childrenList.length > 0 && !selectedChild) {
        setSelectedChild(childrenList[0]);
      }
    } catch (error) {
      console.error('❌ Error fetching children:', error);
      toast.error('Failed to load children data');
    } finally {
      setLoading(false);
    }
  };

  const fetchReportData = async () => {
    if (!selectedChild) return;

    try {
      setReportLoading(true);
      console.log(`🔍 Fetching ${reportType} report for child:`, selectedChild._id);
      
      let endpoint = '';
      switch (reportType) {
        case 'performance':
          endpoint = `/parent/child/${selectedChild._id}/progress`;
          break;
        case 'exams':
          endpoint = `/parent/child/${selectedChild._id}/exams`;
          break;
        case 'results':
          endpoint = `/parent/child/${selectedChild._id}/results`;
          break;
        default:
          endpoint = `/parent/child/${selectedChild._id}/progress`;
      }

      const response = await api.get(endpoint);
      setReportData(response.data?.data || response.data);
      console.log('✅ Report data:', response.data);
    } catch (error) {
      console.error('❌ Error fetching report data:', error);
      if (error.response?.status === 404) {
        // If specific endpoint doesn't exist, create mock data
        setReportData({
          child: selectedChild,
          exams: [],
          performance: {
            totalExams: 0,
            averageScore: 0,
            bestScore: 0,
            recentScore: 0
          },
          chartData: [],
          subjectPerformance: []
        });
      } else {
        toast.error('Failed to load report data');
      }
    } finally {
      setReportLoading(false);
    }
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 90) return '#28a745';
    if (percentage >= 80) return '#17a2b8';
    if (percentage >= 70) return '#ffc107';
    if (percentage >= 60) return '#fd7e14';
    return '#dc3545';
  };

  const getGradeFromPercentage = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    return 'F';
  };

  const exportReport = () => {
    if (!reportData || !selectedChild) {
      toast.error('No data to export');
      return;
    }

    const reportContent = `
Academic Report - ${selectedChild.firstName} ${selectedChild.lastName}
Generated on: ${new Date().toLocaleDateString()}
Time Range: ${timeRange === 'all' ? 'All Time' : timeRange}

Performance Summary:
- Total Exams: ${selectedChild.stats?.totalExams || 0}
- Average Score: ${selectedChild.stats?.averageScore || 0}%
- Best Score: ${selectedChild.stats?.bestScore || 0}%
- Grade: ${getGradeFromPercentage(selectedChild.stats?.averageScore || 0)}

Recent Activity:
${reportData.exams?.slice(0, 5).map(exam => 
  `- ${exam.title}: ${exam.score || 'N/A'}% (${new Date(exam.date).toLocaleDateString()})`
).join('\n') || 'No recent exams'}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedChild.firstName}_${selectedChild.lastName}_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Report exported successfully');
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="parent-reports">
      <div className="container">
        <div className="page-header">
          <div className="header-content">
            <h1>Academic Reports</h1>
            <p>Detailed analysis of your children's academic performance</p>
          </div>
          <div className="header-actions">
            <button 
              className="btn btn-outline-primary"
              onClick={exportReport}
              disabled={!selectedChild || reportLoading}
            >
              Export Report
            </button>
            <Link to="/parent/dashboard" className="btn btn-secondary">
              Back to Dashboard
            </Link>
          </div>
        </div>

        {children.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>No Children Available</h3>
            <p>Add children to your account to view their academic reports</p>
            <Link to="/parent/children" className="btn btn-primary">
              Add Children
            </Link>
          </div>
        ) : (
          <div className="reports-container">
            {/* Child Selector */}
            <div className="child-selector">
              <label htmlFor="childSelect">Select Child:</label>
              <select
                id="childSelect"
                value={selectedChild?._id || ''}
                onChange={(e) => {
                  const child = children.find(c => c._id === e.target.value);
                  setSelectedChild(child);
                }}
              >
                {children.map(child => (
                  <option key={child._id} value={child._id}>
                    {child.firstName} {child.lastName}
                  </option>
                ))}
              </select>
            </div>

            {/* Report Filters */}
            <div className="report-filters">
              <div className="filter-group">
                <label htmlFor="reportType">Report Type:</label>
                <select
                  id="reportType"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <option value="performance">Performance Overview</option>
                  <option value="exams">Exam History</option>
                  <option value="results">Detailed Results</option>
                </select>
              </div>
              <div className="filter-group">
                <label htmlFor="timeRange">Time Range:</label>
                <select
                  id="timeRange"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="this-month">This Month</option>
                  <option value="last-3-months">Last 3 Months</option>
                  <option value="this-year">This Year</option>
                </select>
              </div>
            </div>

            {selectedChild && (
              <div className="report-content">
                {reportLoading ? (
                  <Loading />
                ) : (
                  <>
                    {/* Performance Summary */}
                    <div className="performance-summary">
                      <h3>{selectedChild.firstName}'s Performance Summary</h3>
                      <div className="summary-cards">
                        <div className="summary-card">
                          <div className="card-icon">📚</div>
                          <div className="card-content">
                            <h4>Total Exams</h4>
                            <p className="card-value">{selectedChild.stats?.totalExams || 0}</p>
                          </div>
                        </div>
                        <div className="summary-card">
                          <div className="card-icon">📊</div>
                          <div className="card-content">
                            <h4>Average Score</h4>
                            <p 
                              className="card-value"
                              style={{ color: getPerformanceColor(selectedChild.stats?.averageScore || 0) }}
                            >
                              {selectedChild.stats?.averageScore || 0}%
                            </p>
                          </div>
                        </div>
                        <div className="summary-card">
                          <div className="card-icon">🏆</div>
                          <div className="card-content">
                            <h4>Best Score</h4>
                            <p 
                              className="card-value"
                              style={{ color: getPerformanceColor(selectedChild.stats?.bestScore || 0) }}
                            >
                              {selectedChild.stats?.bestScore || 0}%
                            </p>
                          </div>
                        </div>
                        <div className="summary-card">
                          <div className="card-icon">🎯</div>
                          <div className="card-content">
                            <h4>Current Grade</h4>
                            <p className="card-value">
                              {getGradeFromPercentage(selectedChild.stats?.averageScore || 0)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Performance Chart Placeholder */}
                    <div className="performance-chart">
                      <h3>Performance Trend</h3>
                      <div className="chart-placeholder">
                        <p>📈 Performance chart would be displayed here</p>
                        <small>Chart showing performance over time</small>
                      </div>
                    </div>

                    {/* Recent Exams */}
                    <div className="recent-exams">
                      <h3>Recent Exam Results</h3>
                      {reportData?.exams?.length > 0 ? (
                        <div className="exams-table">
                          <table>
                            <thead>
                              <tr>
                                <th>Exam Name</th>
                                <th>Subject</th>
                                <th>Date</th>
                                <th>Score</th>
                                <th>Grade</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {reportData.exams.slice(0, 10).map((exam, index) => (
                                <tr key={exam._id || index}>
                                  <td>{exam.title || 'Exam ' + (index + 1)}</td>
                                  <td>{exam.subject || 'General'}</td>
                                  <td>{exam.date ? new Date(exam.date).toLocaleDateString() : 'N/A'}</td>
                                  <td 
                                    style={{ color: getPerformanceColor(exam.score || 0) }}
                                  >
                                    {exam.score || 0}%
                                  </td>
                                  <td>{getGradeFromPercentage(exam.score || 0)}</td>
                                  <td>
                                    <Link 
                                      to={`/exam/${exam._id}/result`}
                                      className="btn btn-sm btn-outline-primary"
                                    >
                                      View Details
                                    </Link>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="no-exams">
                          <p>No exam results available for the selected time range.</p>
                        </div>
                      )}
                    </div>

                    {/* Recommendations */}
                    <div className="recommendations">
                      <h3>Recommendations</h3>
                      <div className="recommendation-list">
                        {selectedChild.stats?.averageScore >= 90 && (
                          <div className="recommendation excellent">
                            <span className="recommendation-icon">🌟</span>
                            <p>Excellent performance! Keep up the great work.</p>
                          </div>
                        )}
                        {selectedChild.stats?.averageScore >= 70 && selectedChild.stats?.averageScore < 90 && (
                          <div className="recommendation good">
                            <span className="recommendation-icon">👍</span>
                            <p>Good progress! Focus on consistent study habits to reach excellence.</p>
                          </div>
                        )}
                        {selectedChild.stats?.averageScore >= 50 && selectedChild.stats?.averageScore < 70 && (
                          <div className="recommendation average">
                            <span className="recommendation-icon">📚</span>
                            <p>Consider additional practice and study time to improve performance.</p>
                          </div>
                        )}
                        {selectedChild.stats?.averageScore < 50 && (
                          <div className="recommendation needs-improvement">
                            <span className="recommendation-icon">💪</span>
                            <p>Extra support and practice sessions recommended. Consider tutoring assistance.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentReports;
