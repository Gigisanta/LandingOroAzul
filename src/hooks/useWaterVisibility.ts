'use client'

import { useState, useEffect, useRef } from 'react'

export type WaterVisibility = 'full' | 'partial' | 'hidden'

interface UseWaterVisibilityReturn {
  visibility: WaterVisibility
  currentSection: string
  opacity: number
}

const SECTION_CONFIG: Record<string, { opacity: number; visibility: WaterVisibility }> = {
  'inicio': { opacity: 1.0, visibility: 'full' },
  'beneficios': { opacity: 0.9, visibility: 'partial' },
  'horarios': { opacity: 0.85, visibility: 'partial' },
  'precios': { opacity: 0.85, visibility: 'partial' },
  'galeria': { opacity: 0.85, visibility: 'partial' },
  'testimonios': { opacity: 0.85, visibility: 'partial' },
  'faq': { opacity: 0.85, visibility: 'partial' },
  'contacto': { opacity: 0.85, visibility: 'partial' },
}

const DEFAULT_SECTION = 'inicio'
const DEFAULT_OPACITY = SECTION_CONFIG[DEFAULT_SECTION].opacity

export function useWaterVisibility(): UseWaterVisibilityReturn {
  const [visibility, setVisibility] = useState<WaterVisibility>(SECTION_CONFIG[DEFAULT_SECTION].visibility)
  const [currentSection, setCurrentSection] = useState(DEFAULT_SECTION)
  const [opacity, setOpacity] = useState(1.0) // Start at full opacity
  const sectionRatiosRef = useRef<Record<string, number>>({})
  const observerRef = useRef<IntersectionObserver | null>(null)
  const initializedRef = useRef(false)

  useEffect(() => {
    // Fallback: after 1 second, ensure we're at full opacity if no section detected
    const fallbackTimeout = setTimeout(() => {
      if (!initializedRef.current) {
        setOpacity(1.0)
        setVisibility('full')
        initializedRef.current = true
      }
    }, 1000)
    const sectionIds = Object.keys(SECTION_CONFIG)

    const updateActiveSection = () => {
      let maxRatio = 0
      let activeSection = DEFAULT_SECTION

      for (const id of sectionIds) {
        const ratio = sectionRatiosRef.current[id] || 0
        if (ratio > maxRatio) {
          maxRatio = ratio
          activeSection = id
        }
      }

      if (activeSection !== DEFAULT_SECTION || maxRatio > 0) {
        initializedRef.current = true
        const config = SECTION_CONFIG[activeSection] || SECTION_CONFIG[DEFAULT_SECTION]
        setCurrentSection(activeSection)
        setOpacity(config.opacity)
        setVisibility(config.visibility)
      }
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          sectionRatiosRef.current[entry.target.id] = entry.intersectionRatio
        }
        updateActiveSection()
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    )

    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (el) {
        observerRef.current.observe(el)
      }
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      sectionRatiosRef.current = {}
      clearTimeout(fallbackTimeout)
    }
  }, [])

  return { visibility, currentSection, opacity }
}