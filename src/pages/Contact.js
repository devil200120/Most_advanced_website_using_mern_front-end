// frontend/src/pages/Contact.js
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would typically send the form data to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-hero">
        <h1>Contact Us</h1>
        <p>We're here to help you with any questions or concerns</p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <div className="contact-item">
            <i className="fas fa-map-marker-alt"></i>
            <div>
              <h3>Address</h3>
              <p>123 Education Street<br />Learning City, LC 12345</p>
            </div>
          </div>
          <div className="contact-item">
            <i className="fas fa-phone"></i>
            <div>
              <h3>Phone</h3>
              <p>+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="contact-item">
            <i className="fas fa-envelope"></i>
            <div>
              <h3>Email</h3>
              <p>support@examsite.com</p>
            </div>
          </div>
          <div className="contact-item">
            <i className="fas fa-clock"></i>
            <div>
              <h3>Support Hours</h3>
              <p>Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday: 10:00 AM - 4:00 PM</p>
            </div>
          </div>
        </div>

        <div className="contact-form">
          <h2>Send us a Message</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                required
              />
            </div>
            <div className="form-group">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows="5"
                required
              ></textarea>
            </div>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>

      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>How do I reset my password?</h3>
            <p>You can reset your password by clicking the "Forgot Password" link on the login page.</p>
          </div>
          <div className="faq-item">
            <h3>How do I schedule an exam?</h3>
            <p>Teachers can schedule exams through the Create Exam page in their dashboard.</p>
          </div>
          <div className="faq-item">
            <h3>Can I retake an exam?</h3>
            <p>Retake policies are set by your teacher. Check with them for specific exam retake rules.</p>
          </div>
          <div className="faq-item">
            <h3>How do I make a payment?</h3>
            <p>You can make payments through the Payment section in your dashboard using credit/debit cards.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;