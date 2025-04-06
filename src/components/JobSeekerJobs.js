import React, { useState, useEffect } from 'react';
import { fetchAllJobs } from '../firebase'; // Ensure this function is defined to fetch job data
import { Link } from 'react-router-dom';
import './JobSeekerJobs.css'; // Updated styling
import Footer from '../Footer'; // Import Footer component

const JobSeekerJobs = () => {
  const [jobs, setJobs] = useState([]);

  // Fetch all jobs when the component mounts
  useEffect(() => {
    fetchAllJobs((allJobs) => {
      console.log("Fetched jobs:", allJobs); // Debugging
      setJobs(allJobs);  // Set fetched jobs to state
    });
  }, []);

  return (
    <div className="job-seeker-jobs">
      {/* Header Section */}
      <header className="header">
        <div className="logo">
          <Link to="/">
            <img src="path-to-your-logo.png" alt="HireGenius" className="logo-img" />
          </Link>
        </div>

        <nav className="nav">
          <Link to="/services" className="nav-link">Services</Link>
          <Link to="/about-us" className="nav-link">About Us</Link>
          <Link to="/contact-us" className="nav-link">Contact Us</Link>
        </nav>

        <div className="header-buttons">
          <Link to="/job-seeker-signup">
            <button className="signup-btn">Job Seeker Sign Up</button>
          </Link>
          <Link to="/job-poster-signup">
            <button className="signup-btn">Job Poster Sign Up</button>
          </Link>
        </div>
      </header>

      {/* Main Content Section */}
      <main className="main-content">
        <h1 className="page-title">Available Job Listings</h1>
        <p className="intro-text">Find the perfect job that aligns with your career goals and aspirations.</p>

        {/* Latest Job Listings */}
        <section className="posted-jobs">
          <h2 className="section-title">Explore the Latest Job Opportunities</h2>
          {jobs.length === 0 ? (
            <div className="no-jobs">
              <p>No jobs available at the moment. Please check back later.</p>
            </div>
          ) : (
            <div className="job-list">
              {jobs.map((job) => (
                <div key={job.jobId} className="job-card">
                  <div className="job-card-header">
                    <img src={job.companyLogo || 'path-to-default-logo.png'} alt="Company Logo" className="company-logo" />
                    <div className="job-title-container">
                      <h3 className="job-title">{job.jobTitle}</h3>
                      <p className="job-location">{job.jobLocation || "Not specified"}</p>
                    </div>
                  </div>
                  <p className="job-description">{job.jobDescription}</p>
                  <div className="job-details">
                    <span className="job-company">{job.company || "Company name"}</span>
                    <span className="posted-by">Posted by: {job.posterName || "Unknown"}</span>
                  </div>
                  <div className="job-btn-container">
                    <Link to={`/job-details/${job.jobId}`}>
                      <button className="view-btn">View Details</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default JobSeekerJobs;
