import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllJobs } from './firebase'; // Assuming this fetches the jobs data from Firebase
import Header from './Header'; // Import Header Component
import Footer from './Footer';
import './ServicesPage.css';

const ServicesPage = () => {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getJobs = async () => {
      try {
        await fetchAllJobs(setJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
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
        <h2 className="section-title">Our Professional Services</h2>
        <p className="section-description">
          At HireGenius, we offer a comprehensive suite of services designed for both job seekers and employers.
          Explore our job listings and leverage powerful tools to streamline the hiring process.
        </p>

        {/* Posted Jobs Section */}
        <section className="posted-jobs">
          <h3 className="section-subtitle">Job Opportunities for Job Seekers</h3>
          <div className="search-bar-container">
            <input
              type="text"
              placeholder="Search jobs by title, company, or location..."
              className="search-bar"
              value={searchQuery}
              onChange={handleSearch}
              aria-label="Search jobs"
            />
          </div>

          {loading ? (
            <p>Loading job listings...</p>
          ) : (
            <div className="job-list">
              {filteredJobs.length === 0 ? (
                <p>No job postings available at the moment.</p>
              ) : (
                filteredJobs.map((job) => (
                  <div key={job.jobId} className="job-item">
                    <h4>{job.jobTitle}</h4>
                    <p><strong>Location:</strong> {job.jobLocation}</p>
                    <p><strong>Company:</strong> {job.company}</p>
                    <Link to={`/job-details/${job.jobId}`} className="view-btn" aria-label={`View details of ${job.jobTitle}`}>
                      View Details
                    </Link>
                  </div>
                ))
              )}
            </div>
          )}
        </section>

        {/* Job Poster Services Section */}
        <section className="job-poster-services">
          <h3 className="section-subtitle">Services for Employers</h3>
          <div className="services-list">
            <div className="service-item">
              <h4>Post a Job</h4>
              <p>
                Easily post your job openings to connect with qualified candidates who align with your company's needs.
              </p>
            </div>
            <div className="service-item">
              <h4>Review Applications</h4>
              <p>
                Streamline the hiring process by reviewing applications and resumes to identify top candidates.
              </p>
            </div>
            <div className="service-item">
              <h4>Access a Talent Pool</h4>
              <p>
                Browse through a curated pool of professionals to find the ideal fit for your organization.
              </p>
            </div>
            <div className="service-item">
              <h4>Employer Branding</h4>
              <p>
                Enhance your company’s profile and attract top-tier talent by showcasing your brand.
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
