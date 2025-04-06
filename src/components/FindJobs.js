import React, { useEffect, useState } from 'react';
import { fetchAllJobs } from '../firebase';
import { Link } from 'react-router-dom';
import './FindJobs.css';

const FindJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Fetch all jobs posted by job posters
    fetchAllJobs((allJobs) => {
      setJobs(allJobs); // Set the fetched jobs to the state
    });
  }, []);

  return (
    <div className="find-jobs-container">
      <h2 className="find-jobs-title">Job Listings</h2>
      
      {jobs.length === 0 ? (
        <div className="no-jobs">
          <p>No jobs available at the moment.</p>
        </div>
      ) : (
        <div className="job-list">
          {jobs.map((job) => (
            <div key={job.jobId} className="job-card">
              <h3 className="job-title">{job.jobTitle}</h3>
              <p className="job-description">{job.jobDescription}</p>
              <p className="job-location"><strong>Location:</strong> {job.jobLocation}</p>
              <p className="job-salary"><strong>Salary:</strong> {job.salary}</p>
              
              <Link to={`/job-details/${job.jobId}`} className="view-details-btn">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FindJobs;
