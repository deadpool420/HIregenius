// JobApplicantsDetailPage.js
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { ref, onValue } from 'firebase/database';
import { useParams } from 'react-router-dom';

const JobApplicantsDetailPage = () => {
  const { jobId } = useParams(); // Access the job ID from the URL
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = "CURRENT_USER_ID"; // Replace with dynamic user ID
    const applicantsRef = ref(db, `jobPosters/${userId}/jobs/${jobId}/applications`);
    
    // Fetch applicants for the specific job
    onValue(applicantsRef, (snapshot) => {
      const applicantsData = snapshot.val();
      const applicantsList = applicantsData ? Object.values(applicantsData) : [];
      setApplicants(applicantsList);
      setLoading(false);
    });
  }, [jobId]);

  return (
    <div className="applicants-detail-container">
      <h1>Applicants for Job</h1>

      {loading ? (
        <div className="loading">Loading applicants...</div>
      ) : applicants.length === 0 ? (
        <p>No applicants for this job yet.</p>
      ) : (
        <div className="applicants-list">
          {applicants.map((applicant, index) => (
            <div key={index} className="applicant-card">
              <p><strong>Name:</strong> {applicant.jobSeekerName}</p>
              <p><strong>Email:</strong> {applicant.jobSeekerEmail}</p>
              <p><strong>Status:</strong> {applicant.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplicantsDetailPage;
