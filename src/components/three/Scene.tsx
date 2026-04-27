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
  const [dpr, setDpr] = useState(1)
  const [isMobile, setIsMobile] = useState(false)
  const [docSize, setDocSize] = useState({ width: 600, height: 600 })
  const containerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const { opacity } = useWaterVisibility()

  useEffect(() => {
    const mobile = isMobileDevice()
    setIsMobile(mobile)
    // Mobile: cap at 1, desktop: cap at 1.5
    setDpr(mobile ? 1 : Math.min(window.devicePixelRatio, 1.5))
  }, [])

  useEffect(() => {
    const updateSize = () => {
      const width = Math.max(window.innerWidth, document.body.scrollWidth) * 1.5
      const height = Math.max(window.innerHeight, document.body.scrollHeight) * 1.5
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
        camera={{ position: [0, 14, 24], fov: isMobile ? 65 : 55 }}
        dpr={[1, dpr]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: isMobile ? 'default' : 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >

        <ambientLight intensity={isMobile ? 1.0 : 1.5} color="#ffffff" />

        <directionalLight
          position={[40, 55, 25]}
          intensity={isMobile ? 1.8 : 2.8}
          color="#FFF8E0"
          castShadow={!isMobile}
          shadow-mapSize={[512, 512]}
          shadow-camera-far={150}
          shadow-camera-left={isMobile ? -30 : -50}
          shadow-camera-right={isMobile ? 30 : 50}
          shadow-camera-top={isMobile ? 30 : 50}
          shadow-camera-bottom={isMobile ? -30 : -50}
        />

        {!isMobile && (
          <>
            <directionalLight
              position={[-25, 35, 20]}
              intensity={0.8}
              color="#E0F0FF"
            />

            <directionalLight
              position={[0, 25, -35]}
              intensity={0.45}
              color="#F0F8FF"
            />

            <pointLight
              position={[20, 10, 15]}
              intensity={1.5}
              color="#FFE4B5"
              distance={60}
              decay={2}
            />

            <pointLight
              position={[-15, 5, 5]}
              intensity={0.6}
              color="#B8E8FF"
              distance={40}
              decay={2}
            />
          </>
        )}

        <AnimatedPool isMobile={isMobile} reducedMotion={reducedMotion} docSize={docSize} opacity={opacity} />

        {!isMobile && (
          <EffectComposer>
            <Bloom
              intensity={0.15}
              luminanceThreshold={0.9}
              luminanceSmoothing={0.7}
              mipmapBlur
            />
          </EffectComposer>
        )}
      </Canvas>
      {children}
    </div>
  )
}
