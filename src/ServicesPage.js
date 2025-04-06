import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllJobs } from './firebase'; // Assuming this fetches the jobs data from Firebase
import Header from './Header'; // Import Header Component
import Footer from './Footer';
import './ServicesPage.css';

const ServicesPage = () => {
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

  // Filter jobs based on the search query
  const filteredJobs = jobs.filter((job) =>
    job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.jobLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="services-container">
      {/* Header Section */}
      <Header />

      <div className="content">
        <h2>Our Professional Services</h2>
        <p>
          At HireGenius, we provide services to both job seekers and employers.
          Explore our job listings and powerful tools for employers to find the perfect talent.
        </p>

        {/* Posted Jobs Section */}
        <section className="posted-jobs">
          <h3>Job Opportunities for JobSeeker</h3>
          <div className="search-bar-container">
            <input
              type="text"
              placeholder="Search jobs by title, company, or location..."
              className="search-bar"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <div className="job-list">
            {filteredJobs.length === 0 ? (
              <p>No job postings available at the moment.</p>
            ) : (
              filteredJobs.map((job) => (
                <div key={job.jobId} className="job-item">
                  <h4>{job.jobTitle}</h4>
                  <p><strong>Location:</strong> {job.jobLocation}</p>
                  <p><strong>Company:</strong> {job.company}</p>
                  <Link to={`/job-details/${job.jobId}`} className="view-btn">
                    View Details
                  </Link>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Job Poster Services Section */}
        <section className="job-poster-services">
          <h3>Services for Job Posters</h3>
          <div className="services-list">
            <div className="service-item">
              <h4>Post a Job</h4>
              <p>
                Post your job openings to reach qualified candidates who match your company’s needs.
                It's quick, easy, and efficient.
              </p>
            </div>
            <div className="service-item">
              <h4>Review Applications</h4>
              <p>
                Review job applications and resumes with ease. Screen top candidates and find the
                right fit for your company.
              </p>
            </div>
            <div className="service-item">
              <h4>Access a Talent Pool</h4>
              <p>
                Browse through a pool of talented professionals and reach out to the most qualified
                candidates for your roles.
              </p>
            </div>
            <div className="service-item">
              <h4>Employer Branding</h4>
              <p>
                Enhance your employer brand with a customized company profile to attract top-tier
                talent and stand out in the job market.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default ServicesPage;
