'use client'

import { useState, useEffect, useCallback } from 'react'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  const updateProgress = useCallback(() => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
    const currentProgress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0
    setProgress(Math.min(currentProgress, 100))
  }, [])

  useEffect(() => {
    // Use requestAnimationFrame for smooth updates
    let rafId: number
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      // Only update if scroll position changed meaningfully
      if (Math.abs(window.scrollY - lastScrollY) > 1) {
        lastScrollY = window.scrollY
        rafId = requestAnimationFrame(updateProgress)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    updateProgress() // Initial update

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [updateProgress])

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[70] h-[3px] pointer-events-none"
      role="progressbar"
      aria-label="Progreso de scroll"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full will-change-[width]"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, var(--color-turquoise), var(--color-primary))',
          boxShadow: '0 0 10px var(--color-turquoise), 0 0 5px var(--color-turquoise)',
          transition: 'width 50ms linear',
        }}
      />
    </div>
  )
}