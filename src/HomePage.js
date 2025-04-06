import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllJobs } from './firebase';
import Footer from './Footer';
import jobsImage from './components/jobs.png';
import './HomePage.css';

const HomePage = () => {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getJobs = async () => {
      await fetchAllJobs(setJobs);
    };
    getJobs();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredJobs = jobs.filter((job) =>
    job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.jobLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="home-container">
      {/* Header Section */}
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">
            <img src={jobsImage} alt="HireGenius" className="logo-img" />
            <h1>HireGenius</h1>
          </Link>
          <nav className="nav">
            <Link to="/services" className="nav-link">Services</Link>
            <Link to="/about-us" className="nav-link">About Us</Link>
            <Link to="/contact-us" className="nav-link">Contact</Link>
          </nav>
          <div className="header-buttons">
            <Link to="/job-seeker-signup" className="btn-primary">Find Jobs</Link>
            <Link to="/job-poster-signup" className="btn-secondary">Post a Job</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1>Find Your Dream Job with HireGenius</h1>
        <p>Connecting talented professionals with top employers.</p>
        <input
          type="text"
          placeholder="Search jobs by title, company, or location..."
          className="search-bar"
          value={searchQuery}
          onChange={handleSearch}
        />
      </section>

      {/* Job Listings */}
      <section className="job-listings">
        <h2>Latest Job Openings</h2>
        {filteredJobs.length === 0 ? (
          <p className="no-jobs">No jobs available at the moment.</p>
        ) : (
          <div className="jobs-grid">
            {filteredJobs.map((job) => (
              <div key={job.jobId} className="job-card">
                <h3>{job.jobTitle}</h3>
                <p><strong>Company:</strong> {job.company || 'Unknown'}</p>
                <p><strong>Location:</strong> {job.jobLocation || 'Not specified'}</p>
                <p><strong>Posted by:</strong> {job.posterName || 'Unknown'}</p>
                <Link to={`/job-details/${job.jobId}`} className="btn-view">View Details</Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Why Choose HireGenius */}
      <section className="why-choose">
        <h2>Why Choose HireGenius?</h2>
        <div className="features">
          <div className="feature">
            <h3>Easy Job Search</h3>
            <p>Find jobs effortlessly with our advanced search and filtering options.</p>
          </div>
          <div className="feature">
            <h3>Trusted Employers</h3>
            <p>Connect with reputable companies actively hiring professionals.</p>
          </div>
          <div className="feature">
            <h3>Seamless Hiring Process</h3>
            <p>Streamlined application and hiring processes for job seekers and employers.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>Ready to Get Started?</h2>
        <p>Join today and take the next step in your career journey!</p>
        <div className="cta-buttons">
          <Link to="/job-seeker-signup" className="btn-primary">Join as Job Seeker</Link>
          <Link to="/job-poster-signup" className="btn-secondary">Post a Job</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;