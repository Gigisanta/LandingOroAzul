'use client'

import { memo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { PointLight, DirectionalLight } from 'three'

interface UnderwaterLightsProps {
  isMobile?: boolean
}

function simpleNoise(t: number, seed: number = 0): number {
  const x = Math.sin(t * 0.7 + seed) * 43758.5453
  return (x - Math.floor(x)) * 2 - 1
}

function fbmNoise(t: number, seed: number = 0): number {
  return (
    simpleNoise(t, seed) * 0.5 +
    simpleNoise(t * 2.1, seed + 100) * 0.25 +
    simpleNoise(t * 4.3, seed + 200) * 0.125
  )
}

function UnderwaterLightsInner({ isMobile = false }: UnderwaterLightsProps) {
  const surfaceLight1Ref = useRef<PointLight>(null)
  const surfaceLight2Ref = useRef<PointLight>(null)
  const surfaceLight3Ref = useRef<PointLight>(null)
  const sunRayRef = useRef<DirectionalLight>(null)

  useFrame(({ clock }) => {
    if (isMobile) return
    const t = clock.getElapsedTime()

    if (surfaceLight1Ref.current) {
      surfaceLight1Ref.current.position.x = fbmNoise(t * 0.3, 1) * 4
      surfaceLight1Ref.current.position.z = 3 + fbmNoise(t * 0.2, 2) * 2
      surfaceLight1Ref.current.intensity = 0.4 + fbmNoise(t * 0.5, 3) * 0.15
    }

    if (surfaceLight2Ref.current) {
      surfaceLight2Ref.current.position.x = -4 + fbmNoise(t * 0.25, 10) * 3
      surfaceLight2Ref.current.position.z = -2 + fbmNoise(t * 0.35, 11) * 2
      surfaceLight2Ref.current.intensity = 0.35 + fbmNoise(t * 0.4, 12) * 0.1
    }

    if (surfaceLight3Ref.current) {
      surfaceLight3Ref.current.position.x = 5 + fbmNoise(t * 0.28, 20) * 2.5
      surfaceLight3Ref.current.position.z = -3 + fbmNoise(t * 0.32, 21) * 1.5
      surfaceLight3Ref.current.intensity = 0.5 + fbmNoise(t * 0.45, 22) * 0.15
    }

    if (sunRayRef.current) {
      sunRayRef.current.intensity = 1.3 + Math.sin(t * 0.15) * 0.2
    }
  })

  if (isMobile) {
    return (
      <group>
        <pointLight
          position={[0, 0.5, 0]}
          intensity={0.6}
          color="#4FC3F7"
          distance={12}
          decay={2}
        />
        <pointLight
          position={[0, -2, 0]}
          intensity={0.5}
          color="#01579B"
          distance={10}
          decay={2}
        />
      </group>
    )
  }

  return (
    <group>
      <directionalLight
        ref={sunRayRef}
        position={[10, 30, 5]}
        intensity={1.3}
        color="#E3F2FD"
      />

      <pointLight
        position={[0, -2.5, 0]}
        intensity={0.8}
        color="#01579B"
        distance={15}
        decay={2}
      />

      <pointLight
        position={[0, 0.5, 0]}
        intensity={0.5}
        color="#81D4FA"
        distance={8}
        decay={2}
      />

      <pointLight
        ref={surfaceLight1Ref}
        position={[0, 0.3, 3]}
        intensity={0.45}
        color="#4FC3F7"
        distance={10}
        decay={2}
      />

      <pointLight
        ref={surfaceLight2Ref}
        position={[-4, 0.4, -2]}
        intensity={0.4}
        color="#4FC3F7"
        distance={10}
        decay={2}
      />

      <pointLight
        ref={surfaceLight3Ref}
        position={[5, 0.35, -3]}
        intensity={0.55}
        color="#4FC3F7"
        distance={10}
        decay={2}
      />
    </group>
  )
}

export default memo(UnderwaterLightsInner)
