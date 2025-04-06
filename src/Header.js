import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database"; // Firebase database
import "./HomePage.css"; // Import the CSS file for styling
import jobsImage from './components/jobs.png';

const Header = () => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // Track the user type (Job Seeker or Job Poster)
  const auth = getAuth();
  const navigate = useNavigate(); // Use navigate to programmatically change routes

  // Track login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // Fetch user type from the Firebase database
        fetchUserType(currentUser.uid);
      } else {
        setUser(null);
        setUserType(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  // Fetch user type (Job Seeker or Job Poster) from the database
  const fetchUserType = async (userId) => {
    try {
      const userRef = ref(getDatabase(), `jobSeekers/${userId}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        setUserType("jobSeeker"); // Set user type as Job Seeker
      } else {
        // Check if the user is a Job Poster
        const posterRef = ref(getDatabase(), `jobPosters/${userId}`);
        const posterSnapshot = await get(posterRef);

        if (posterSnapshot.exists()) {
          setUserType("jobPoster"); // Set user type as Job Poster
        } else {
          setUserType(null); // No matching account found
        }
      }
    } catch (error) {
      console.error("Error fetching user type:", error.message);
      setUserType(null);
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  // Handle redirect to dashboard
  const handleDashboardRedirect = () => {
    if (userType === "jobSeeker") {
      navigate("/job-seeker-dashboard"); // Redirect to Job Seeker Dashboard
    } else if (userType === "jobPoster") {
      navigate("/job-poster-dashboard"); // Redirect to Job Poster Dashboard
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <img src={jobsImage} alt="HireGenius" className="logo-img" />
          <h1>HireGenius</h1>
        </Link>

        <nav className="nav">
          <Link to="/services" className="nav-link">Services</Link>
          <Link to="/about-us" className="nav-link">About Us</Link>
          <Link to="/contact-us" className="nav-link">Contact</Link>
        </nav>

        <div className="header-buttons">
          {user && userType ? (  // Only show user info if account type matches
            <div className="user-info">
              <span 
                className="username" 
                onClick={handleDashboardRedirect} // Click to redirect to the dashboard
              >
                Welcome, {user.displayName || user.email}
              </span>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <>
              <Link to="/job-seeker-signup">
                <button className="signup-btn">Job Seeker Sign Up</button>
              </Link>
              <Link to="/job-poster-signup">
                <button className="signup-btn">Job Poster Sign Up</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
