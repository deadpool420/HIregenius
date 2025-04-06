// src/components/Logout.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();

    signOut(auth)
      .then(() => {
        // Successfully signed out
        console.log('User logged out');
        // Redirect to HomePage after logout
        navigate('/home');  // Redirect to HomePage.js
      })
      .catch((error) => {
        console.error('Error logging out: ', error);
      });
  }, [navigate]);

  return <div>Logging out...</div>;
};

export default Logout;
