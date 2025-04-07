import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { ref, onValue, update } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import './JobPosterDashboard.css';

const JobPosterApplications = () => {
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchApplications(currentUser.uid);
      } else {
        navigate('/job-poster-login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchApplications = (userId) => {
    const applicationsRef = ref(db, `applications`);
    setLoading(true);

    onValue(applicationsRef, (snapshot) => {
      const appsData = snapshot.val();
      const apps = appsData
        ? Object.entries(appsData)
            .map(([key, val]) => ({ ...val, applicationId: key }))
            .filter(app => app.jobPosterId === userId)
        : [];
      setApplications(apps);
      setLoading(false);
    }, (err) => {
      console.error('Error fetching applications:', err);
      setLoading(false);
    });
  };

  const updateApplicationStatus = async (applicationId, status) => {
    const confirm = window.confirm(`Are you sure you want to mark this application as "${status}"?`);
    if (!confirm) return;

    try {
      await update(ref(db, `applications/${applicationId}`), { status });
      alert(`Application ${status}`);
    } catch (error) {
      console.error(`❌ Error updating application: ${error.message}`);
      alert('Failed to update application.');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Welcome, {user?.displayName || 'Job Poster'}</h2>
        </div>
        <nav>
          <ul>
          <button onClick={() => navigate("/")} className="sidebar-link">Home</button> {/* ✅ Home link added */}
            <li onClick={() => navigate('/job-poster-dashboard')} className="nav-link">Dashboard</li>
            <li onClick={() => navigate('/post-job')} className="nav-link">Post a Job</li>
            <li onClick={() => navigate('/job-poster-profile')} className="nav-link">Profile</li>
            <li onClick={() => navigate('/job-poster-applications')} className="nav-link">Applications</li>
            <li onClick={() => signOut(auth).then(() => navigate('/job-poster-login'))} className="nav-link logout-btn">Log Out</li>
          </ul>
        </nav>
      </div>

      <div className="main-content">
        <h1>Your Job Applications</h1>

        {loading ? (
          <div className="loading-message">
            <div className="spinner"></div>
            Loading your applications...
          </div>
        ) : applications.length === 0 ? (
          <p>No applications received yet.</p>
        ) : (
          <div className="application-cards-container">
            {applications.map((application) => (
              <div key={application.applicationId} className="application-card">
                <div className="application-card-header">
                  <h3>{application.jobTitle}</h3>
                  <p><strong>Candidate:</strong> {application.jobSeekerName}</p>
                </div>
                <div className="application-card-body">
                  <p><strong>Location:</strong> {application.jobLocation}</p>
                  <p><strong>Salary:</strong> ${application.salary}</p>
                  <p><strong>Message:</strong> {application.coverLetter || 'No cover letter provided.'}</p>
                  <p><strong>Date:</strong> {new Date(application.appliedAt).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> {application.status || 'Pending'}</p>
                </div>
                <div className="application-card-actions">
                  <button className="accept-btn" onClick={() => updateApplicationStatus(application.applicationId, 'Accepted')}>Accept</button>
                  <button className="reject-btn" onClick={() => updateApplicationStatus(application.applicationId, 'Rejected')}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobPosterApplications;
