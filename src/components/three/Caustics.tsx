'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const causticsVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const causticsFragmentShader = `
  uniform float uTime;
  uniform float uIntensity;
  varying vec2 vUv;
  varying vec3 vPosition;

  // Simplex noise function
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    float h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv * 8.0;

    // Multiple overlapping caustics patterns
    float noise1 = snoise(uv + uTime * 0.3);
    float noise2 = snoise(uv * 1.5 - uTime * 0.2);
    float noise3 = snoise(uv * 0.5 + uTime * 0.1);

    // Combine noise patterns
    float caustics = (noise1 + noise2 * 0.5 + noise3 * 0.25) / 1.75;
    caustics = pow(max(caustics, 0.0), 2.0);

    // Light rays from top
    float rays = abs(sin(vUv.x * 10.0 + uTime * 0.5)) * abs(cos(vUv.y * 5.0 - uTime * 0.3));

    // Final intensity
    float intensity = caustics * rays * uIntensity;

    // Color - cyan/turquoise light
    vec3 lightColor = vec3(0.0, 0.66, 0.91);

    gl_FragColor = vec4(lightColor, intensity * 0.4);
  }
`

interface CausticsProps {
  width?: number
  length?: number
  depth?: number
}

export default function Caustics({ width = 12, length = 25, depth = 2 }: CausticsProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: 1.5 },
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
    <mesh
      ref={meshRef}
      position={[0, -depth + 0.1, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[width, length, 1, 1]} />
      <shaderMaterial
        vertexShader={causticsVertexShader}
        fragmentShader={causticsFragmentShader}
        uniforms={uniforms}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}
