'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

interface PoolProps {
  width?: number
  length?: number
  depth?: number
}

export default function Pool({ width = 12, length = 25, depth = 2 }: PoolProps) {
  const laneLines = useMemo(() => {
    const lines = []
    const laneWidth = width / 5
    for (let i = 1; i < 5; i++) {
      lines.push(
        <mesh
          key={i}
          position={[0, -depth + 0.01, -length / 2 + i * laneWidth]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.1, length]} />
          <meshStandardMaterial color="white" opacity={0.6} transparent />
        </mesh>
      )
    }
    return lines
  }, [width, length, depth])

  return (
    <group>
      {/* Pool floor */}
      <mesh position={[0, -depth, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color="#e0f4ff" />
      </mesh>

      {/* Pool walls */}
      {/* Left wall */}
      <mesh position={[-width / 2, -depth / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[length, depth]} />
        <meshStandardMaterial color="#b8daee" />
      </mesh>

      {/* Right wall */}
      <mesh position={[width / 2, -depth / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[length, depth]} />
        <meshStandardMaterial color="#b8daee" />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, -depth / 2, -length / 2]} rotation={[0, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#a0c8e0" />
      </mesh>

      {/* Front wall (glass) */}
      <mesh position={[0, -depth / 2, length / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshPhysicalMaterial
          color="#88c8e8"
          transparent
          opacity={0.3}
          roughness={0}
          metalness={0.1}
          transmission={0.9}
        />
      </mesh>

      {/* Lane lines */}
      {laneLines}

      {/* Pool edge */}
      <mesh position={[0, 0, -length / 2 - 0.1]}>
        <boxGeometry args={[width + 0.4, 0.2, 0.2]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0, length / 2 + 0.1]}>
        <boxGeometry args={[width + 0.4, 0.2, 0.2]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  )
}
