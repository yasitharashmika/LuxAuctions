import React from "react";
import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image3.jpg";
import image4 from "../assets/image4.jpg";
import image5 from "../assets/image5.jpg";
import "../Style/About.css";

export default function About() {
  return (
    <div className="about-page">
      {/* OUR STORY */}
    <section 
            className="story-section"
            // 2. SET THE CSS VARIABLE: Pass the imported image URL as a style variable
            style={{ "--story-bg-image": `url(${image1})` }}
        >
        <div className="overlay">
          <h1><span className="highlight">Our</span> Story</h1>
          <p>
            Where timeless jewelry meets digital elegance. Discover the passion
            and expertise behind the world's premier online jewelry auction platform.
          </p>
        </div>
      </section> 
  
      {/* OUR MISSION */}
     <section className="mission-section">
        <div className="mission-text">
          <h2><span className="highlight">Our</span> Mission</h2>
          <p>
            At LuxAuction, we believe that exceptional jewelry deserves an exceptional
            platform. Founded in 2020, we've revolutionized how collectors,
            enthusiasts, and connoisseurs discover, bid on, and acquire the world's
            finest jewelry pieces.
          </p>
          <p>
            Our mission is to create a trusted, transparent, and elegant marketplace
            where fine jewelry meets the convenience of modern technology. Every
            auction tells a story, and we're honored to be part of your jewelry journey.
          </p>
        </div>
        <div className="mission-image">
          <img
            src={image2}
            alt="Jewelry showroom"
          />
        </div>
      </section>
     

      {/* OUR VALUES */}
      <section className="values-section">
        <h2><span className="highlight">Our</span> Values</h2>
        <p>The principles that guide everything we do</p>
        <div className="values-grid">
          <div className="value-card">
            <div className="icon">🛡️</div>
            <h3>Authenticity Guaranteed</h3>
            <p>Every piece is authenticated by certified experts before listing.</p>
          </div>
          <div className="value-card">
            <div className="icon">🌍</div>
            <h3>Global Marketplace</h3>
            <p>Connecting buyers and sellers worldwide in a secure environment.</p>
          </div>
          <div className="value-card">
            <div className="icon">💎</div>
            <h3>Expert Support</h3>
            <p>Our specialists provide guidance throughout your journey.</p>
          </div>
          <div className="value-card">
            <div className="icon">🔒</div>
            <h3>Secure Transactions</h3>
            <p>Advanced security protects every transaction and your information.</p>
          </div>
        </div>
      </section>

      {/* OUR TEAM */}
      <section className="team-section">
        <h2><span className="highlight">Meet Our</span> Team</h2>
        <p>The experts behind your luxury jewelry experience</p>
        <div className="team-grid">
          <div className="team-member">
            <img
              src={image3}
              alt="Victoria Sterling"
            />
            <h3>Victoria Sterling</h3>
            <p className="role">Founder & CEO</p>
            <p>Former Sotheby’s jewelry specialist with 15 years in luxury auctions.</p>
          </div>
          <div className="team-member">
            <img
              src={image4}
              alt="Marcus Chen"
            />
            <h3>Marcus Chen</h3>
            <p className="role">Head of Authentication</p>
            <p>Certified gemologist with expertise in vintage and modern jewelry.</p>
          </div>
          <div className="team-member">
            <img
              src={image5}
              alt="Isabella Rodriguez"
            />
            <h3>Isabella Rodriguez</h3>
            <p className="role">Customer Experience Director</p>
            <p>Luxury retail veteran dedicated to exceptional customer care.</p>
          </div>
        </div>
      </section>

      {/* OUR IMPACT */}
      <section className="impact-section">
        <h2><span className="highlight">Our</span> Impact</h2>
        <p>Numbers that reflect our commitment to excellence</p>
        <div className="impact-stats">
          <div><h3>50,000+</h3><p>Jewelry Pieces Sold</p></div>
          <div><h3>15,000+</h3><p>Happy Customers</p></div>
          <div><h3>$100M+</h3><p>Total Sales Volume</p></div>
          <div><h3>99.8%</h3><p>Customer Satisfaction</p></div>
        </div>
      </section>

      {/* OUR JOURNEY */}
      <section className="journey-section">
        <h2><span className="highlight">Our</span> Journey</h2>
        <p>Key milestones in our growth and evolution</p>
        <div className="timeline">
          <div className="timeline-item left">
            <div className="year">2020</div>
            <h3>LuxAuction Founded</h3>
            <p>Victoria Sterling launches LuxAuction to revolutionize jewelry auctions.</p>
          </div>
          <div className="timeline-item right">
            <div className="year">2021</div>
            <h3>Global Expansion</h3>
            <p>Expanded to serve customers in over 50 countries.</p>
          </div>
          <div className="timeline-item left">
            <div className="year">2022</div>
            <h3>Authentication Center</h3>
            <p>Opened a state-of-the-art gemological authentication facility.</p>
          </div>
          <div className="timeline-item right">
            <div className="year">2023</div>
            <h3>Mobile Platform Launch</h3>
            <p>Launched our award-winning app for seamless auction access.</p>
          </div>
          <div className="timeline-item left">
            <div className="year">2024</div>
            <h3>AI-Powered Recommendations</h3>
            <p>Introduced AI technology for personalized jewelry suggestions.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
