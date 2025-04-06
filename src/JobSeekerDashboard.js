import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { Link, Route, Routes, useNavigate, Navigate } from "react-router-dom";
import JobSeekerProfile from "./JobSeekerProfile";
import FindJobs from "./components/FindJobs";
import MyApplications from "./components/MyApplications";
import Settings from "./components/Settings";

import "./JobSeekerDashboard.css";

const JobSeekerDashboard = () => {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        navigate("/"); // Redirect to homepage if not logged in
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  return (
    <div className="dashboard">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <h2 className="brand-title">HireGenius</h2>
        <nav>
          <Link to="profile" className="sidebar-link">Profile</Link>
          <Link to="jobs" className="sidebar-link">Find Jobs</Link>
          <Link to="applications" className="sidebar-link">My Applications</Link>
          <Link to="settings" className="sidebar-link">Settings</Link>
          <button 
            onClick={() => signOut(auth).then(() => navigate("/"))} 
            className="sidebar-link logout-btn"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="profile" />} /> {/* Default route */}
          <Route path="profile" element={<JobSeekerProfile />} />
          <Route path="jobs" element={<FindJobs />} />
          <Route path="applications" element={<MyApplications />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
};

export default JobSeekerDashboard;
