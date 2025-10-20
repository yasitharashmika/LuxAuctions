import React from "react";
import "../Style/About.css";

export default function About() {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1 className="about-title">About LuxAuction</h1>
        <p className="about-intro">
          At <span>LuxAuction</span>, we bring together passion, precision, and prestige. 
          Our platform offers a secure and transparent space where luxury jewelry finds 
          its true worth through world-class auctions.
        </p>

        <div className="about-sections">
          <div className="about-card">
            <h2>Our Story</h2>
            <p>
              Founded with a vision to revolutionize online jewelry auctions, LuxAuction connects 
              trusted sellers with collectors and enthusiasts from around the globe.
            </p>
          </div>

          <div className="about-card">
            <h2>Our Mission</h2>
            <p>
              To empower jewelry owners and buyers through fair, authentic, and 
              luxury-driven auctions — ensuring every piece tells a timeless story.
            </p>
          </div>

          <div className="about-card">
            <h2>Why Choose Us?</h2>
            <ul>
              <li>🔒 Verified Sellers & Buyers</li>
              <li>💎 Certified Luxury Jewelry</li>
              <li>⚡ Real-time Bidding System</li>
              <li>🤝 Transparent Pricing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
