import React, { useState, useEffect, useCallback } from 'react';
import { auth, db, deleteJobData } from './firebase';
import { signOut } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import './JobPosterDashboard.css';
import './JobPosterProfile.js'

const JobPosterDashboard = () => {
  const [user, setUser] = useState(null);
  const [postedJobs, setPostedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch jobs from the user's specific path in the database
  const fetchPostedJobs = useCallback((userId) => {
    const userJobsRef = ref(db, `jobPosters/${userId}/jobs`);

    setLoading(true);

    onValue(userJobsRef, (snapshot) => {
      const jobsData = snapshot.val();
      const userJobs = jobsData ? Object.values(jobsData) : [];
      setPostedJobs(userJobs);
      setLoading(false);
    }, (err) => {
      console.error('Error fetching jobs:', err);
      setLoading(false);
    });
  }, []);

  // Listen for user authentication and fetch their posted jobs
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchPostedJobs(currentUser.uid);
      } else {
        navigate('/job-poster-login');
      }
    });

    return () => unsubscribe();
  }, [fetchPostedJobs, navigate]);

  // Handle job deletion
  const handleDeleteJob = async (jobId) => {
    await deleteJobData(jobId, user.uid);
    setPostedJobs(prevJobs => prevJobs.filter(job => job.jobId !== jobId));
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
    <button onClick={() => navigate("/")} className="sidebar-link">Home</button> {/* ✅ Home link added */}
      <li onClick={() => navigate('/job-poster-dashboard')} className="nav-link">Dashboard</li>
      <li onClick={() => navigate('/post-job')} className="nav-link">Post a Job</li>
      <li onClick={() => navigate('/job-poster-profile')} className="nav-link">Profile</li>
      <li onClick={() => navigate('/job-poster-applications')} className="nav-link">Applications</li> {/* New page for applications */}
      <li onClick={() => signOut(auth).then(() => navigate('/job-poster-login'))} className="nav-link logout-btn">Log Out</li>
    </ul>
  </nav>
</div>

      {/* Main Content */}
      <div className="main-content">
        <h1>Your Posted Jobs</h1>

        {loading ? (
          <div className="loading-message">
            <div className="spinner"></div> {/* Spinner animation */}
            Loading your jobs...
          </div>
        ) : postedJobs.length === 0 ? (
          <p>No jobs posted yet.</p>
        ) : (
          <div className="job-cards-container">
            {postedJobs.map((job) => (
              <div key={job.jobId} className="job-card">
                <div className="job-card-header">
                  <h3>{job.jobTitle}</h3>
                  <div className="job-actions">
                    <button className="edit-btn" onClick={() => navigate(`/edit-job/${job.jobId}`)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDeleteJob(job.jobId)}>Delete</button>
                  </div>
                </div>
                <div className="job-card-body">
                  <p><strong>Description:</strong> {job.jobDescription}</p>
                  <p><strong>Location:</strong> {job.jobLocation}</p>
                  <p><strong>Salary:</strong> {job.salary}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobPosterDashboard;
