'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

interface PoolWallsProps {
  width?: number
  length?: number
  depth?: number
}

export default function PoolWalls({ width = 20, length = 30, depth = 3 }: PoolWallsProps) {
  const wallMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1a4a6e',
        roughness: 0.8,
        metalness: 0.1,
        transparent: true,
        opacity: 0.9,
      }),
    []
  )

  const floorMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0d3a52',
        roughness: 0.9,
        metalness: 0.05,
      }),
    []
  )

  const wallThickness = 0.3
  const halfWidth = width / 2
  const halfLength = length / 2

  return (
    <group position={[0, -depth / 2, 0]}>
      {/* Pool floor */}
      <mesh position={[0, -depth, 0]} rotation={[0, 0, 0]} material={floorMaterial}>
        <boxGeometry args={[width - wallThickness * 2, 0.2, length - wallThickness * 2]} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-halfWidth - wallThickness / 2, 0, 0]} material={wallMaterial}>
        <boxGeometry args={[wallThickness, depth, length]} />
      </mesh>

      {/* Right wall */}
      <mesh position={[halfWidth + wallThickness / 2, 0, 0]} material={wallMaterial}>
        <boxGeometry args={[wallThickness, depth, length]} />
      </mesh>

      {/* Front wall */}
      <mesh position={[0, 0, -halfLength - wallThickness / 2]} material={wallMaterial}>
        <boxGeometry args={[width, depth, wallThickness]} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 0, halfLength + wallThickness / 2]} material={wallMaterial}>
        <boxGeometry args={[width, depth, wallThickness]} />
      </mesh>

      {/* Pool edge/tile - top rim */}
      <mesh position={[0, 0.05, 0]} material={wallMaterial}>
        <boxGeometry args={[width + 1, 0.1, length + 1]} />
      </mesh>
    </group>
  )
}
