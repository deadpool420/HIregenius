import React from 'react';
import '../styles/JobSeekerDashboard.css';

const Profile = () => {
  return (
    <div className="profile-page">
      <h2>Your Profile</h2>
      <p><strong>Name:</strong> John Doe</p>
      <p><strong>Email:</strong> johndoe@example.com</p>
      <p><strong>Skills:</strong> React, JavaScript, Python</p>
      <button className="btn">Edit Profile</button>
    </div>
  );
};

export default Profile;
