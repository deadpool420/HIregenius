import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { ref, onValue, set } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar'; // Import the Sidebar component
import './JobPosterProfile.css'; // Make sure to add CSS for better design

const JobPosterProfile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = ref(db, `jobPosters/${currentUser.uid}`);
        
        onValue(userRef, (snapshot) => {
          const userData = snapshot.val();
          if (userData) {
            setName(userData.name || '');
            setCompany(userData.company || '');
            setEmail(userData.email || '');
            setPhone(userData.phone || '');
          }
          setLoading(false);
        });
      } else {
        navigate('/job-poster-login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSave = async () => {
    if (!user) {
      alert('User not found!');
      return;
    }

    if (!name || !company || !email || !phone) {
      alert('Please fill all the fields.');
      return;
    }

    try {
      const userRef = ref(db, `jobPosters/${user.uid}`);
      await set(userRef, { name, company, email, phone });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('❌ Error updating profile:', error.message);
      alert('Failed to update profile.');
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>; // Can be a spinner or message

  return (
    <div className="dashboard-container">
      <Sidebar /> {/* Sidebar added here */}
      <div className="profile-container">
        <h1>Your Profile</h1>
        {user && (
          <div className="profile-form">
            <div className="form-group">
              <label>Full Name:</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Enter your name" 
              />
            </div>
            
            <div className="form-group">
              <label>Company:</label>
              <input 
                type="text" 
                value={company} 
                onChange={(e) => setCompany(e.target.value)} 
                placeholder="Enter your company name" 
              />
            </div>
            
            <div className="form-group">
              <label>Email:</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter your email" 
              />
            </div>
            
            <div className="form-group">
              <label>Phone:</label>
              <input 
                type="text" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="Enter your phone number" 
              />
            </div>
            
            <button className="save-btn" onClick={handleSave}>Save</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobPosterProfile;
