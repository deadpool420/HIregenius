import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import './MyApplications.css'; // Add your styles here

const MyApplications = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          // Reference to the 'applications' node
          const applicationsRef = ref(getDatabase(), 'applications');
          const snapshot = await get(applicationsRef);

          if (snapshot.exists()) {
            const applicationsData = snapshot.val();
            const userAppliedJobs = [];

            // Loop through all applications and filter by jobSeekerId
            for (const applicationId in applicationsData) {
              const application = applicationsData[applicationId];
              if (application.jobSeekerId === user.uid) {
                // Fetch job details based on jobId
                const jobRef = ref(getDatabase(), `jobs/${application.jobId}`);
                const jobSnapshot = await get(jobRef);
                if (jobSnapshot.exists()) {
                  const job = jobSnapshot.val();
                  userAppliedJobs.push({
                    jobId: job.jobId,
                    jobTitle: job.jobTitle,
                    company: job.company,
                    jobLocation: job.jobLocation,
                    salary: job.salary,
                    status: application.status, // Application status
                    appliedAt: application.appliedAt, // Time of application
                  });
                }
              }
            }

            setAppliedJobs(userAppliedJobs);
            setLoading(false);
          } else {
            setAppliedJobs([]);
            setLoading(false);
          }
        } catch (error) {
          console.error("❌ Error fetching applied jobs:", error);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, [auth]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="my-applications">
      <h2>My Applications</h2>
      {appliedJobs.length > 0 ? (
        <div className="applied-jobs-list">
          {appliedJobs.map((job, index) => (
            <div key={index} className="applied-job">
              <h3>{job.jobTitle}</h3>
              <p>Company: {job.company}</p>
              <p>Location: {job.jobLocation}</p>
              <p>Salary: {job.salary}</p>
              <p>Status: {job.status}</p>
              <p>Applied on: {new Date(job.appliedAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>You haven't applied to any jobs yet.</p>
      )}
    </div>
  );
};

export default MyApplications;
