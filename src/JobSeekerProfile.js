import React, { useEffect, useState } from "react";
import { getDatabase, ref, get, set } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./JobSeekerProfile.css"; // Ensure this contains professional styles

const JobSeekerProfile = () => {
  const [profile, setProfile] = useState({ fullName: "", phone: "", skills: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const auth = getAuth();

  // Track authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        setLoading(false); // Stop loading if no user is found
      }
    });
    return () => unsubscribe();
  }, [auth]);

  // Fetch Job Seeker data from Firebase only when user is set
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const db = getDatabase();
        const profileRef = ref(db, `jobSeekers/${user.uid}`);
        const snapshot = await get(profileRef);

        if (snapshot.exists()) {
          setProfile(snapshot.val());
        } else {
          console.log("No profile data found for user.");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("An error occurred while fetching your profile. Please try again later.");
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  // Handle input changes
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Save profile data
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const db = getDatabase();
      const profileRef = ref(db, `jobSeekers/${user.uid}`);
      await set(profileRef, { ...profile, email: user.email });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again later.");
    }

    setSaving(false);
  };

  if (loading) return <div className="loading-spinner">Loading...</div>; // A spinner or loading indicator can go here

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      
      {error && <p className="error-message">{error}</p>}

      <form className="profile-form">
        <div className="input-group">
          <label>Email (non-editable):</label>
          <input type="email" value={user ? user.email : ""} disabled />
        </div>

        <div className="input-group">
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={profile.fullName || ""}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
        </div>

        <div className="input-group">
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={profile.phone || ""}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />
        </div>

        <div className="input-group">
          <label>Skills:</label>
          <textarea
            name="skills"
            value={profile.skills || ""}
            onChange={handleChange}
            placeholder="List your skills"
          />
        </div>

        <div className="save-button">
          <button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobSeekerProfile;
