import React, { useState } from 'react';
import { auth, sendPasswordResetEmail } from './firebase';
import { useNavigate, Link } from 'react-router-dom';
import Header from './Header'; // Import Header
import Footer from './Footer'; // Import Footer
import './ResetPassword.css';

const JobPosterResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('A password reset link has been sent to your email.');
      setTimeout(() => navigate('/job-poster-login'), 5000); // Redirect to Job Poster Login after 5s
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <Header />

      <div className="reset-password-page">
        <h2>Job Poster - Reset Password</h2>
        <form onSubmit={handleResetPassword}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send Reset Link</button>
        </form>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <p><Link to="/job-poster-login">Back to Login</Link></p>
      </div>

      <Footer />
    </>
  );
};

export default JobPosterResetPassword;
