import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import "./Header.css";
import jobsImage from './components/jobs.png';

const Header = () => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserType(currentUser.uid);
      } else {
        setUser(null);
        setUserType(null);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const fetchUserType = async (userId) => {
    try {
      const db = getDatabase();
      const seekerRef = ref(db, `jobSeekers/${userId}`);
      const seekerSnap = await get(seekerRef);

      if (seekerSnap.exists()) {
        setUserType("jobSeeker");
      } else {
        const posterRef = ref(db, `jobPosters/${userId}`);
        const posterSnap = await get(posterRef);

        if (posterSnap.exists()) {
          setUserType("jobPoster");
        } else {
          setUserType(null);
        }
      }
    } catch (error) {
      console.error("Error fetching user type:", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const handleDashboardRedirect = () => {
    if (userType === "jobSeeker") {
      navigate("/job-seeker-dashboard");
    } else if (userType === "jobPoster") {
      navigate("/job-poster-dashboard");
    }
  };

  return (
    <header className="modern-header">
      <Link to="/" className="brand">
        <img src={jobsImage} alt="HireGenius Logo" className="brand-logo" />
        <span className="brand-name">HireGenius</span>
      </Link>

      <nav className="nav-links">
        <Link to="/services">Services</Link>
        <Link to="/about-us">About Us</Link>
        <Link to="/contact-us">Contact</Link>
      </nav>

      <div className="header-right">
        {user && userType ? (
          <>
            <button className="username-button" onClick={handleDashboardRedirect}>
              {user.displayName || user.email}
            </button>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/job-seeker-signup">
              <button className="auth-button">Job Seeker Sign Up</button>
            </Link>
            <Link to="/job-poster-signup">
              <button className="auth-button">Job Poster Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
