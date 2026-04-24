'use client'

import { useMemo, useEffect } from 'react'
import * as THREE from 'three'

interface PoolEnvironmentProps {
  reducedMotion?: boolean
}

export default function PoolEnvironment({ reducedMotion }: PoolEnvironmentProps) {
  const poolWidth = 30
  const poolLength = 40
  const poolDepth = 3.2
  const wallThickness = 1.2

  const tileMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f0f8fa',
        roughness: 0.1,
        metalness: 0.2,
      }),
    []
  )

  const floorTileMaterialLight = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#c8e0e8',
        roughness: 0.15,
        metalness: 0.15,
      }),
    []
  )

  const floorTileMaterialDark = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#b8d8e0',
        roughness: 0.15,
        metalness: 0.15,
      }),
    []
  )

  const cyanLineMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#00A8E8',
        roughness: 0.15,
        metalness: 0.3,
        emissive: '#005577',
        emissiveIntensity: 0.25,
      }),
    []
  )

  const floorMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#d0e8f0',
        roughness: 0.18,
        metalness: 0.25,
      }),
    []
  )

  const rimMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.2,
        metalness: 0.1,
      }),
    []
  )

  const laneLineMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#00A8E8',
        roughness: 0.1,
        metalness: 0.5,
        emissive: '#006699',
        emissiveIntensity: 0.4,
      }),
    []
  )

  const halfWidth = poolWidth / 2
  const halfLength = poolLength / 2

  // Dispose all Three.js resources on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      tileMaterial.dispose()
      floorTileMaterialLight.dispose()
      floorTileMaterialDark.dispose()
      cyanLineMaterial.dispose()
      floorMaterial.dispose()
      rimMaterial.dispose()
      laneLineMaterial.dispose()
    }
  }, [])

  return (
    <group>
      {/* Pool floor */}
      <mesh position={[0, -poolDepth + 0.12, 0]} material={floorMaterial}>
        <boxGeometry args={[poolWidth - wallThickness * 2, 0.25, poolLength - wallThickness * 2]} />
      </mesh>

      {/* Elegant floor tile pattern - using memoized materials */}
      {Array.from({ length: 8 }).map((_, i) =>
        Array.from({ length: 12 }).map((_, j) => (
          <mesh
            key={`floor-tile-${i}-${j}`}
            position={[
              -halfWidth + 2.5 + i * 3,
              -poolDepth + 0.26,
              -halfLength + 2 + j * 2.5
            ]}
            material={(i + j) % 2 === 0 ? floorTileMaterialLight : floorTileMaterialDark}
          >
            <boxGeometry args={[2.6, 0.012, 2.2]} />
          </mesh>
        ))
      )}

      {/* Clean lane dividers */}
      {[1, 2, 3, 4].map((i) => (
        <mesh
          key={`lane-${i}`}
          position={[-halfWidth + (poolWidth / 5) * i, -poolDepth + 0.26, 0]}
          material={laneLineMaterial}
        >
          <boxGeometry args={[0.05, 0.012, poolLength - wallThickness * 2 - 3]} />
        </mesh>
      ))}

      {/* LEFT WALL */}
      <mesh position={[-halfWidth - wallThickness / 2, -poolDepth / 2, 0]} material={tileMaterial}>
        <boxGeometry args={[wallThickness, poolDepth, poolLength + wallThickness]} />
      </mesh>
      {/* Left wall elegant lines */}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh
          key={`left-line-${i}`}
          position={[-halfWidth - wallThickness / 2 - 0.01, -poolDepth + (poolDepth / 4) * (i + 0.5), 0]}
          material={cyanLineMaterial}
        >
          <boxGeometry args={[0.04, 0.05, poolLength - 3]} />
        </mesh>
      ))}

      {/* RIGHT WALL */}
      <mesh position={[halfWidth + wallThickness / 2, -poolDepth / 2, 0]} material={tileMaterial}>
        <boxGeometry args={[wallThickness, poolDepth, poolLength + wallThickness]} />
      </mesh>
      {/* Right wall elegant lines */}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh
          key={`right-line-${i}`}
          position={[halfWidth + wallThickness / 2 + 0.01, -poolDepth + (poolDepth / 4) * (i + 0.5), 0]}
          material={cyanLineMaterial}
        >
          <boxGeometry args={[0.04, 0.05, poolLength - 3]} />
        </mesh>
      ))}

      {/* FRONT WALL */}
      <mesh position={[0, -poolDepth / 2, -halfLength - wallThickness / 2]} material={tileMaterial}>
        <boxGeometry args={[poolWidth + wallThickness * 2, poolDepth, wallThickness]} />
      </mesh>

      {/* BACK WALL */}
      <mesh position={[0, -poolDepth / 2, halfLength + wallThickness / 2]} material={tileMaterial}>
        <boxGeometry args={[poolWidth + wallThickness * 2, poolDepth, wallThickness]} />
      </mesh>

      {/* Clean pool rim - white edge */}
      <mesh position={[-halfWidth - wallThickness / 2 + 0.6, 0.1, 0]} material={rimMaterial}>
        <boxGeometry args={[0.6, 0.16, poolLength + wallThickness * 2 + 0.6 * 2]} />
      </mesh>
      <mesh position={[halfWidth + wallThickness / 2 - 0.6, 0.1, 0]} material={rimMaterial}>
        <boxGeometry args={[0.6, 0.16, poolLength + wallThickness * 2 + 0.6 * 2]} />
      </mesh>
      <mesh position={[0, 0.1, -halfLength - wallThickness / 2 + 0.6]} material={rimMaterial}>
        <boxGeometry args={[poolWidth + wallThickness * 2, 0.16, 0.6]} />
      </mesh>
      <mesh position={[0, 0.1, halfLength + wallThickness / 2 - 0.6]} material={rimMaterial}>
        <boxGeometry args={[poolWidth + wallThickness * 2, 0.16, 0.6]} />
      </mesh>

      {/* Single starting block */}
      <mesh position={[-halfWidth + 1.8, 0.3, -halfLength + 0.8]} material={tileMaterial}>
        <boxGeometry args={[1, 0.5, 0.7]} />
      </mesh>

      {/* Elegant ladder */}
      <group position={[halfWidth + 0.2, 0, halfLength - 2.5]}>
        <mesh position={[0, 1, 0]} material={cyanLineMaterial}>
          <cylinderGeometry args={[0.04, 0.04, 2.2, 8]} />
        </mesh>
        <mesh position={[0, 1.4, -0.35]} rotation={[0, 0, Math.PI / 2]} material={cyanLineMaterial}>
          <cylinderGeometry args={[0.03, 0.03, 0.7, 8]} />
        </mesh>
        <mesh position={[0, 0.7, -0.18]} rotation={[0, 0, Math.PI / 2]} material={cyanLineMaterial}>
          <cylinderGeometry args={[0.03, 0.03, 0.7, 8]} />
        </mesh>
        <mesh position={[0, 0.1, -0.35]} rotation={[0, 0, Math.PI / 2]} material={cyanLineMaterial}>
          <cylinderGeometry args={[0.03, 0.03, 0.7, 8]} />
        </mesh>
      </group>

      {/* Soft underwater glow */}
      <mesh position={[0, -poolDepth + 0.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[poolWidth - wallThickness * 2 - 3, poolLength - wallThickness * 2 - 3]} />
        <meshBasicMaterial
          color="#00DDFF"
          transparent
          opacity={0.12}
        />
      </mesh>
    </group>
  )
}
