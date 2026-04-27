'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export type WaterVisibility = 'full' | 'partial' | 'hidden'

interface UseWaterVisibilityReturn {
  visibility: WaterVisibility
  currentSection: string
  opacity: number
}

const SECTION_CONFIG: Record<string, { opacity: number; visibility: WaterVisibility }> = {
  'inicio': { opacity: 0.65, visibility: 'partial' },
  'beneficios': { opacity: 0.4, visibility: 'partial' },
  'horarios': { opacity: 0.35, visibility: 'partial' },
  'precios': { opacity: 0.3, visibility: 'partial' },
  'galeria': { opacity: 0.6, visibility: 'partial' },
  'testimonios': { opacity: 0.3, visibility: 'partial' },
  'faq': { opacity: 0.25, visibility: 'partial' },
  'contacto': { opacity: 0.5, visibility: 'partial' },
}

const DEFAULT_SECTION = 'inicio'

export function useWaterVisibility(): UseWaterVisibilityReturn {
  const [visibility, setVisibility] = useState<WaterVisibility>('full')
  const [currentSection, setCurrentSection] = useState(DEFAULT_SECTION)
  const [opacity, setOpacity] = useState(1.0)
  const sectionsRef = useRef<Map<string, HTMLElement>>(new Map())
  const ticking = useRef(false)

  const updateVisibility = useCallback(() => {
    const scrollY = window.scrollY
    const viewportHeight = window.innerHeight
    const viewportCenter = scrollY + viewportHeight * 0.4

    // Find active section
    let activeSection = DEFAULT_SECTION
    let minDistance = Infinity

    sectionsRef.current.forEach((el, id) => {
      const rect = el.getBoundingClientRect()
      const elementTop = rect.top + scrollY
      const elementCenter = elementTop + rect.height / 2
      const distance = Math.abs(viewportCenter - elementCenter)

      // Check if section is in viewport (with some threshold)
      const isInViewport = rect.top < viewportHeight * 0.8 && rect.bottom > 0

      if (isInViewport && distance < minDistance) {
        minDistance = distance
        activeSection = id
      }
    })

    // Get config for active section
    const config = SECTION_CONFIG[activeSection] || SECTION_CONFIG[DEFAULT_SECTION]

    setCurrentSection(activeSection)
    setOpacity(config.opacity)
    setVisibility(config.visibility)
    ticking.current = false
  }, [])

  useEffect(() => {
    // Build section map
    const sectionIds = Object.keys(SECTION_CONFIG)
    sectionIds.forEach(id => {
      const el = document.getElementById(id)
      if (el) sectionsRef.current.set(id, el)
    })

    // Also check for hero section
    const heroEl = document.getElementById('inicio')
    if (heroEl && !sectionsRef.current.has('inicio')) {
      sectionsRef.current.set('inicio', heroEl)
    }

    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(updateVisibility)
        ticking.current = true
      }
    }

    // Initial call
    updateVisibility()

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', updateVisibility, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateVisibility)
    }
  }, [updateVisibility])

  return { visibility, currentSection, opacity }
}
