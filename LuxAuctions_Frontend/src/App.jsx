import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar.jsx'
import Home from './Pages/Home.jsx'
import Auctions from './Pages/Auctions.jsx'
import About from './Pages/About.jsx'
import Contact from './Pages/Contact.jsx'
import NotFound from './Pages/NotFound.jsx'
import Login from './Pages/Login.jsx'
import Register from './Pages/Register.jsx'
import Footer from './Components/Footer.jsx'
import SellerDashboad from './Pages/SellerDashboad.jsx' // Keeping your file name
import CreateListing from './Pages/CreateListing.jsx'

// --- NEW: Helper function to decode JWT ---
// This safely decodes the token to find the user's role
function decodeToken(token) {
  if (!token) return null;
  try {
    // The token is in three parts: header.payload.signature
    const payloadBase64 = token.split('.')[1];
    // Decode the Base64 string (atob) and parse it as JSON
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);
    
    // C#/.NET APIs store the role claim in this specific schema
    const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    
    return role; // This will be "Seller" or "Buyer"
  } catch (e) {
    console.error("Failed to decode token:", e);
    // This can happen if the token is malformed or expired
    return null;
  }
}

// --- NEW: Placeholder for Buyer Dashboard (you can create this page later) ---
const BuyerDashboard = () => (
  <div style={{ padding: '2rem' }}>
    <h2>Buyer Dashboard</h2>
    <p>Welcome to your dashboard. Here you can see your bids and watched items.</p>
  </div>
);


export default function App() {
  // --- UPDATED: State now includes userRole ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // --- NEW: Effect to check token on initial app load ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const role = decodeToken(token);
      if (role) {
        setIsAuthenticated(true);
        setUserRole(role);
      } else {
        // Token was invalid or expired, so log them out
        localStorage.removeItem("token");
      }
    }
  }, []); // The empty array [] means this runs only once when App mounts

  // --- UPDATED: Login handler now also decodes the role ---
  const handleLogin = () => {
    const token = localStorage.getItem("token"); // Get token set by Login.jsx
    if (token) {
      const role = decodeToken(token);
      if (role) {
        setIsAuthenticated(true);
        setUserRole(role);
      }
    }
  };

  // --- UPDATED: Logout handler now also clears the role ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUserRole(null); // Clear the role from state
  };

  return (
    <>
      {/* --- UPDATED: Pass userRole to Navbar --- */}
      <Navbar 
        isAuthenticated={isAuthenticated} 
        userRole={userRole} 
        onLogout={handleLogout} 
      />

      <main className="container mx-auto px-6 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auctions" element={<Auctions />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/seller-dashboard" element={<SellerDashboad />} />
          <Route path="/create-listing" element={<CreateListing />} />
          
          {/* --- NEW: Route for Buyer Dashboard --- */}
          <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
          
          {/* --- UPDATED: Pass the new handleLogin function --- */}
          <Route 
            path="/login" 
            element={<Login onLogin={handleLogin} />} 
          />

          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}