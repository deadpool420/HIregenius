import React, { useState } from 'react';
import { auth, signInWithEmailAndPassword } from './firebase';
import { ref, get } from 'firebase/database';
import { useNavigate, Link } from 'react-router-dom';
import { db } from './firebase';
import Header from './Header';
import Footer from './Footer';
import './JobPosterLogin.css';

const JobPosterLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Authenticate user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the user exists in the "jobPosters" node
      const userRef = ref(db, `jobPosters/${user.uid}`);
      const userSnapshot = await get(userRef);

      if (userSnapshot.exists()) {
        console.log('Job Poster Login Successful');
        navigate('/job-poster-dashboard');
      } else {
        // If the user is not found in "jobPosters", prevent login
        setError('Access Denied: This account is not registered as a Job Poster.');
      }
    } catch (error) {
      console.error('Login error:', error.message);
      setError(error.message);
    }
  };

  return (
    <>
      <Header />
      <div className="login-page">
        <h2>Job Poster Login</h2>
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
        <p>Don't have an account? <Link to="/job-poster-signup">Sign Up</Link></p>
        <p><Link to="/job-poster-reset-password">Forgot Password?</Link></p>
      </div>
      <Footer />
    </>
  );
};

export default JobPosterLogin;
