'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import MinimalWater from './MinimalWater'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useWaterVisibility } from '@/hooks/useWaterVisibility'

function isMobileDevice() {
  if (typeof window === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

function getWebGLSupport() {
  try {
    const canvas = document.createElement('canvas')
    const gl2 = canvas.getContext('webgl2')
    if (gl2) return { supported: true, version: 2 }
    const gl1 = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (gl1) return { supported: true, version: 1 }
    return { supported: false, version: 0 }
  } catch {
    return { supported: false, version: 0 }
  }
}

function isLowPerformanceDevice() {
  if (typeof window === 'undefined') return false
  const nav = navigator as Navigator & { deviceMemory?: number }
  return (
    nav.deviceMemory !== undefined && nav.deviceMemory < 4
  ) || /iPhone|iPad/.test(navigator.userAgent)
}

export default function WaterCanvas() {
  const reducedMotion = useReducedMotion()
  const { opacity } = useWaterVisibility()
  const [isVisible, setIsVisible] = useState(true)
  const [webglInfo, setWebglInfo] = useState({ supported: false, version: 0 })
  const [contextLost, setContextLost] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const { isMobile, isLowPerf, dpr } = useMemo(() => {
    if (typeof window === 'undefined') return { isMobile: false, isLowPerf: false, dpr: 1 }
    const mobile = isMobileDevice()
    const lowPerf = isLowPerformanceDevice()
    return {
      isMobile: mobile,
      isLowPerf: lowPerf,
      dpr: Math.min(window.devicePixelRatio, mobile ? 1 : 1.5),
    }
  }, [])

  useEffect(() => {
    setWebglInfo(getWebGLSupport())
  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const shouldReloadRef = useRef(false)
  const reloadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const handleContextLost = useCallback((e: Event) => {
    e.preventDefault()
    shouldReloadRef.current = true
    setContextLost(true)
    if (reloadTimeoutRef.current) clearTimeout(reloadTimeoutRef.current)
  }, [])

  const handleContextRestored = useCallback(() => {
    if (shouldReloadRef.current) {
      shouldReloadRef.current = false
      window.location.reload()
    }
  }, [])

  const handleCanvasCreated = useCallback(({ gl }: { gl: { domElement: HTMLCanvasElement } }) => {
    const canvas = gl.domElement
    canvasRef.current = canvas
    canvas.addEventListener('webglcontextlost', handleContextLost, false)
    canvas.addEventListener('webglcontextrestored', handleContextRestored, false)
  }, [handleContextLost, handleContextRestored])

  useEffect(() => {
    return () => {
      if (reloadTimeoutRef.current) {
        clearTimeout(reloadTimeoutRef.current)
      }
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('webglcontextlost', handleContextLost)
        canvasRef.current.removeEventListener('webglcontextrestored', handleContextRestored)
      }
    }
  }, [handleContextLost, handleContextRestored])

  const showFallback = !webglInfo.supported || contextLost
  const showCanvas = webglInfo.supported && isVisible && !contextLost

  return (
    <div
      ref={containerRef}
      className="fixed z-[1]"
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#0A1628',
      }}
    >
      {showFallback && !showCanvas && (
        <div className="absolute inset-0 fallback-bg" style={{ pointerEvents: 'none' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] via-[#0D2137] to-[#0A1628] opacity-60" />
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 100% 80% at 50% 30%, rgba(0, 180, 216, 0.2) 0%, transparent 60%)',
            }}
          />
        </div>
      )}

      {showCanvas && (
        <Canvas
          camera={{ position: [0, 45, 35], fov: 65 }}
          dpr={dpr}
          gl={{
            antialias: !isMobile && !isLowPerf,
            alpha: true,
            powerPreference: 'default',
            failIfMajorPerformanceCaveat: false,
          }}
          style={{ pointerEvents: 'none', background: 'transparent' }}
          onCreated={({ gl, scene }) => {
            gl.setClearColor(0x000000, 0)
            handleCanvasCreated({ gl })
          }}
          frameloop={reducedMotion ? 'demand' : 'always'}
          performance={{ min: 0.25 }}
        >
          <directionalLight
            position={[30, 80, 20]}
            intensity={2.5}
            color="#FFFAF0"
          />
          <directionalLight
            position={[-20, 40, -10]}
            intensity={0.8}
            color="#E6F4FF"
          />
          <ambientLight intensity={0.3} color="#B3E5FC" />
          <pointLight
            position={[0, -2.5, 0]}
            intensity={1.0}
            color="#0288D1"
            distance={30}
            decay={2}
          />
          <pointLight
            position={[0, 0.5, 0]}
            intensity={0.4}
            color="#81D4FA"
            distance={20}
            decay={2}
          />
          <MinimalWater
            isMobile={isMobile || isLowPerf}
            reducedMotion={reducedMotion}
            opacity={opacity}
          />
        </Canvas>
      )}
    </div>
  )
}