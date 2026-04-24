'use client'

import { Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, useScroll } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import Lights from './Lights'
import Pool from './Pool'
import Water from './Water'
import Caustics from './Caustics'
import { useReducedMotion } from '@/hooks/useReducedMotion'

function CameraController() {
  const scroll = useScroll()
  const reducedMotion = useReducedMotion()

  useFrame(() => {
    if (reducedMotion) return

    const p = scroll.offset
    // Camera movement based on scroll
    // Camera starts above and slightly back, moves forward and down
  })

  return null
}

interface SceneProps {
  children?: React.ReactNode
}

function SceneContent({ children }: SceneProps) {
  const reducedMotion = useReducedMotion()

  return (
    <>
      <color attach="background" args={['#0A1628']} />
      <fog attach="fog" args={['#0A1628', 15, 40]} />

      <Lights />

      <group position={[0, 0, 0]}>
        <Pool width={12} length={25} depth={2} />
        <Water width={12} length={25} />
        <Caustics width={12} length={25} depth={2} />
      </group>

      {!reducedMotion && (
        <EffectComposer>
          <Bloom
            intensity={0.5}
            luminanceThreshold={0.6}
            luminanceSmoothing={0.9}
          />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={new THREE.Vector2(0.0005, 0.0005)}
          />
        </EffectComposer>
      )}

      <CameraController />

      {children}
    </>
  )
}

export default function Scene({ children }: SceneProps) {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        shadows
        frameloop="always"
        camera={{ position: [0, 8, 15], fov: 50 }}
        gl={{
          antialias: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <ScrollControls pages={3} damping={0.2}>
            <SceneContent>{children}</SceneContent>
          </ScrollControls>
        </Suspense>
      </Canvas>
    </div>
  )
}
