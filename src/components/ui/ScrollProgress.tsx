'use client'

import { useState, useEffect } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const currentProgress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0
      setProgress(Math.min(currentProgress, 100))
    }

    window.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress()
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

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
        className="h-full transition-all duration-75 ease-out"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, var(--color-turquoise), var(--color-primary))',
          boxShadow: '0 0 10px var(--color-turquoise), 0 0 5px var(--color-turquoise)',
        }}
      />
    </div>
  )
}