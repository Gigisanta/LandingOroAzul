'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Lights() {
  const lightRef = useRef<THREE.PointLight>(null)

  useFrame(({ clock }) => {
    if (lightRef.current) {
      const t = clock.getElapsedTime()
      lightRef.current.position.x = Math.sin(t * 0.5) * 2
      lightRef.current.position.z = Math.cos(t * 0.5) * 2
    }
  })

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight
        ref={lightRef}
        position={[0, 5, 0]}
        intensity={0.5}
        color="#00A8E8"
      />
      <pointLight
        position={[-3, 2, -3]}
        intensity={0.3}
        color="#005691"
      />
    </>
  )
}
