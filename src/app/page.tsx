'use client'

import dynamic from 'next/dynamic'
import Navigation from '@/components/sections/Navigation'
import Hero from '@/components/sections/Hero'
import Benefits from '@/components/sections/Benefits'
import Schedule from '@/components/sections/Schedule'
import Pricing from '@/components/sections/Pricing'
import FAQ from '@/components/sections/FAQ'
import Gallery from '@/components/sections/Gallery'
import Testimonials from '@/components/sections/Testimonials'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/sections/Footer'
import ErrorBoundary from '@/components/three/ErrorBoundary'
import landingData from '@/data/landing.json'

const Scene = dynamic(() => import('@/components/three/Scene'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 -z-10 flex items-center justify-center" style={{ backgroundColor: 'var(--color-dark)' }}>
      <div className="w-16 h-16 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--color-turquoise)', borderTopColor: 'transparent' }} />
    </div>
  ),
})

export default function LandingPage() {
  return (
    <main id="main-content" className="relative">
      {/* 3D Background */}
      <ErrorBoundary>
        <Scene />
      </ErrorBoundary>

      {/* Navigation */}
      <Navigation whatsapp={landingData.business.whatsapp} />

      {/* Hero Section */}
      <Hero businessName={landingData.business.name} />

      {/* Benefits Section */}
      <Benefits />

      {/* Schedule Section */}
      <Schedule activities={landingData.activities} />

      {/* Pricing Section */}
      <Pricing plans={landingData.plans} />

      {/* Gallery Section */}
      <Gallery images={landingData.gallery} />

      {/* Testimonials Section */}
      <Testimonials testimonials={landingData.testimonials} />

      {/* FAQ Section */}
      <FAQ />

      {/* Contact Section */}
      <Contact business={landingData.business} />

      {/* Footer */}
      <Footer business={landingData.business} />
    </main>
  )
}
