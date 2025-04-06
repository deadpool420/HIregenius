// src/EditJob.js
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { useNavigate, useParams } from 'react-router-dom';
import { ref, get, update } from 'firebase/database';

/*************  ✨ Codeium Command ⭐  *************/
/**
 * EditJob is a React component that allows users to edit job details.
 * 
 * This component:
 * - Retrieves the job information based on the jobId from the URL parameters.
 * - Displays a form pre-filled with the existing job details.
 * - Allows users to update the job details and submit the changes.
 * - Updates the job information in the Firebase Realtime Database upon form submission.
 * - Handles errors that occur during data fetching or updating by displaying the error message.
 * 
/******  f48e2fd3-4857-4be9-982f-775593122517  *******/
const EditJob = () => {
  const { jobId } = useParams(); // Get the jobId from the route
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch the job details based on jobId
  useEffect(() => {
    const jobRef = ref(db, `jobs/${jobId}`);
    get(jobRef).then(snapshot => {
      if (snapshot.exists()) {
        setJob(snapshot.val());
        setLoading(false);
      } else {
        setError('Job not found');
        setLoading(false);
      }
    }).catch(err => {
      setError('Failed to fetch job details');
      setLoading(false);
    });
  }, [jobId]);

  // Handle form submission to update the job
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedJob = {
      jobTitle: e.target.jobTitle.value,
      jobDescription: e.target.jobDescription.value,
      jobLocation: e.target.jobLocation.value,
      salary: e.target.salary.value,
    };

    const jobRef = ref(db, `jobs/${jobId}`);
    try {
      await update(jobRef, updatedJob);
      navigate(`/job-poster-dashboard`);
    } catch (error) {
      setError('Failed to update job');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="edit-job-container">
      <h2>Edit Job</h2>
      {error && <p className="error">{error}</p>}
      {job && (
        <form onSubmit={handleSubmit}>
          <label>
            Job Title:
            <input
              type="text"
              name="jobTitle"
              defaultValue={job.jobTitle}
              required
            />
          </label>
          <label>
            Job Description:
            <textarea
              name="jobDescription"
              defaultValue={job.jobDescription}
              required
            />
          </label>
          <label>
            Location:
            <input
              type="text"
              name="jobLocation"
              defaultValue={job.jobLocation}
              required
            />
          </label>
          <label>
            Salary:
            <input
              type="text"
              name="salary"
              defaultValue={job.salary}
              required
            />
          </label>
          <button type="submit">Update Job</button>
        </form>
      )}
    </div>
  );
};

export default EditJob;
