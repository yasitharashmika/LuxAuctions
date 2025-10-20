import React from "react";
import "../Style/Contact.css";

export default function Contact() {
  return (
    <div className="contact-container">
      <div className="contact-content">
        <h1 className="contact-title">Get in Touch</h1>
        <p className="contact-subtitle">
          Have a question or need assistance? Our LuxAuction support team is always happy to help.
        </p>

        <div className="contact-wrapper">
          <form className="contact-form">
            <div className="form-group">
              <label>Name</label>
              <input type="text" placeholder="Your name" required />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Your email" required />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea placeholder="Write your message..." rows="5" required></textarea>
            </div>

            <button type="submit" className="contact-btn">Send Message</button>
          </form>

          <div className="contact-info">
            <h2>Contact Details</h2>
            <p>📍 Colombo, Sri Lanka</p>
            <p>📧 support@luxauction.com</p>
            <p>📞 +94 77 123 4567</p>
            <p>🕒 Mon - Fri: 9:00 AM – 6:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
}
