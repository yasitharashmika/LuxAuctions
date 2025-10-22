// src/Pages/Register.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import "../style/Auth.css";

export default function Register() {
  // Hook to navigate the user after successful registration
  const navigate = useNavigate();

  // State to hold all form data in a single object
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "Buyer", // Default role
    password: "",
    confirmPassword: "",
  });

  // State for displaying error messages from the backend or frontend validation
  const [error, setError] = useState("");
  
  // State to handle loading state while the request is in progress
  const [loading, setLoading] = useState(false);

  // A single handler to update the state for any form field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Function to handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission (page reload)
    setError(""); // Clear previous errors

    // --- Frontend Validation ---
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true); // Set loading to true

    try {
      // --- API Call ---
      // Prepare the data payload to match the backend DTO (UserRegisterDto)
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
        password: formData.password,
      };

      // The URL for your backend's registration endpoint
      // --- IMPORTANT: Using port 7019 from your previous screenshots ---
      const API_URL = "https://localhost:7019/api/auth/register";

      // Send the POST request using axios
      await axios.post(API_URL, payload);

      // --- MODIFIED PART ---
      // If the request is successful, navigate to the login page
      // and pass the success message in the state.
      navigate("/login", {
        state: { message: "Registration successful! Please log in." },
      });

    } catch (err) {
      // --- Error Handling ---
      // If the API call fails, set the error message
      if (err.response && err.response.data) {
        // Use the error message from the backend if it exists
        setError(err.response.data);
      } else {
        // Generic error message
        setError("Registration failed. Please try again later.");
      }
    } finally {
        setLoading(false); // Set loading back to false
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-logo">
        LUX<span>AUCTION</span>
      </div>

      <div className="auth-box">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join our exclusive jewelry auction community</p>

        {/* Attach the handleSubmit function to the form's onSubmit event */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {/* --- Full Name Input --- */}
          <div className="form-group">
            <label>Full Name <span>*</span></label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* --- Email Input --- */}
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

          {/* --- Account Type Select --- */}
          <div className="form-group">
            <label>Account Type</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="Buyer">Buyer – Bid on jewelry auctions</option>
              <option value="Seller">Seller – List your jewelry</option>
            </select>
          </div>

          {/* --- Password Input --- */}
          <div className="form-group">
            <label>Password <span>*</span></label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password (min 6 characters)"
              required
            />
          </div>

          {/* --- Confirm Password Input --- */}
          <div className="form-group">
            <label>Confirm Password <span>*</span></label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          {/* Display error message if it exists */}
          {error && <p className="auth-error">{error}</p>}

          <div className="form-check">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              I agree to the <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a>
            </label>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating Account...' : (
                <>
                    <i className="fa fa-user-plus"></i> Create Account
                </>
            )}
          </button>

          <p className="auth-text">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}