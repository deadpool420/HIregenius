import React, { useState } from 'react';
import Header from './Header';  // Import Header component
import Footer from './Footer';  // Import Footer component
import './ContactUsPage.css';  // Add custom CSS for styling

const ContactUsPage = () => {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError('Please fill out all fields.');
      return;
    }
    // You can add email functionality or send the form to a backend here
    alert('Your message has been sent!');
    setName('');
    setEmail('');
    setMessage('');
    setError('');
  };

  return (
    <div>
      <Header />
      <div className="contact-us-container">
        <h2>Contact Us</h2>
        <p className="intro-text">Have questions or feedback? We’d love to hear from you. Our team is here to assist!</p>

        <div className="contact-form-container">
          <h3>Send Us a Message</h3>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Full Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your Name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Your Email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message:</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="Write your message here..."
              ></textarea>
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </div>

        <div className="contact-details">
          <h3>Our Contact Details</h3>
          <ul>
            <li><strong>Email:</strong> support@hiregenius.com</li>
            <li><strong>Phone:</strong> +123 456 7890</li>
            <li><strong>Address:</strong> 123 HireGenius St., Talent City, ABC</li>
          </ul>
        </div>

        {/* Optional: Embed Google Map */}
        <div className="google-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3120.736697097569!2d-73.935242!3d40.730610!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259af1237c6d3%3A0x11a75a872d13543b!2sNew+York%2C+NY!5e0!3m2!1sen!2sus!4v1619428857154!5m2!1sen!2sus"
            width="100%"
            height="300"
            allowFullScreen=""
            loading="lazy"
            title="Location"
          ></iframe>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactUsPage;
