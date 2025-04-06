import React from "react";
import { Link } from "react-router-dom";
import "./AboutUsPage.css"; // Ensure this CSS file is up to date with the changes
import Header from './Header';  // Import Header component
import Footer from './Footer'; 
import jobsImage from './components/jobs.png';

const AboutUsPage = () => {
  return (
    <div className="about-us-page">
      {/* Include Header Component */}
      <Header />  

      {/* Main Content Section */}
      <div className="about-content">
        <h1>About HireGenius</h1>
        <p className="intro">
          HireGenius is not just another job platform; it's a comprehensive career solution that connects job seekers with the right opportunities and helps companies discover top talent. Our innovative approach to recruitment aims to redefine the hiring experience with simplicity, transparency, and efficiency.
        </p>

        {/* Mission Section */}
        <div className="section mission">
          <h2>Our Mission</h2>
          <p>
            Our mission is to bridge the gap between job seekers and employers by providing a seamless and efficient platform where both parties can interact, explore opportunities, and grow. We believe in creating a system where the recruitment process is transparent, easy to navigate, and, most importantly, effective. We leverage cutting-edge technology to match individuals with opportunities that align with their skills and career aspirations.
          </p>
        </div>

        {/* Vision Section */}
        <div className="section vision">
          <h2>Our Vision</h2>
          <p>
            Our vision is to become the global leader in career solutions by constantly innovating and improving the hiring process. We strive to create a world where job seekers can easily find roles that match their passions, while employers have access to the best talent, regardless of location. We envision a platform that is not only user-friendly but also driven by the values of diversity, equity, and inclusion, ensuring that everyone has equal access to career opportunities.
          </p>
        </div>

        {/* Values Section */}
        <div className="section values">
          <h2>Our Core Values</h2>
          <div className="values-list">
            <div className="value-item">
              <h3>Integrity</h3>
              <p>We prioritize honesty and transparency in all our interactions, fostering trust and respect.</p>
            </div>
            <div className="value-item">
              <h3>Innovation</h3>
              <p>We continuously explore new ways to improve the hiring experience for everyone involved.</p>
            </div>
            <div className="value-item">
              <h3>Diversity</h3>
              <p>We are committed to building inclusive communities where all talents are recognized and celebrated.</p>
            </div>
            <div className="value-item">
              <h3>Customer-Centric</h3>
              <p>Our users are at the heart of everything we do, and we are dedicated to creating solutions that meet their needs.</p>
            </div>
            <div className="value-item">
              <h3>Excellence</h3>
              <p>We strive to deliver exceptional results in everything we do, exceeding expectations at every step.</p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="section team">
          <h2>Meet Our Team</h2>
          <div className="team-member">
            <Link to="/">
              <img src={jobsImage} alt="Jignesh Mecwan" className="team-member-img" />
            </Link>
            <div className="team-member-info">
              <h3>Jignesh Mecwan</h3>
              <p>Founder & Developer</p>
              <p>
                Hi, I’m Jignesh Mecwan, the founder of HireGenius. I’m passionate about leveraging technology to build solutions that make the hiring process more efficient, transparent, and accessible to all. HireGenius was born out of my commitment to connecting talented individuals with employers who value their skills. I’m dedicated to creating a platform that empowers job seekers and employers to find success.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="section testimonials">
          <h2>What Our Users Say</h2>
          <div className="testimonial-item">
            <p>"HireGenius helped me find my dream job in just a few weeks. The process was seamless, and I felt supported throughout. Highly recommend it!"</p>
            <footer>- John Doe, Software Engineer</footer>
          </div>
          <div className="testimonial-item">
            <p>"As a recruiter, HireGenius has simplified the way we post jobs and review applicants. It's a game-changer for our hiring process."</p>
            <footer>- Jane Smith, HR Manager</footer>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="cta">
          <h2>Ready to Get Started?</h2>
          <p>
            Whether you're looking for your dream job or seeking top talent for your organization, HireGenius is here to help you succeed. Sign up now to start your journey with us, and be part of a community that’s changing the future of work.
          </p>
          <div className="cta-buttons">
            <Link to="/job-seeker-signup">
              <button className="cta-btn">Sign Up as Job Seeker</button>
            </Link>
            <Link to="/job-poster-signup">
              <button className="cta-btn">Sign Up as Job Poster</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Include Footer Component */}
      <Footer />
    </div>
  );
};

export default AboutUsPage;
