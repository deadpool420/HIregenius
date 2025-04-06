import React, { useState, useEffect } from 'react';
import { db } from './firebase';  // Import the Firebase instance
import { ref, onValue } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { FaClipboardList } from 'react-icons/fa';  // Icon for the sidebar
import './JobPosterDashboard.css';  // Reuse the same CSS
import './JobPosterProfile.js';

const JobPosterApplications = () => {
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchApplications(currentUser.uid); // Fetch applications for this user
      } else {
        navigate('/job-poster-login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Fetch job applications for the logged-in job poster
  const fetchApplications = (userId) => {
    const applicationsRef = ref(db, `applications`);

    setLoading(true);

    onValue(applicationsRef, (snapshot) => {
      const appsData = snapshot.val();
      const apps = appsData ? Object.values(appsData).filter(app => app.jobPosterId === userId) : [];
      setApplications(apps);
      setLoading(false);
    }, (err) => {
      console.error('Error fetching applications:', err);
      setLoading(false);
    });
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Welcome, {user?.displayName || 'Job Poster'}</h2>
        </div>
        <nav>
          <ul>
            <li onClick={() => navigate('/job-poster-dashboard')} className="nav-link">
              <FaClipboardList className="sidebar-icon" /> Dashboard
            </li>
            <li onClick={() => navigate('/post-job')} className="nav-link">
              <FaClipboardList className="sidebar-icon" /> Post a Job
            </li>
            <li onClick={() => navigate('/job-poster-profile')} className="nav-link">
              <FaClipboardList className="sidebar-icon" /> Profile
            </li>
            <li onClick={() => navigate('/job-poster-applications')} className="nav-link">
              <FaClipboardList className="sidebar-icon" /> Applications
            </li>
            <li onClick={() => signOut(auth).then(() => navigate('/job-poster-login'))} className="nav-link logout-btn">
              <FaSignOutAlt className="sidebar-icon" /> Log Out
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>Your Job Applications</h1>

        {loading ? (
          <div className="loading-message">
            <div className="spinner"></div> {/* Spinner animation */}
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
                  <p>Applied by: {application.jobSeekerName}</p>
                </div>
                <div className="application-card-body">
                  <p><strong>Application Date:</strong> {new Date(application.appliedAt).toLocaleDateString()}</p>
                  <p><strong>Message:</strong> {application.coverLetter || 'No cover letter provided.'}</p>
                </div>
                <div className="application-card-actions">
                  <button className="view-btn" onClick={() => navigate(`/view-application/${application.applicationId}`)}>View</button>
                  <button className="reject-btn" onClick={() => rejectApplication(application.applicationId)}>Reject</button>
                  <button className="accept-btn" onClick={() => acceptApplication(application.applicationId)}>Accept</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Handle accepting/rejecting applications
const acceptApplication = (applicationId) => {
  // Implement your logic to accept application
  console.log(`Accepted application: ${applicationId}`);
};

const rejectApplication = (applicationId) => {
  // Implement your logic to reject application
  console.log(`Rejected application: ${applicationId}`);
};

export default JobPosterApplications;
