import React from "react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="cta">
      <h2>Ready to Get Started?</h2>
      <p>Sign up now to begin your journey with HireGenius! Whether you're looking for your next job or hiring the best talent, we've got you covered.</p>
      <div className="cta-buttons">
        <Link to="/job-seeker-signup">
          <button className="cta-btn">Join as Job Seeker</button>
        </Link>
        <Link to="/job-poster-signup">
          <button className="cta-btn">Post a Job</button>
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
