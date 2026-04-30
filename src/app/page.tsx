'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import Navigation from '@/components/sections/Navigation'
import Hero from '@/components/sections/Hero'
import Benefits from '@/components/sections/Benefits'
import Schedule from '@/components/sections/Schedule'
import Pricing from '@/components/sections/Pricing'
import Gallery from '@/components/sections/Gallery'
import Testimonials from '@/components/sections/Testimonials'
import FAQ from '@/components/sections/FAQ'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/sections/Footer'
import FloatingWhatsAppButton from '@/components/ui/FloatingWhatsAppButton'
import BackToTopButton from '@/components/ui/BackToTopButton'
import ScrollProgress from '@/components/ui/ScrollProgress'
import landingData from '@/data/landing.json'

const Scene = dynamic(() => import('@/components/three/Scene'), { ssr: false })

function SceneFallback() {
  return (
    <div
      className="fixed inset-0 z-0 fallback-water"
      style={{
        background: 'radial-gradient(ellipse 100% 80% at 50% 30%, rgba(0, 180, 216, 0.15) 0%, #0A1628 60%)',
      }}
    />
  )
}

export default function LandingPage() {
  return (
    <>
      {/* 3D Swimming Pool Background */}
      <div className="fixed inset-0 z-0">
        <Suspense fallback={<SceneFallback />}>
          <Scene />
        </Suspense>
      </div>

      {/* UI Enhancements */}
      <ScrollProgress />
      <FloatingWhatsAppButton whatsapp={landingData.business.whatsapp} />
      <BackToTopButton />

      <main id="main-content" className="relative z-10">
        <Navigation whatsapp={landingData.business.whatsapp} businessName={landingData.business.name} />

      <Hero businessName={landingData.business.name} />

      <Benefits />

      <Schedule activities={landingData.activities} />

      <Pricing plans={landingData.plans} whatsapp={landingData.business.whatsapp} />

      <Gallery images={landingData.gallery} />

      <Testimonials testimonials={landingData.testimonials} />

      <FAQ />

      <Contact business={landingData.business} />

      <Footer business={landingData.business} />
      </main>
    </>
  )
}