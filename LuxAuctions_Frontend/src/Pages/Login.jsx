import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Style/Auth.css";

export default function Login() {
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleForgotClick = (e) => {
    e.preventDefault();
    setShowForgotModal(true);
  };

  const closeModal = () => {
    setShowForgotModal(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Login to your LuxAuction account</p>

        <form className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" required />
          </div>

          <div className="forgot-password">
            <a href="#" onClick={handleForgotClick}>Forgot Password?</a>
          </div>

          <button type="submit" className="auth-btn">Login</button>

          <p className="auth-text">
            Don’t have an account?{" "}
            <Link to="/register" className="auth-link">Register</Link>
          </p>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Reset Password</h3>
            <p className="modal-text">Enter your email to receive a password reset link.</p>
            <input
              type="email"
              placeholder="Your registered email"
              className="modal-input"
            />
            <button className="auth-btn">Send Reset Link</button>
            <button className="modal-close" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
