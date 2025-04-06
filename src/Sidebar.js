// src/Sidebar.js

import React from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import './Sidebar.css';

const Sidebar = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <h2>Welcome, {user?.displayName || 'Job Poster'}</h2>
      <nav>
        <ul>
          <li onClick={() => navigate('/job-poster-dashboard')}>Dashboard</li>
          <li onClick={() => navigate('/post-job')}>Post a Job</li>
          <li onClick={() => navigate('/job-poster-profile')}>Profile</li>
          <li onClick={() => signOut(auth).then(() => navigate('/job-poster-login'))}>Log Out</li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
