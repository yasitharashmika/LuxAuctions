import React from "react";
import "../style/Auth.css";
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join the world of exclusive jewelry auctions</p>

        <form className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="Enter your name" required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Create a password" required />
          </div>

          <button type="submit" className="auth-btn">Register</button>

          <p className="auth-text">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
