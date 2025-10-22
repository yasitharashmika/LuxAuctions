import React, { useState } from 'react'
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
import SellerDashboad from './Pages/SellerDashboad.jsx'
import CreateListing from './Pages/CreateListing.jsx'

export default function App() {
  // --- NEW: Authentication State ---
  // We check localStorage to see if a token already exists.
  // The `!!` converts the string (or null) to a boolean.
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  // --- NEW: Logout Handler ---
  // This function will be passed to the Navbar
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    // Navigation to /login will be handled in the Navbar component
  };

  return (
    <>
      {/* Pass the auth state and logout function to the Navbar */}
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />

      <main className="container mx-auto px-6 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auctions" element={<Auctions />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/seller-dashboard" element={<SellerDashboad />} />
          <Route path="/create-listing" element={<CreateListing />} />
          
          {/* Pass the login function to the Login page */}
          <Route 
            path="/login" 
            element={<Login onLogin={() => setIsAuthenticated(true)} />} 
          />

          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}