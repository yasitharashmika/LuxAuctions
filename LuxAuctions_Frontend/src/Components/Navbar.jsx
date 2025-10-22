import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom"; // Import useNavigate

import "../Style/NavBar.css";

// --- UPDATED: Accept isAuthenticated and onLogout props ---
export default function Navbar({ isAuthenticated, onLogout }) {
  const navigate = useNavigate(); // Hook for navigation

  // --- NEW: Click handler for the logout button ---
  const handleLogoutClick = () => {
    onLogout(); // Call the logout function from App.jsx
    navigate("/login"); // Redirect to the login page
  };

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
          <NavLink to="/sell" className="nav-item">Sell Jewelry</NavLink>
          <NavLink to="/about" className="nav-item">About</NavLink>
          <NavLink to="/contact" className="nav-item">Contact</NavLink>
          <NavLink to="/seller-dashboard" className="nav-item">Seller Dashboard</NavLink>
          <NavLink to="/create-listing" className="nav-item">Create Listing</NavLink>
        </div>

        {/* --- UPDATED: Conditional Buttons --- */}
        <div className="navbar-buttons">
          {isAuthenticated ? (
            // User is LOGGED IN
            <>
              {/* You can link this to a /dashboard or /profile page later */}
              <Link to="/my-account" className="btn-outline">My Account</Link>
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