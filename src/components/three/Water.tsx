'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const waterVertexShader = `
  uniform float uTime;
  uniform float uWaveHeight;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Gerstner waves
    float wave1 = sin(pos.x * 2.0 + uTime * 1.5) * uWaveHeight;
    float wave2 = sin(pos.z * 1.5 + uTime * 1.2) * uWaveHeight * 0.7;
    float wave3 = sin((pos.x + pos.z) * 1.0 + uTime * 0.8) * uWaveHeight * 0.5;
    float wave4 = cos(pos.x * 3.0 - uTime * 2.0) * uWaveHeight * 0.3;

    pos.y += wave1 + wave2 + wave3 + wave4;
    vElevation = pos.y;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const waterFragmentShader = `
  uniform float uTime;
  uniform vec3 uDeepColor;
  uniform vec3 uSurfaceColor;
  uniform vec3 uFoamColor;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    // Mix colors based on elevation
    float mixStrength = (vElevation + 0.3) * 2.0;
    vec3 color = mix(uDeepColor, uSurfaceColor, mixStrength);

    // Add foam on peaks
    float foam = smoothstep(0.15, 0.25, vElevation);
    color = mix(color, uFoamColor, foam * 0.3);

    // Subtle caustics pattern
    float caustics = sin(vUv.x * 20.0 + uTime) * sin(vUv.y * 20.0 + uTime * 0.7) * 0.1;
    color += vec3(caustics);

    // Fresnel effect at edges
    float fresnel = pow(1.0 - abs(dot(vec3(0.0, 1.0, 0.0), normalize(vec3(vUv.x - 0.5, 1.0, vUv.y - 0.5)))), 2.0);
    color += vec3(0.1, 0.2, 0.3) * fresnel;

    gl_FragColor = vec4(color, 0.85);
  }
`

interface WaterProps {
  width?: number
  length?: number
}

export default function Water({ width = 12, length = 25 }: WaterProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uWaveHeight: { value: 0.08 },
      uDeepColor: { value: new THREE.Color('#005691') },
      uSurfaceColor: { value: new THREE.Color('#00A8E8') },
      uFoamColor: { value: new THREE.Color('#ffffff') },
    }),
    []
  )

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial
      material.uniforms.uTime.value = clock.getElapsedTime()
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[width, length, 64, 64]} />
      <shaderMaterial
        vertexShader={waterVertexShader}
        fragmentShader={waterFragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
