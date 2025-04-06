import React, { useState } from "react";
import { auth, saveJobData } from "./firebase"; // Import Firebase config
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import Sidebar from "./Sidebar"; // Sidebar for the navigation menu
import "./JobPosterPostJob.css"; // Custom CSS for the post job page

const JobPosterPostJob = () => {
  // State to handle form inputs
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    jobLocation: "",
    jobType: "Full-time",
    salary: "",
    company: "",
  });

  // State to handle errors and loading status
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // useNavigate hook for navigation

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle job posting submission
  const handlePostJob = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error
    setLoading(true); // Start loading

    const { jobTitle, jobDescription, jobLocation, salary, company } = formData;

    // Validation checks for required fields
    if (!jobTitle || !jobDescription || !jobLocation || !salary || !company) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    // Validate salary input
    if (isNaN(salary) || salary <= 0) {
      setError("Please enter a valid salary.");
      setLoading(false);
      return;
    }

    // Check if the user is logged in
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setError("You must be logged in to post a job.");
      setLoading(false);
      return;
    }

    // Prepare the job details to be saved in the database
    const jobDetails = { ...formData, postedBy: currentUser.uid };

    try {
      // Save the job data to Firebase (Realtime Database or Firestore)
      await saveJobData(jobDetails);
      navigate("/job-poster-dashboard"); // Navigate to the dashboard after posting
    } catch (err) {
      setError("Error posting job. Please try again.");
      console.error("Job posting error:", err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="post-job-container">
      <Sidebar user={auth.currentUser} /> {/* Sidebar component for navigation */}
      <div className="post-job-form">
        <h2>Post a Job</h2>
        <form onSubmit={handlePostJob}>
          {/* Job Title */}
          <div className="form-group">
            <label htmlFor="jobTitle">Job Title</label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              required
              placeholder="Enter job title"
            />
          </div>

          {/* Company Name */}
          <div className="form-group">
            <label htmlFor="company">Company Name</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              placeholder="Enter company name"
            />
          </div>

          {/* Job Description */}
          <div className="form-group">
            <label htmlFor="jobDescription">Job Description</label>
            <textarea
              id="jobDescription"
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              required
              placeholder="Enter job details"
            />
          </div>

          {/* Job Location */}
          <div className="form-group">
            <label htmlFor="jobLocation">Location</label>
            <input
              type="text"
              id="jobLocation"
              name="jobLocation"
              value={formData.jobLocation}
              onChange={handleChange}
              required
              placeholder="Enter location"
            />
          </div>

          {/* Job Type */}
          <div className="form-group">
            <label htmlFor="jobType">Job Type</label>
            <select
              id="jobType"
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              required
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Hourly">Hourly</option>
            </select>
          </div>

          {/* Salary */}
          <div className="form-group">
            <label htmlFor="salary">Salary ($)</label>
            <input
              type="number"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              required
              placeholder="Enter salary"
            />
          </div>

          {/* Display any error message */}
          {error && <p className="error-message">{error}</p>}

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Posting..." : "Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobPosterPostJob;
