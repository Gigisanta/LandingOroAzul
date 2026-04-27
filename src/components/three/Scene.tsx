'use client'

import { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import MinimalWater from './MinimalWater'
import UnderwaterLights from './UnderwaterLights'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useWaterVisibility } from '@/hooks/useWaterVisibility'

interface SceneProps {
  children?: React.ReactNode
}

function AnimatedPool({ isMobile, reducedMotion, docSize, opacity }: { isMobile: boolean; reducedMotion: boolean; docSize: { width: number; height: number }; opacity: number }) {
  return (
    <group>
      <MinimalWater isMobile={isMobile} reducedMotion={reducedMotion} docSize={docSize} opacity={opacity} />
      {!isMobile && <UnderwaterLights />}
    </group>
  )
}

function isMobileDevice() {
  if (typeof window === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export default function Scene({ children }: SceneProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [docSize, setDocSize] = useState({ width: 600, height: 600 })
  const containerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const { opacity } = useWaterVisibility()

  useEffect(() => {
    const mobile = isMobileDevice()
    setIsMobile(mobile)
  }, [])

  useEffect(() => {
    const updateSize = () => {
      const width = Math.max(window.innerWidth, document.body.scrollWidth) * 1.2
      const height = Math.max(window.innerHeight, document.body.scrollHeight) * 1.2
      setDocSize({ width, height })
      if (containerRef.current) {
        containerRef.current.style.height = `${document.body.scrollHeight}px`
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10"
      style={{
        width: '100vw',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0D3D4D 0%, #0D3D4D 15%, #0A5C6A 30%, #00B4C8 45%, #00CED1 60%, #40E0D0 75%, #7FDBDB 100%)'
      }}
    >
      <Canvas
        camera={{ position: [0, 12, 22], fov: isMobile ? 65 : 55 }}
        dpr={1}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'low-power',
        }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={isMobile ? 0.8 : 1.0} color="#ffffff" />

        <directionalLight
          position={[40, 55, 25]}
          intensity={isMobile ? 1.5 : 2.2}
          color="#FFF8E0"
        />

        {!isMobile && (
          <directionalLight
            position={[-25, 35, 20]}
            intensity={0.5}
            color="#E0F0FF"
          />
        )}

        <AnimatedPool isMobile={isMobile} reducedMotion={reducedMotion} docSize={docSize} opacity={opacity} />

        {!isMobile && !reducedMotion && (
          <EffectComposer>
            <Bloom
              intensity={0.2}
              luminanceThreshold={0.8}
              luminanceSmoothing={0.4}
              mipmapBlur
            />
          </EffectComposer>
        )}
      </Canvas>
      {children}
    </div>
  )
}
