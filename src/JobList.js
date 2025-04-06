import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { Link } from "react-router-dom";

const JobList = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const jobsRef = ref(db, "jobs");

    onValue(jobsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const jobList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setJobs(jobList);
      }
    });
  }, []);

  return (
    <div>
      <h2>Job Listings</h2>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            <h3>{job.jobTitle}</h3>
            <p>{job.jobDescription}</p>
            <p><strong>Location:</strong> {job.jobLocation}</p>
            <p><strong>Salary:</strong> {job.salary}</p>
            <Link to={`/apply/${job.id}`}>Apply & Upload Resume</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobList;
