'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const fluidWaterVertexShader = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;

  // Gerstner wave function
  vec3 gerstnerWave(vec2 pos, float steepness, float wavelength, vec2 direction, float time) {
    float k = 2.0 * 3.14159 / wavelength;
    float c = sqrt(9.8 / k);
    vec2 d = normalize(direction);
    float a = steepness / k;
    float f = k * (dot(d, pos) - c * time);

    return vec3(
      d.x * a * cos(f),
      a * sin(f),
      d.y * a * cos(f)
    );
  }

  // Gerstner normal calculation
  vec3 gerstnerNormal(vec2 pos, float steepness, float wavelength, vec2 direction, float time) {
    float k = 2.0 * 3.14159 / wavelength;
    float c = sqrt(9.8 / k);
    vec2 d = normalize(direction);
    float a = steepness / k;
    float f = k * (dot(d, pos) - c * time);

    return vec3(
      -(d.x * k * a * sin(f)),
      1.0 - k * a * cos(f),
      -(d.y * k * a * sin(f))
    );
  }

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Layered Gerstner waves - slow, fluid, poolcore aesthetic
    vec3 wave1 = gerstnerWave(pos.xz, 0.08, 25.0, vec2(1.0, 0.3), uTime * 0.4);
    vec3 wave2 = gerstnerWave(pos.xz, 0.05, 15.0, vec2(-0.5, 1.0), uTime * 0.35);
    vec3 wave3 = gerstnerWave(pos.xz, 0.03, 8.0, vec2(0.7, -0.7), uTime * 0.5);
    vec3 wave4 = gerstnerWave(pos.xz, 0.02, 4.0, vec2(-0.3, -0.9), uTime * 0.6);

    vec3 totalWave = wave1 + wave2 + wave3 + wave4;
    pos.x += totalWave.x;
    pos.y += totalWave.y;
    pos.z += totalWave.z;

    // Calculate normal from waves
    vec3 n1 = gerstnerNormal(position.xz, 0.08, 25.0, vec2(1.0, 0.3), uTime * 0.4);
    vec3 n2 = gerstnerNormal(position.xz, 0.05, 15.0, vec2(-0.5, 1.0), uTime * 0.35);
    vec3 n3 = gerstnerNormal(position.xz, 0.03, 8.0, vec2(0.7, -0.7), uTime * 0.5);
    vec3 n4 = gerstnerNormal(position.xz, 0.02, 4.0, vec2(-0.3, -0.9), uTime * 0.6);

    vNormal = normalize(n1 + n2 + n3 + n4);
    vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fluidWaterFragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec3 uWaterColor;
  uniform vec3 uDeepColor;
  uniform vec3 uSunColor;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    vec3 normal = normalize(vNormal);

    // Sun direction
    vec3 sunDir = normalize(vec3(40.0, 55.0, 25.0));

    // Fresnel - more reflection at grazing angles
    float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 4.0);
    fresnel = mix(0.02, 1.0, fresnel);

    // Specular highlight - smooth
    vec3 halfDir = normalize(sunDir + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), 128.0);

    // Sun disk reflection - sharp sparkle
    vec3 reflectDir = reflect(-sunDir, normal);
    float sunReflect = pow(max(dot(viewDir, reflectDir), 0.0), 200.0);

    // Base water color - poolcore clean aqua
    vec3 color = uWaterColor;

    // Add depth variation
    float depth = smoothstep(-0.5, 0.5, vWorldPosition.y);
    color = mix(uDeepColor, color, depth);

    // Fresnel reflection - sky color
    vec3 skyColor = vec3(0.7, 0.9, 1.0);
    color = mix(color, skyColor, fresnel * 0.4);

    // Specular glow
    color += uSunColor * spec * 2.0;

    // Sun sparkle - enhanced with noise for more natural shimmer
    float sparkleNoise = noise(vUv * 80.0 + uTime * 2.0) * 0.5 + 0.5;
    float sunSparkle = sunReflect * sparkleNoise;
    color += vec3(1.0, 0.98, 0.95) * sunSparkle * 3.0;

    // Enhanced caustic shimmer - poolcore style
    float shimmer1 = sin(vUv.x * 40.0 + uTime * 1.5) * sin(vUv.y * 40.0 + uTime * 1.2);
    float shimmer2 = sin(vUv.x * 30.0 - uTime * 1.0) * sin(vUv.y * 40.0 + uTime * 1.3);
    float shimmer3 = sin((vUv.x + vUv.y) * 25.0 + uTime * 0.8);
    float shimmer = (shimmer1 + shimmer2 + shimmer3 * 0.5) * 0.5 * 0.04;
    color += vec3(0.25, 0.45, 0.55) * shimmer;

    // Secondary noise-based caustics for depth
    float caustic = noise(vUv * 15.0 + uTime * 0.3);
    caustic = pow(caustic, 2.0) * 0.08;
    color += vec3(0.2, 0.4, 0.5) * caustic;

    // Soft foam at peaks (subtle)
    float foam = smoothstep(0.08, 0.15, vWorldPosition.y) * 0.15;
    color = mix(color, vec3(1.0), foam);

    float alpha = 0.92;

    gl_FragColor = vec4(color, alpha);
  }
`

export default function MinimalWater() {
  const meshRef = useRef<THREE.Mesh>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uWaterColor: { value: new THREE.Color('#4FC3F7') },
      uDeepColor: { value: new THREE.Color('#0288D1') },
      uSunColor: { value: new THREE.Color('#FFF8E0') },
    }),
    []
  )

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial
      material.uniforms.uTime.value = clock.getElapsedTime()
    }
  })

  useEffect(() => {
    return () => {
      if (meshRef.current) {
        meshRef.current.geometry.dispose()
        ;(meshRef.current.material as THREE.ShaderMaterial).dispose()
      }
    }
  }, [])

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[400, 400, 32, 32]} />
      <shaderMaterial
        vertexShader={fluidWaterVertexShader}
        fragmentShader={fluidWaterFragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
