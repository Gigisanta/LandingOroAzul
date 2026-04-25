'use client'

import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import MinimalWater from './MinimalWater'
import UnderwaterLights from './UnderwaterLights'

interface SceneProps {
  children?: React.ReactNode
}

function AnimatedPool({ isMobile }: { isMobile: boolean }) {
  return (
    <group>
      <MinimalWater isMobile={isMobile} />
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

  useEffect(() => {
    const mobile = isMobileDevice()
    setIsMobile(mobile)
    // Mobile: cap at 1, desktop: cap at 1.5
    setDpr(mobile ? 1 : Math.min(window.devicePixelRatio, 1.5))
  }, [])

  return (
    <div className="fixed inset-0 -z-10" style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        camera={{ position: [0, 14, 24], fov: isMobile ? 65 : 55 }}
        dpr={[1, dpr]}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: isMobile ? 'low-power' : 'high-performance',
        }}
        style={{
          background: 'linear-gradient(180deg, #006080 0%, #00A5B5 25%, #00CED1 50%, #40E0D0 75%, #7FDBDB 100%)'
        }}
      >
        <fog attach="fog" args={['#0088A0', 80, 100]} />

        <ambientLight intensity={isMobile ? 1.0 : 1.5} color="#ffffff" />

        <directionalLight
          position={[40, 55, 25]}
          intensity={isMobile ? 1.8 : 2.8}
          color="#FFF8E0"
          castShadow={!isMobile}
          shadow-mapSize={[isMobile ? 512 : 1024, isMobile ? 512 : 1024]}
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

        <AnimatedPool isMobile={isMobile} />

        {!isMobile && (
          <EffectComposer>
            <Bloom
              intensity={0.4}
              luminanceThreshold={0.8}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
          </EffectComposer>
        )}
      </Canvas>
      {children}
    </div>
  )
}
