import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { fetchAllJobs } from './firebase';
import Header from './Header';
import Footer from './Footer';
import jobsImage from './components/jobs.png';
import './HomePage.css';

const HomePage = () => {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userName, setUserName] = useState(null);
  const [userType, setUserType] = useState(null);

  const navigate = useNavigate();
  const auth = getAuth();
  const db = getDatabase();

  useEffect(() => {
    const getJobs = async () => {
      await fetchAllJobs(setJobs);
    };
    getJobs();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;

        const seekerRef = ref(db, `jobSeekers/${uid}`);
        const seekerSnap = await get(seekerRef);
        if (seekerSnap.exists()) {
          setUserType("jobSeeker");
          setUserName(seekerSnap.val().name || user.displayName);
          return;
        }

        const posterRef = ref(db, `jobPosters/${uid}`);
        const posterSnap = await get(posterRef);
        if (posterSnap.exists()) {
          setUserType("jobPoster");
          setUserName(posterSnap.val().name || user.displayName);
        }
      } else {
        setUserName(null);
        setUserType(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleUserClick = () => {
    if (userType === 'jobSeeker') {
      navigate('/job-seeker-dashboard');
    } else if (userType === 'jobPoster') {
      navigate('/job-poster-dashboard');
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredJobs = jobs.filter((job) =>
    job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.jobLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSignOut = () => {
    auth.signOut().then(() => {
      setUserName(null);
      setUserType(null);
      navigate('/');
    }).catch((error) => {
      console.error('Error signing out:', error.message);
    });
  };

  return (
    <div className="home-container">
      <Header userName={userName} userType={userType} handleSignOut={handleSignOut} />

      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Dream Job with HireGenius</h1>
          <p>Connecting talented professionals with top employers.</p>
          <input
            type="text"
            placeholder="Search jobs by title, company, or location..."
            className="search-bar"
            value={searchQuery}
            onChange={handleSearch}
            aria-label="Search jobs"
          />
        </div>
      </section>

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
                <Link to={`/job-details/${job.jobId}`} className="btn-view" aria-label={`View details for ${job.jobTitle}`}>View Details</Link>
              </div>
            ))}
          </div>
        )}
      </section>

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
