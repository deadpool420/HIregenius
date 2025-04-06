import React, { useState } from 'react';
import { auth } from './firebase'; // Your firebase config file
import { Link, useNavigate } from 'react-router-dom';  // Import useNavigate
import './ResetPassword.css';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      await auth.sendPasswordResetEmail(email);  // Firebase method to send reset email
      setSuccessMessage('Password reset email sent! Check your inbox.');
      setEmail('');  // Clear the input field after sending
      navigate('/job-seeker-login');  // Navigate to login page after success
    } catch (error) {
      setError(error.message);  // Display error message if something goes wrong
    }
  };

  return (
    <div className="reset-password-page">
      <h2>Reset Password</h2>
      <form onSubmit={handlePasswordReset}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>

      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      <p>Remembered your password? <Link to="/job-seeker-login">Login</Link></p>
      <p>Don't have an account? <Link to="/job-seeker-signup">Sign Up</Link></p>
    </div>
  );
};

export default ResetPassword;
