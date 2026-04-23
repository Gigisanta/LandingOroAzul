'use client'

import dynamic from 'next/dynamic'
import Navigation from '@/components/sections/Navigation'
import Hero from '@/components/sections/Hero'
import Schedule from '@/components/sections/Schedule'
import Pricing from '@/components/sections/Pricing'
import Gallery from '@/components/sections/Gallery'
import Testimonials from '@/components/sections/Testimonials'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/sections/Footer'
import landingData from '@/data/landing.json'

const Scene = dynamic(() => import('@/components/three/Scene'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 -z-10 bg-[#0A1628] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-[#00A8E8] border-t-transparent rounded-full animate-spin" />
    </div>
  ),
})

export default function LandingPage() {
  return (
    <main className="relative">
      {/* 3D Background */}
      <Scene />

      {/* Navigation */}
      <Navigation whatsapp={landingData.business.whatsapp} />

      {/* Hero Section */}
      <Hero businessName={landingData.business.name} />

      {/* Schedule Section */}
      <Schedule activities={landingData.activities} />

      {/* Pricing Section */}
      <Pricing plans={landingData.plans} />

      {/* Gallery Section */}
      <Gallery images={landingData.gallery} />

      {/* Testimonials Section */}
      <Testimonials testimonials={landingData.testimonials} />

      {/* Contact Section */}
      <Contact business={landingData.business} />

      {/* Footer */}
      <Footer business={landingData.business} />
    </main>
  )
}
