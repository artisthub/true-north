'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Submission {
  id: string;
  created_at: string;
  type?: 'pitch' | 'contact';
  email: string;
  name: string;
  // Pitch fields
  enterprise_name?: string;
  release_title?: string;
  track_name?: string;
  main_pitch?: string;
  // Contact fields
  artist_name?: string;
  message?: string;
}

interface Application {
  id: string;
  created_at: string;
  account_type: 'artist' | 'label';
  email: string;
  first_name: string;
  last_name: string;
  artist_name?: string;
  label_name?: string;
  status: 'pending' | 'approved' | 'denied' | 'payment_complete';
  reviewed_at?: string;
  review_notes?: string;
}

interface Stats {
  totalSubmissions: {
    pitch: number;
    contact: number;
    total: number;
  };
  recentSubmissions: {
    pitch: number;
    contact: number;
    total: number;
  };
  dailyStats: Array<{
    date: string;
    pitch: number;
    contact: number;
    total: number;
  }>;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'submissions' | 'applications'>('applications');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pitch' | 'contact'>('all');
  const [appFilter, setAppFilter] = useState<'all' | 'pending' | 'approved' | 'denied'>('pending');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  useEffect(() => {
    fetchStats();
    if (activeTab === 'submissions') {
      fetchSubmissions();
    } else {
      fetchApplications();
    }
  }, [filter, appFilter, activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/submissions?type=${filter}&limit=50`);
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/applications?status=${appFilter}&limit=50`);
      if (response.ok) {
        const data = await response.json();
        setApplications(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const viewSubmission = async (id: string, type: string) => {
    try {
      const response = await fetch(`/api/admin/submissions/${id}?type=${type}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedSubmission(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch submission:', error);
    }
  };

  const viewApplication = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/applications/${id}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedApplication(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch application:', error);
    }
  };

  const handleApplicationDecision = async (id: string, status: 'approved' | 'denied', notes?: string) => {
    try {
      const response = await fetch(`/api/admin/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, review_notes: notes })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (status === 'approved' && data.paymentUrl) {
          alert(`Application approved! Payment link: ${data.paymentUrl}`);
        } else {
          alert(`Application ${status}!`);
        }
        setSelectedApplication(null);
        fetchApplications();
      }
    } catch (error) {
      console.error('Failed to update application:', error);
      alert('Failed to update application');
    }
  };

  return (
    <div className="admin-wrapper">
      <div className="bg-gradient"></div>
      <div className="content-wrapper">
        <header>
          <div className="container">
            <div className="header-content">
              <Link href="/" className="logo">
                <div className="logo-icon">
                  <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                True North Admin
              </Link>
              <nav>
                <Link href="/" className="btn-secondary">
                  Back to Site
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="section">
          <div className="container">
            {/* Stats Overview */}
            {stats && (
              <div className="admin-stats">
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      </svg>
                    </div>
                    <div className="stat-content">
                      <div className="stat-number">{stats.totalSubmissions.total}</div>
                      <div className="stat-label">Total Submissions</div>
                      <div className="stat-desc">
                        {stats.totalSubmissions.pitch} pitches, {stats.totalSubmissions.contact} contacts
                      </div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                      </svg>
                    </div>
                    <div className="stat-content">
                      <div className="stat-number">{stats.recentSubmissions.total}</div>
                      <div className="stat-label">Last 7 Days</div>
                      <div className="stat-desc">
                        {stats.recentSubmissions.pitch} pitches, {stats.recentSubmissions.contact} contacts
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Navigation Tabs */}
            <div className="main-tabs">
              <button
                className={`main-tab ${activeTab === 'applications' ? 'active' : ''}`}
                onClick={() => setActiveTab('applications')}
              >
                Applications
              </button>
              <button
                className={`main-tab ${activeTab === 'submissions' ? 'active' : ''}`}
                onClick={() => setActiveTab('submissions')}
              >
                Submissions
              </button>
            </div>

            {/* Filters */}
            {activeTab === 'submissions' ? (
              <div className="admin-filters">
                <div className="filter-tabs">
                  <button 
                    className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                  >
                    All Submissions
                  </button>
                  <button 
                    className={`filter-tab ${filter === 'pitch' ? 'active' : ''}`}
                    onClick={() => setFilter('pitch')}
                  >
                    Pitch Submissions
                  </button>
                  <button 
                    className={`filter-tab ${filter === 'contact' ? 'active' : ''}`}
                    onClick={() => setFilter('contact')}
                  >
                    Contact Submissions
                  </button>
                </div>
              </div>
            ) : (
              <div className="admin-filters">
                <div className="filter-tabs">
                  <button
                    className={`filter-tab ${appFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setAppFilter('all')}
                  >
                    All Applications
                  </button>
                  <button
                    className={`filter-tab ${appFilter === 'pending' ? 'active' : ''}`}
                    onClick={() => setAppFilter('pending')}
                  >
                    Pending
                  </button>
                  <button
                    className={`filter-tab ${appFilter === 'approved' ? 'active' : ''}`}
                    onClick={() => setAppFilter('approved')}
                  >
                    Approved
                  </button>
                  <button
                    className={`filter-tab ${appFilter === 'denied' ? 'active' : ''}`}
                    onClick={() => setAppFilter('denied')}
                  >
                    Denied
                  </button>
                </div>
              </div>
            )}

            {/* Content based on active tab */}
            {activeTab === 'submissions' ? (
              <div className="submissions-container">
                <h2>Recent Submissions</h2>
                
                {loading ? (
                  <div className="loading">Loading submissions...</div>
                ) : submissions.length === 0 ? (
                  <div className="no-submissions">No submissions found.</div>
                ) : (
                  <div className="submissions-table">
                  <div className="table-header">
                    <div>Type</div>
                    <div>Date</div>
                    <div>Name</div>
                    <div>Email</div>
                    <div>Details</div>
                    <div>Action</div>
                  </div>
                  
                  {submissions.map((submission) => (
                    <div key={submission.id} className="table-row">
                      <div className="submission-type">
                        <span className={`type-badge ${submission.type || (submission.enterprise_name ? 'pitch' : 'contact')}`}>
                          {submission.type || (submission.enterprise_name ? 'pitch' : 'contact')}
                        </span>
                      </div>
                      <div className="submission-date">
                        {formatDate(submission.created_at)}
                      </div>
                      <div className="submission-name">
                        {submission.name}
                      </div>
                      <div className="submission-email">
                        {submission.email}
                      </div>
                      <div className="submission-details">
                        {submission.enterprise_name ? (
                          <>
                            <strong>{submission.enterprise_name}</strong>
                            {submission.release_title && (
                              <div className="detail-sub">&ldquo;{submission.release_title}&rdquo;</div>
                            )}
                          </>
                        ) : (
                          <>
                            <strong>{submission.artist_name}</strong>
                            {submission.message && (
                              <div className="detail-sub">{submission.message.substring(0, 100)}...</div>
                            )}
                          </>
                        )}
                      </div>
                      <div className="submission-action">
                        <button 
                          className="btn-view"
                          onClick={() => viewSubmission(
                            submission.id, 
                            submission.type || (submission.enterprise_name ? 'pitch' : 'contact')
                          )}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="applications-container">
                <h2>Applications</h2>
                
                {loading ? (
                  <div className="loading">Loading applications...</div>
                ) : applications.length === 0 ? (
                  <div className="no-applications">No applications found.</div>
                ) : (
                  <div className="applications-table">
                    <div className="table-header">
                      <div>Type</div>
                      <div>Date</div>
                      <div>Name</div>
                      <div>Email</div>
                      <div>Artist/Label</div>
                      <div>Status</div>
                      <div>Action</div>
                    </div>
                    
                    {applications.map((app) => (
                      <div key={app.id} className="table-row">
                        <div className="app-type">
                          <span className={`type-badge ${app.account_type}`}>
                            {app.account_type}
                          </span>
                        </div>
                        <div className="app-date">
                          {formatDate(app.created_at)}
                        </div>
                        <div className="app-name">
                          {app.first_name} {app.last_name}
                        </div>
                        <div className="app-email">
                          {app.email}
                        </div>
                        <div className="app-entity">
                          {app.account_type === 'artist' ? app.artist_name : app.label_name}
                        </div>
                        <div className="app-status">
                          <span className={`status-badge ${app.status}`}>
                            {app.status}
                          </span>
                        </div>
                        <div className="app-action">
                          <button 
                            className="btn-view"
                            onClick={() => viewApplication(app.id)}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Application Detail Modal */}
        {selectedApplication && (
          <div className="modal-overlay" onClick={() => setSelectedApplication(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Application Details</h3>
                <button className="modal-close" onClick={() => setSelectedApplication(null)}>
                  ×
                </button>
              </div>
              
              <div className="modal-body">
                <div className="application-detail">
                  <div className="detail-section">
                    <h4>Basic Information</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <strong>Type:</strong> {selectedApplication.account_type}
                      </div>
                      <div className="detail-item">
                        <strong>Status:</strong>
                        <span className={`status-badge ${selectedApplication.status}`}>
                          {selectedApplication.status}
                        </span>
                      </div>
                      <div className="detail-item">
                        <strong>Name:</strong> {selectedApplication.first_name} {selectedApplication.last_name}
                      </div>
                      <div className="detail-item">
                        <strong>Email:</strong> {selectedApplication.email}
                      </div>
                      <div className="detail-item">
                        <strong>Applied:</strong> {formatDate(selectedApplication.created_at)}
                      </div>
                      {selectedApplication.reviewed_at && (
                        <div className="detail-item">
                          <strong>Reviewed:</strong> {formatDate(selectedApplication.reviewed_at)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>{selectedApplication.account_type === 'artist' ? 'Artist' : 'Label'} Information</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <strong>{selectedApplication.account_type === 'artist' ? 'Artist Name' : 'Label Name'}:</strong>
                        {selectedApplication.account_type === 'artist' ? selectedApplication.artist_name : selectedApplication.label_name}
                      </div>
                    </div>
                  </div>

                  {selectedApplication.review_notes && (
                    <div className="detail-section">
                      <h4>Review Notes</h4>
                      <div className="detail-text">{selectedApplication.review_notes}</div>
                    </div>
                  )}

                  {selectedApplication.status === 'pending' && (
                    <div className="decision-section">
                      <h4>Make Decision</h4>
                      <div className="decision-buttons">
                        <button
                          className="btn-approve"
                          onClick={() => {
                            const notes = prompt('Add notes (optional):');
                            handleApplicationDecision(selectedApplication.id, 'approved', notes || undefined);
                          }}
                        >
                          Approve Application
                        </button>
                        <button
                          className="btn-deny"
                          onClick={() => {
                            const notes = prompt('Reason for denial (optional):');
                            handleApplicationDecision(selectedApplication.id, 'denied', notes || undefined);
                          }}
                        >
                          Deny Application
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submission Detail Modal */}
        {selectedSubmission && (
          <div className="modal-overlay" onClick={() => setSelectedSubmission(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Submission Details</h3>
                <button className="modal-close" onClick={() => setSelectedSubmission(null)}>
                  ×
                </button>
              </div>
              
              <div className="modal-body">
                <div className="submission-detail">
                  <div className="detail-row">
                    <strong>Type:</strong> {selectedSubmission.type || (selectedSubmission.enterprise_name ? 'pitch' : 'contact')}
                  </div>
                  <div className="detail-row">
                    <strong>Date:</strong> {formatDate(selectedSubmission.created_at)}
                  </div>
                  <div className="detail-row">
                    <strong>Name:</strong> {selectedSubmission.name}
                  </div>
                  <div className="detail-row">
                    <strong>Email:</strong> {selectedSubmission.email}
                  </div>
                  
                  {selectedSubmission.enterprise_name ? (
                    // Pitch submission details
                    <>
                      <div className="detail-row">
                        <strong>Enterprise:</strong> {selectedSubmission.enterprise_name}
                      </div>
                      <div className="detail-row">
                        <strong>Release Title:</strong> {selectedSubmission.release_title}
                      </div>
                      <div className="detail-row">
                        <strong>Track Name:</strong> {selectedSubmission.track_name}
                      </div>
                      <div className="detail-row">
                        <strong>Main Pitch:</strong>
                        <div className="detail-text">{selectedSubmission.main_pitch}</div>
                      </div>
                    </>
                  ) : (
                    // Contact submission details
                    <>
                      <div className="detail-row">
                        <strong>Artist/Label:</strong> {selectedSubmission.artist_name}
                      </div>
                      <div className="detail-row">
                        <strong>Message:</strong>
                        <div className="detail-text">{selectedSubmission.message}</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .admin-wrapper {
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        .admin-wrapper .bg-gradient {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        .admin-wrapper .content-wrapper {
          position: relative;
          z-index: 1;
          min-height: 100vh;
        }

        .admin-stats {
          margin-bottom: 60px;
        }

        .admin-filters {
          margin-bottom: 40px;
        }

        .filter-tabs {
          display: flex;
          gap: 20px;
          border-bottom: 1px solid rgba(255, 20, 147, 0.2);
        }

        .filter-tab {
          padding: 12px 24px;
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          font-weight: 500;
          border-bottom: 2px solid transparent;
          transition: all 0.3s ease;
        }

        .filter-tab:hover {
          color: #FF69B4;
        }

        .filter-tab.active {
          color: #FF1493;
          border-bottom-color: #FF1493;
        }

        .main-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          padding: 6px;
        }

        .main-tab {
          flex: 1;
          padding: 12px 24px;
          background: transparent;
          border: none;
          color: #999;
          cursor: pointer;
          font-weight: 600;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .main-tab:hover {
          color: #FF69B4;
        }

        .main-tab.active {
          background: rgba(255, 20, 147, 0.2);
          color: #FF1493;
        }

        .applications-container {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 20, 147, 0.2);
          border-radius: 24px;
          padding: 40px;
          margin-top: 40px;
        }

        .applications-container h2 {
          margin-bottom: 30px;
          font-size: 28px;
          background: linear-gradient(135deg, #FF1493, #FF69B4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .applications-table {
          display: grid;
          grid-template-columns: 80px 140px 180px 220px 200px 100px 100px;
          gap: 20px;
        }

        .type-badge.artist {
          background: rgba(100, 255, 200, 0.2);
          color: #64FFC8;
        }

        .type-badge.label {
          background: rgba(255, 200, 100, 0.2);
          color: #FFC864;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-badge.pending {
          background: rgba(255, 200, 100, 0.2);
          color: #FFC864;
        }

        .status-badge.approved {
          background: rgba(100, 255, 100, 0.2);
          color: #64FF64;
        }

        .status-badge.denied {
          background: rgba(255, 100, 100, 0.2);
          color: #FF6464;
        }

        .status-badge.payment_complete {
          background: rgba(100, 200, 255, 0.2);
          color: #64C8FF;
        }

        .application-detail {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .detail-section h4 {
          color: #FF69B4;
          margin-bottom: 20px;
          font-size: 18px;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .detail-item strong {
          color: #999;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .decision-section {
          border-top: 1px solid rgba(255, 20, 147, 0.2);
          padding-top: 30px;
        }

        .decision-buttons {
          display: flex;
          gap: 20px;
        }

        .btn-approve, .btn-deny {
          flex: 1;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-approve {
          background: linear-gradient(135deg, #4CAF50, #45a049);
          color: white;
        }

        .btn-approve:hover {
          transform: translateY(-2px);
        }

        .btn-deny {
          background: linear-gradient(135deg, #f44336, #da190b);
          color: white;
        }

        .btn-deny:hover {
          transform: translateY(-2px);
        }

        .submissions-container {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 20, 147, 0.2);
          border-radius: 24px;
          padding: 40px;
          margin-top: 40px;
        }

        .submissions-container h2 {
          margin-bottom: 30px;
          font-size: 28px;
          background: linear-gradient(135deg, #FF1493, #FF69B4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .submissions-table {
          display: grid;
          grid-template-columns: 80px 140px 200px 250px 1fr 80px;
          gap: 20px;
        }

        .table-header {
          display: contents;
          font-weight: 600;
          color: #FF69B4;
        }

        .table-header > div {
          padding: 15px 0;
          border-bottom: 2px solid rgba(255, 20, 147, 0.3);
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .table-row {
          display: contents;
        }

        .table-row > div {
          padding: 20px 0;
          border-bottom: 1px solid rgba(255, 20, 147, 0.1);
          display: flex;
          align-items: center;
        }

        .type-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .type-badge.pitch {
          background: rgba(255, 20, 147, 0.2);
          color: #FF69B4;
        }

        .type-badge.contact {
          background: rgba(100, 200, 255, 0.2);
          color: #64C8FF;
        }

        .submission-details {
          flex-direction: column;
          align-items: flex-start;
        }

        .detail-sub {
          color: #999;
          font-size: 14px;
          margin-top: 4px;
        }

        .btn-view {
          background: rgba(255, 20, 147, 0.1);
          border: 1px solid rgba(255, 20, 147, 0.3);
          color: #FF69B4;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-view:hover {
          background: rgba(255, 20, 147, 0.2);
          border-color: #FF1493;
          color: #FF1493;
        }

        .loading, .no-submissions {
          text-align: center;
          padding: 60px;
          color: #999;
          font-size: 18px;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: #000;
          border: 1px solid rgba(255, 20, 147, 0.3);
          border-radius: 24px;
          max-width: 800px;
          width: 90%;
          max-height: 90%;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 30px 40px;
          border-bottom: 1px solid rgba(255, 20, 147, 0.2);
        }

        .modal-header h3 {
          font-size: 24px;
          margin: 0;
        }

        .modal-close {
          background: none;
          border: none;
          color: #999;
          font-size: 32px;
          cursor: pointer;
          line-height: 1;
        }

        .modal-close:hover {
          color: #FF1493;
        }

        .modal-body {
          padding: 40px;
        }

        .submission-detail {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .detail-row {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .detail-row strong {
          color: #FF69B4;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-text {
          background: rgba(255, 20, 147, 0.1);
          padding: 16px;
          border-radius: 12px;
          border: 1px solid rgba(255, 20, 147, 0.2);
          line-height: 1.6;
        }

        @media (max-width: 968px) {
          .applications-table,
          .submissions-table {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .table-header {
            display: none;
          }

          .table-row {
            display: flex;
            flex-direction: column;
            background: rgba(255, 20, 147, 0.05);
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 20px;
          }

          .table-row > div {
            border-bottom: none;
            padding: 8px 0;
          }

          .modal-content {
            margin: 20px;
            width: calc(100% - 40px);
          }

          .modal-header, .modal-body {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}