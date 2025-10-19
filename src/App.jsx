import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar.jsx'
import Home from './Pages/Home.jsx'
import Auctions from './Pages/Auctions.jsx'
import About from './Pages/About.jsx'
import Contact from './Pages/Contact.jsx'
import NotFound from './Pages/NotFound.jsx'
import Footer from './Components/Footer.jsx'

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
        </Routes>
      </main>
      <Footer />
    </>
  )
}
