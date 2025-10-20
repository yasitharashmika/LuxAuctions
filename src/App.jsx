import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar.jsx'
import Home from './Pages/Home.jsx'
import Auctions from './Pages/Auctions.jsx'
import About from './Pages/About.jsx'
import Contact from './Pages/Contact.jsx'
import NotFound from './Pages/NotFound.jsx'
import Footer from './Components/Footer.jsx'

import SellerDashboad from './Pages/SellerDashboad.jsx'
import CreateListing from './Pages/CreateListing.jsx'


import SellerDashboard from './Pages/SellerDashboard.jsx'
import CreateListing from './Pages/CreateListing.jsx'


export default function App() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-6 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auctions" element={<Auctions />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />

          <Route path="/SellerDashboad" element={<SellerDashboad/>} />
          <Route path="/CreateListing" element={<CreateListing/>} />

          <Route path="/SellerDashboard" element={<SellerDashboard />} />
          <Route path="/CreateListing" element={<CreateListing />} />

        </Routes>
      </main>
      <Footer />
    </>
  )
}
