'use client'

import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import MinimalWater from './MinimalWater'
import UnderwaterLights from './UnderwaterLights'

interface SceneProps {
  children?: React.ReactNode
}

function AnimatedPool() {
  return (
    <group>
      <MinimalWater />
      <UnderwaterLights />
    </group>
  )
}

export default function Scene({ children }: SceneProps) {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 12, 22], fov: 58 }}
        dpr={[1, Math.min(window.devicePixelRatio, 1.5)]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        style={{
          background: 'linear-gradient(180deg, #00A5B5 0%, #00CED1 30%, #00E0DA 60%, #7FDBDB 100%)'
        }}
      >
        <fog attach="fog" args={['#00CED1', 100, 280]} />

        <ambientLight intensity={1.5} color="#ffffff" />

        <directionalLight
          position={[40, 55, 25]}
          intensity={2.8}
          color="#FFF8E0"
        />

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

        <AnimatedPool />
      </Canvas>
      {children}
    </div>
  )
}
