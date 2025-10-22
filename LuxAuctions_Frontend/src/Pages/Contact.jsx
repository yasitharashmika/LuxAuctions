import React from "react";
import "../Style/Contact.css";

const ContactUs = () => {
  return (
    <div className="lux-contact-page">
      {/* Header Section */}
      <section className="lux-contact-header">
        <h1>
          Contact <span>Us</span>
        </h1>
        <p>
          Have questions about our auctions or need assistance? We're here to
          help you with your luxury jewelry journey.
        </p>
      </section>

      {/* Contact Info */}
      <section className="lux-contact-info">
        <div className="lux-info-box">
          <div className="lux-icon-circle">
            <i className="fas fa-phone"></i>
          </div>
          <h3>Phone Support</h3>
          <p className="lux-highlight">+1 (555) 123-4567</p>
          <p>Monday - Friday, 9AM - 6PM EST</p>
        </div>

        <div className="lux-info-box">
          <div className="lux-icon-circle">
            <i className="fas fa-envelope"></i>
          </div>
          <h3>Email Support</h3>
          <p className="lux-highlight">support@luxauction.com</p>
          <p>We respond within 24 hours</p>
        </div>

        <div className="lux-info-box">
          <div className="lux-icon-circle">
            <i className="fas fa-map-marker-alt"></i>
          </div>
          <h3>Visit Our Gallery</h3>
          <p className="lux-highlight">
            123 Fifth Avenue, New York, NY 10001
          </p>
          <p>By appointment only</p>
        </div>
      </section>

      {/* Message Form + Sidebar */}
      <section className="lux-contact-body">
        <div className="lux-form-section">
          <h2>Send Us a Message</h2>
          <form>
            <label>Full Name *</label>
            <input type="text" placeholder="Your full name" required />

            <label>Email Address *</label>
            <input type="email" placeholder="your@email.com" required />

            <label>Subject *</label>
            <select required>
              <option>Select a subject</option>
              <option>Bidding Assistance</option>
              <option>Jewelry Authentication</option>
              <option>Payment Inquiry</option>
              <option>Other</option>
            </select>

            <label>Message *</label>
            <textarea
              placeholder="Please describe your inquiry in detail..."
              rows="5"
              required
            ></textarea>

            <button type="submit">Send Message</button>
          </form>
        </div>

        <div className="lux-sidebar">
          <div className="lux-map">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.898284993921!2d-74.0060156845925!3d40.74106007932875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259af180c0e03%3A0x3d3b8a1a8e2f8eb!2sGoogle%20NYC!5e0!3m2!1sen!2sus!4v1635082956614!5m2!1sen!2sus"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>

          <div className="lux-business-hours">
            <h3>Business Hours</h3>
            <p>
              Monday - Friday <span>9:00 AM - 6:00 PM</span>
            </p>
            <p>
              Saturday <span>10:00 AM - 4:00 PM</span>
            </p>
            <p>
              Sunday <span>Closed</span>
            </p>
          </div>

          <div className="lux-quick-answers">
            <h3>Quick Answers</h3>
            <p>
              <strong>How do I place a bid?</strong>
              <br />
              Simply register, browse auctions, and click "Place Bid" on any
              item.
            </p>

            <p>
              <strong>Is authentication guaranteed?</strong>
              <br />
              Yes, all jewelry is professionally authenticated before listing.
            </p>

            <p>
              <strong>What payment methods do you accept?</strong>
              <br />
              We accept all major credit cards, wire transfers, and certified
              checks.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
