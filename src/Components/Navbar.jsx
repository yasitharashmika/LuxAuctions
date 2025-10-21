import React from "react";
import { NavLink, Link } from "react-router-dom";
import "../Style/NavBar.css";

export default function Navbar() {
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

        {/* Navigation Links */}
        <div className="navbar-links">
          <NavLink to="/" end className="nav-item">Home</NavLink>
          <NavLink to="/auctions" className="nav-item">Auctions</NavLink>
          <NavLink to="/sell" className="nav-item">Sell Jewelry</NavLink>
          <NavLink to="/about" className="nav-item">About</NavLink>
          <NavLink to="/contact" className="nav-item">Contact</NavLink>

          <NavLink to="/SellerDashboad" className="nav-item">Seller Dashboad</NavLink>

          
          

        </div>

        {/* Buttons */}
        <div className="navbar-buttons">
          <button className="btn-outline">Login</button>
          <button className="btn-filled">Register</button>
        </div>
      </nav>
    </header>
  );
}
