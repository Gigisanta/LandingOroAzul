'use client'

import { useEffect, useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import Navigation from '@/components/sections/Navigation'
import Hero from '@/components/sections/Hero'
import Schedule from '@/components/sections/Schedule'
import Pricing from '@/components/sections/Pricing'
import Gallery from '@/components/sections/Gallery'
import Testimonials from '@/components/sections/Testimonials'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/sections/Footer'
import { api } from '@/lib/api'
import type { PricingPlan, LandingSettings, Testimonial, GalleryImage } from '@/lib/api'

const Scene = dynamic(() => import('@/components/three/Scene'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 -z-10 bg-[#0A1628] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-[#00A8E8] border-t-transparent rounded-full animate-spin" />
    </div>
  ),
})

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A1628]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#00A8E8] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/60 text-sm">Cargando...</p>
      </div>
    </div>
  )
}

function ErrorState({ error }: { error: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A1628]">
      <div className="text-center max-w-md px-4">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Error al cargar</h2>
        <p className="text-white/60 text-sm mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#005691] hover:bg-[#004a7a] text-white text-sm font-medium rounded-lg transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [pricing, setPricing] = useState<PricingPlan[]>([])
  const [settings, setSettings] = useState<LandingSettings | null>(null)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [gallery, setGallery] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const [pricingData, settingsData, testimonialsData, galleryData] = await Promise.all([
          api.pricing(),
          api.settings(),
          api.testimonials(),
          api.gallery(),
        ])

        setPricing(pricingData || [])
        setSettings(settingsData || null)
        setTestimonials(testimonialsData || [])
        setGallery(galleryData || [])
        setError(null)
      } catch (err) {
        console.error('Failed to load landing data:', err)
        setError('No se pudo conectar con el servidor. Verificá que la API esté corriendo.')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  if (isLoading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error} />
  }

  return (
    <main className="relative">
      {/* 3D Background */}
      <Scene />

      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <Hero businessName="Oro Azul" />

      {/* Schedule Section */}
      <Schedule />

      {/* Pricing Section */}
      <Pricing plans={pricing} />

      {/* Gallery Section */}
      <Gallery images={gallery} />

      {/* Testimonials Section */}
      <Testimonials testimonials={testimonials} />

      {/* Contact Section */}
      <Contact settings={settings!} />

      {/* Footer */}
      <Footer />
    </main>
  )
}
