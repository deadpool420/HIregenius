import React from 'react';
import '../styles/JobSeekerDashboard.css';

const Settings = () => {
  return (
    <div className="settings-page">
      <h2>Settings</h2>
      <p>Change Password</p>
      <button className="btn">Update Password</button>
      <p>Notification Preferences</p>
      <button className="btn">Update Preferences</button>
    </div>
  );
};

export default Settings;
