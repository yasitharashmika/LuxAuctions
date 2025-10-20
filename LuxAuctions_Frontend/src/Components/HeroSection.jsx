import React from "react";
import "../style/HeroSection.css";
import heroBg from "../assets/hero-bg.jpg"; // make sure to add your image to /src/assets/

export default function HeroSection() {
  return (
    <section
      className="lux-hero-section"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="lux-hero-overlay">
        <div className="lux-hero-content">
          <h1 className="lux-hero-title">
            <span className="lux-line-1">Where Timeless</span>
            <br />
            <span className="lux-line-2">Jewelry</span>
            <br />
            <span className="lux-line-3">Meets Digital Elegance</span>
          </h1>
          <p className="lux-hero-subtitle">
            Discover rare and exquisite jewelry pieces in our exclusive online
            auctions
          </p>

          <div className="lux-hero-buttons">
            <button className="lux-btn-gold">Browse Auctions</button>
            <button className="lux-btn-outline">Sell an Item</button>
          </div>
        </div>
      </div>
    </section>
  );
}
