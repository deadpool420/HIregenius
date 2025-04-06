import React, { useState } from 'react';
import { auth, createUserWithEmailAndPassword, db } from './firebase';
import { ref, set } from "firebase/database"; // Import ref and set
import { useNavigate, Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './JobSeekerLogin.css';

const JobSeekerSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save to Firebase Realtime Database
      await set(ref(db, `jobSeekers/${user.uid}`), {
        name,
        email,
        userId: user.uid,
        userType: "jobSeeker",
        createdAt: new Date().toISOString(),
      });

      console.log('✅ Job Seeker Signup Successful');
      navigate('/job-seeker-dashboard');
    } catch (error) {
      console.error("❌ Signup error:", error.message);
      setError(error.message);
    }
  };

  return (
    <>
      <Header />
      <div className="login-page">
        <h2>Job Seeker Sign Up</h2>
        <form onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <button type="submit">Sign Up</button>
        </form>
        {error && <p className="error">{error}</p>}
        <p>Already have an account? <Link to="/job-seeker-login">Log in here</Link></p>
      </div>
      <Footer />
    </>
  );
};

export default JobSeekerSignup;
