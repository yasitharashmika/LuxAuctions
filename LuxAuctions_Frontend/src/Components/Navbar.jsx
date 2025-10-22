import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom"; 

import "../Style/NavBar.css";

// --- UPDATED: Accept 'userRole' as a prop ---
export default function Navbar({ isAuthenticated, userRole, onLogout }) {
  const navigate = useNavigate(); 

  const handleLogoutClick = () => {
    onLogout(); 
    navigate("/login"); 
  };

  // --- NEW: Logic to determine the correct dashboard link ---
  let myAccountLink = "/"; // Fallback link
  if (userRole === "Seller") {
    myAccountLink = "/seller-dashboard";
  } else if (userRole === "Buyer") {
    myAccountLink = "/buyer-dashboard";
  }
  // If role is null or something else, it will just link to "/"

  return (
    <header className="navbar">
      <nav className="navbar-container">
        {/* Logo Section */}
        <div className="navbar-logo">
          <div className="logo-circle"></div>
          <div>
            <Link to="/" className="logo-text">LuxAuction</Link>
            <p className="logo-subtitle">Premium Jewelry</p>
          </div>
        </div>

        {/* Navigation Links (Unchanged) */}
        <div className="navbar-links">
          <NavLink to="/" end className="nav-item">Home</NavLink>
          <NavLink to="/auctions" className="nav-item">Auctions</NavLink>
          <NavLink to="/about" className="nav-item">About</NavLink>
          <NavLink to="/contact" className="nav-item">Contact</NavLink>
          
          
        </div>

        {/* --- UPDATED: Conditional Buttons --- */}
        <div className="navbar-buttons">
          {isAuthenticated ? (
            // User is LOGGED IN
            <>
              {/* --- UPDATED: Link now goes to the dynamic route --- */}
              <Link to={myAccountLink} className="btn-outline">My Account</Link>
              <button onClick={handleLogoutClick} className="btn-filled">Logout</button>
            </>
          ) : (
            // User is LOGGED OUT
            <>
              <Link to="/login" className="btn-outline">Login</Link>
              <Link to="/register" className="btn-filled">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}