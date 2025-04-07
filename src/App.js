import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import JobSeekerSignup from './JobSeekerSignup';
import JobPosterSignup from './JobPosterSignup';
import JobSeekerLogin from './JobSeekerLogin';
import JobPosterLogin from './JobPosterLogin';
import JobSeekerDashboard from './JobSeekerDashboard';
import JobPosterDashboard from './JobPosterDashboard';
import JobPosterPostJob from './JobPosterPostJob';
import JobSeekerResetPassword from './JobSeekerResetPassword';
import JobPosterResetPassword from './JobPosterResetPassword';
import ContactUsPage from './ContactUsPage';
import AboutUsPage from './AboutUsPage';
import ServicesPage from './ServicesPage';
import JobSeekerProfile from './JobSeekerProfile';
import JobSeekerJobs from './components/JobSeekerJobs';
import JobDetails from './components/JobDetails';  // Import JobDetails component
import MyApplications from './components/MyApplications';  // Import MyApplications component
import JobPosterApplications from './JobPosterApplications';  // Import the new page
import JobPosterProfile from './JobPosterProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/job-seeker-signup" element={<JobSeekerSignup />} />
        <Route path="/job-poster-signup" element={<JobPosterSignup />} />
        <Route path="/job-seeker-login" element={<JobSeekerLogin />} />
        <Route path="/job-poster-login" element={<JobPosterLogin />} />

        <Route path="/job-seeker-dashboard" element={<JobSeekerDashboard />}>
          <Route path="profile" element={<JobSeekerProfile />} />
          <Route path="jobs" element={<JobSeekerJobs />} />
          <Route path="applications" element={<MyApplications />} />  {/* Add MyApplications route */}
        </Route>

        <Route path="/job-details/:jobId" element={<JobDetails />} />  {/* Route for job details page */}

        {/* Other routes */}
        <Route path="/job-poster-dashboard" element={<JobPosterDashboard />} />
        <Route path="/job-poster-profile" element={<JobPosterProfile />} />  {/* Add JobPosterProfile route */}
        <Route path="/post-job" element={<JobPosterPostJob />} />
        <Route path="/job-seeker-reset-password" element={<JobSeekerResetPassword />} />
        <Route path="/job-poster-reset-password" element={<JobPosterResetPassword />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/job-poster-applications" element={<JobPosterApplications />} />  {/* Add the new route */}
      </Routes>
    </Router>
  );
}

export default App;
