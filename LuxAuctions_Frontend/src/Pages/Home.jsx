import React from 'react'
import HeroSection from '../Components/HeroSection'
import FeaturedAuctions from '../Components/FeaturedAuctions'
import HowItWorks from '../Components/HowItWorks'
import CtaSection from '../Components/CtaSection'

export default function Home() {
  return (
    <div>
        <HeroSection />
        <FeaturedAuctions />
        <HowItWorks />
        <CtaSection />
    </div>
  )
}
