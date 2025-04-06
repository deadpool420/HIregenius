import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { ref, onValue, set } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

const JobPosterProfile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = ref(db, `jobPosters/${currentUser.uid}`);
        
        onValue(userRef, (snapshot) => {
          const userData = snapshot.val();
          if (userData) setName(userData.name || '');
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

    try {
      const userRef = ref(db, `jobPosters/${user.uid}`);
      await set(userRef, { name });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('❌ Error updating profile:', error.message);
      alert('Failed to update profile.');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <h1>Your Profile</h1>
      {user && (
        <div className="profile-form">
          <label>Full Name:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Enter your name"
          />
          <button onClick={handleSave}>Save</button>
        </div>
      )}
    </div>
  );
};

export default JobPosterProfile;
