import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/Auth.css";

// --- UPDATED: Accept onLogin prop ---
export default function Login({ onLogin }) {
  const [showForgotModal, setShowForgotModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (location.state && location.state.message) {
      setSuccessMessage(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // --- UPDATED: handleSubmit to call API ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage(""); // Clear success message on new login attempt
    setLoading(true);

    try {
      // --- THIS IS NOW ACTIVE ---
      // Make sure your C# API is running on this port
      const API_URL = "https://localhost:7019/api/auth/login";
      const response = await axios.post(API_URL, formData);
      
      // On success, save the token
      const token = response.data.token;
      localStorage.setItem("token", token);
      
      // --- NEW: Call the onLogin prop from App.jsx ---
      // This tells App.jsx that we are now logged in.
      onLogin(); 
      
      // Navigate to home page
      navigate("/"); 

    } catch (err) {
      if (err.response && err.response.data) {
        // Use the error message from the API (e.g., "Invalid email or password.")
        setError(err.response.data);
      } else {
        setError("Login failed. Please check your credentials or server connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Modal handlers
  const handleForgotClick = (e) => {
    e.preventDefault();
    setShowForgotModal(true);
  };

  const closeModal = () => {
    setShowForgotModal(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-logo">LUX<span>AUCTION</span></div>

      <div className="auth-box">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your account to continue bidding</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          
          {successMessage && <p className="auth-success">{successMessage}</p>}
          {error && <p className="auth-error">{error}</p>}

          <div className="form-group">
            <label>Email Address <span>*</span></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password <span>*</span></label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <div className="form-options">
            <div>
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#" onClick={handleForgotClick}>Forgot password?</a>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Signing In..." : (
              <>
                <i className="fa fa-sign-in-alt"></i> Sign In
              </>
            )}
          </button>

          <p className="auth-text">
            Don’t have an account?{" "}
            <Link to="/register" className="auth-link">Register here</Link>
          </p>
        </form>
      </div>

      {/* --- MODAL (Unchanged) --- */}
      {showForgotModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Reset Password</h3>
            <p className="modal-text">Enter your email to receive a password reset link.</p>
            <input type="email" placeholder="Your registered email" className="modal-input" />
            <button className="auth-btn">Send Reset Link</button>
            <button className="modal-close" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}