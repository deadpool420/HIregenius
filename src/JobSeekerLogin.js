import React, { useState, useEffect } from 'react';
import { auth, signInWithEmailAndPassword } from './firebase';
import { ref, get } from 'firebase/database';
import { useNavigate, Link } from 'react-router-dom';
import { db } from './firebase';
import Header from './Header';
import Footer from './Footer';
import './JobSeekerLogin.css';

const JobSeekerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check if the user is already logged in when component mounts
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      // If user is already logged in, redirect them to the job seeker dashboard
      navigate('/job-seeker-dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');  // Clear previous errors

    try {
      // Authenticate the user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the user exists in the "jobSeekers" node
      const userRef = ref(db, `jobSeekers/${user.uid}`);
      const userSnapshot = await get(userRef);

      if (userSnapshot.exists()) {
        console.log('Job Seeker Login Successful');
        navigate('/job-seeker-dashboard');  // Redirect to job seeker dashboard
      } else {
        // If user is not found in the "jobSeekers" node
        setError('Access Denied: This account is not registered as a Job Seeker.');
      }
    } catch (error) {
      console.error('Login error:', error.message);
      if (error.code === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else if (error.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else {
        setError('Error logging in. Please try again.');
      }
    }
  };

  return (
    <>
      <Header />
      <div className="login-page">
        <h2>Job Seeker Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        {error && <p className="error">{error}</p>}
        <p>Don't have an account? <Link to="/job-seeker-signup">Sign Up</Link></p>
        <p><Link to="/job-seeker-reset-password">Forgot Password?</Link></p>
      </div>
      <Footer />
    </>
  );
};

export default JobSeekerLogin;
