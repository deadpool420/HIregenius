import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchJobById, applyForJob } from '../firebase';  // Import your firebase functions
import Header from '../Header';
import Footer from '../Footer';
import { getAuth } from 'firebase/auth';  // Ensure you're using Firebase Auth here
import './JobDetails.css';

const JobDetails = () => {
  const { jobId } = useParams();  // Get jobId from URL params
  const [job, setJob] = useState(null);  // State to store job details
  const [isApplied, setIsApplied] = useState(false);  // Track application status
  const [loading, setLoading] = useState(true);  // Loading state
  const [showLoginPopup, setShowLoginPopup] = useState(false);  // Popup visibility for login
  const navigate = useNavigate();
  const auth = getAuth();  // Firebase authentication instance

  // Fetch job details when the component mounts or jobId changes
  useEffect(() => {
    fetchJobById(jobId, (jobData) => {
      setJob(jobData);
      setLoading(false);
    });
  }, [jobId]);

  // Handle Apply Now button click
  const handleApplyNow = () => {
    const user = auth.currentUser;  // Get the currently logged-in user
    if (!user) {
      // If user is not logged in, show the login popup
      setShowLoginPopup(true);
      return;
    }

    // Apply for the job using the applyForJob function
    applyForJob(jobId, user.uid, (success) => {
      if (success) {
        setIsApplied(true);  // Set application status to true
        alert('Successfully applied for the job!');
      } else {
        alert('Failed to apply for the job. Please try again later.');
      }
    });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className="job-details-container">
        <div className="job-details-header">
          <h1 className="job-title">{job.jobTitle}</h1>
          <p className="job-company">{job.company || 'Unknown Company'}</p>
          <div className="job-location">
            <span>{job.jobLocation || 'Location not specified'}</span>
            <span className="job-type">{job.jobType || 'Job Type not specified'}</span>
          </div>
        </div>

        <div className="job-description-section">
          <h2>Job Description</h2>
          <p>{job.jobDescription || 'No description provided'}</p>
        </div>

        <div className="company-info-section">
          <h2>Company Information</h2>
          <p><strong>Company:</strong> {job.company || 'Unknown'}</p>
          <p><strong>Posted by:</strong> {job.posterName || 'Unknown'}</p>
        </div>

        <div className="apply-section">
          {isApplied ? (
            <button className="apply-btn" disabled>Already Applied</button>
          ) : (
            <button className="apply-btn" onClick={handleApplyNow}>Apply Now</button>
          )}
        </div>

        {/* Login Popup */}
        {showLoginPopup && !auth.currentUser && (
          <div className="login-popup">
            <div className="popup-content">
              <button className="close-btn" onClick={() => setShowLoginPopup(false)}>X</button>
              <p>Please log in to apply for the job.</p>
              <button 
                className="login-btn" 
                onClick={() => navigate('/job-seeker-login')} // Redirect to login page
              >
                Login
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default JobDetails;
