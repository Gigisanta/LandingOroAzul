'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh, ShaderMaterial } from 'three'
import { Color } from 'three'

// ═══════════════════════════════════════════════════════════════════════════════
// OPTIMIZED WATER SHADER - Balance quality & performance
// 3 Gerstner waves, single-layer caustics, efficient FBM
// ═══════════════════════════════════════════════════════════════════════════════

const desktopVertexShader = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying float vWaveHeight;

  // Optimized Gerstner - inline for performance (no function call overhead)
  vec3 gerstnerWave(vec2 pos, float amp, float wave, vec2 dir, float speed, float time) {
    float k = 6.28318 / wave;
    float c = sqrt(9.8 / k);
    vec2 d = normalize(dir);
    float f = k * (dot(d, pos) - c * speed * time);
    return vec3(d.x * amp * cos(f), amp * sin(f), d.y * amp * cos(f));
  }

  void main() {
    vUv = uv;
    vec3 pos = position;

    // 3 waves only - blend creates complex motion
    vec3 wave1 = gerstnerWave(pos.xz, 0.10, 28.0, vec2(1.0, 0.3), 0.4, uTime);
    vec3 wave2 = gerstnerWave(pos.xz, 0.06, 15.0, vec2(-0.5, 0.9), 0.5, uTime);
    vec3 wave3 = gerstnerWave(pos.xz, 0.03, 7.0, vec2(0.7, -0.6), 0.65, uTime);

    vec3 totalWave = wave1 + wave2 + wave3;
    pos.x += totalWave.x;
    pos.y += totalWave.y;
    pos.z += totalWave.z;

    vWaveHeight = totalWave.y;

    // Analytical normals - single pass calculation
    float k1 = 6.28318 / 28.0;
    float k2 = 6.28318 / 15.0;
    float k3 = 6.28318 / 7.0;

    vec2 d1 = normalize(vec2(1.0, 0.3));
    vec2 d2 = normalize(vec2(-0.5, 0.9));
    vec2 d3 = normalize(vec2(0.7, -0.6));

    float f1 = k1 * (dot(d1, pos.xz) - sqrt(9.8 / k1) * 0.4 * uTime);
    float f2 = k2 * (dot(d2, pos.xz) - sqrt(9.8 / k2) * 0.5 * uTime);
    float f3 = k3 * (dot(d3, pos.xz) - sqrt(9.8 / k3) * 0.65 * uTime);

    vec3 n = vec3(
      -(d1.x * k1 * 0.10 * cos(f1)) - (d2.x * k2 * 0.06 * cos(f2)) - (d3.x * k3 * 0.03 * cos(f3)),
      1.0 - (k1 * 0.10 * sin(f1)) - (k2 * 0.06 * sin(f2)) - (k3 * 0.03 * sin(f3)),
      -(d1.y * k1 * 0.10 * cos(f1)) - (d2.y * k2 * 0.06 * cos(f2)) - (d3.y * k3 * 0.03 * cos(f3))
    );

    vNormal = normalize(n);
    vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const desktopFragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec3 uWaterColor;
  uniform vec3 uDeepColor;
  uniform vec3 uSunColor;
  uniform float uOpacity;

  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying float vWaveHeight;

  // Fast hash
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  // Optimized noise - 3 octaves max
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

  // 3-octave FBM - efficient
  float fbm(vec2 p) {
    float v = noise(p) * 0.5;
    v += noise(p * 2.0) * 0.25;
    v += noise(p * 4.0) * 0.125;
    return v;
  }

  // Single-layer voronoi caustics - simple but effective
  float caustic(vec2 p, float time) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float minDist = 1.0;

    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 n = vec2(float(x), float(y));
        vec2 seed = vec2(hash(i + n + vec2(0.5)), hash(i + n + vec2(0.3)));
        vec2 animated = seed * 0.5 + 0.25 + 0.08 * vec2(sin(time * 0.5 + seed.x * 6.28));
        float d = length(n + animated - f);
        minDist = min(minDist, d);
      }
    }
    return pow(1.0 - minDist, 2.5);
  }

  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    vec3 normal = normalize(vNormal);

    // Subtle micro-detail via noise perturbation
    float nx = noise(vUv * 8.0 + uTime * 0.05);
    float nz = noise(vUv * 8.0 + uTime * 0.05 + vec2(17.3));
    normal.x += (nx - 0.5) * 0.06;
    normal.z += (nz - 0.5) * 0.06;
    normal = normalize(normal);

    // Sun
    vec3 sunDir = normalize(vec3(0.5, 0.8, 0.3));
    vec3 sunCol = vec3(1.0, 0.95, 0.88);

    // Fresnel
    float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 4.0);
    fresnel = mix(0.03, 1.0, fresnel);

    // Base color with depth
    float depth = smoothstep(-0.15, 0.25, vWaveHeight);
    vec3 color = mix(uDeepColor, uWaterColor, depth);

    // SSS - subtle warm glow
    float sss = pow(max(dot(viewDir, -sunDir), 0.0), 3.0);
    color += vec3(0.08, 0.45, 0.5) * sss * 0.35;

    // Sky reflection
    vec3 skyColor = mix(vec3(0.62, 0.75, 0.82), vec3(0.72, 0.84, 0.90), fresnel * 0.4 + 0.2);
    color = mix(color, skyColor, fresnel * 0.32);

    // Diffuse lighting
    float NdotL = max(dot(normal, sunDir), 0.0);
    color += sunCol * NdotL * 0.28;

    // Specular highlight
    vec3 halfDir = normalize(sunDir + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), 180.0);
    color += sunCol * spec * 1.4;

    // Sun sparkle - single efficient calculation
    vec3 reflectDir = reflect(-sunDir, normal);
    float sparkle = pow(max(dot(viewDir, reflectDir), 0.0), 400.0);
    float sparkleNoise = noise(vUv * 60.0 + uTime * 1.2) * 0.4 + 0.7;
    color += sunCol * sparkle * sparkleNoise * 1.8;

    // Single-layer caustics
    float caust = caustic(vUv * 5.0, uTime * 0.4);
    color += vec3(0.25, 0.55, 0.65) * caust * 0.18;

    // Secondary FBM caustics - light
    float fbmCaust = fbm(vUv * 8.0 + uTime * 0.35);
    color += vec3(0.18, 0.42, 0.52) * pow(fbmCaust, 1.6) * 0.1;

    // Foam - simple height-based
    float foam = smoothstep(0.04, 0.10, vWaveHeight) * 0.35;
    foam *= noise(vUv * 20.0 + uTime * 0.5) * 0.4 + 0.7;
    color = mix(color, vec3(1.0, 1.0, 0.96), foam * 0.55);

    // Soft edge fade
    float edge = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x);
    edge *= smoothstep(0.0, 0.1, vUv.y) * smoothstep(1.0, 0.9, vUv.y);

    gl_FragColor = vec4(color, 0.60 * edge * uOpacity);
  }
`

// ═══════════════════════════════════════════════════════════════════════════════
// MOBILE SHADER - Ultra simplified for performance
// ═══════════════════════════════════════════════════════════════════════════════
const mobileVertexShader = /* glsl */ `
  precision mediump float;
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying float vWaveHeight;

  vec3 gerstnerWave(vec2 pos, float amp, float wave, vec2 dir, float speed, float time) {
    float k = 6.28318 / wave;
    float c = sqrt(9.8 / k);
    vec2 d = normalize(dir);
    float f = k * (dot(d, pos) - c * speed * time);
    return vec3(d.x * amp * cos(f), amp * sin(f), d.y * amp * cos(f));
  }

  void main() {
    vUv = uv;
    vec3 pos = position;

    vec3 w1 = gerstnerWave(pos.xz, 0.08, 22.0, vec2(1.0, 0.3), 0.4, uTime);
    vec3 w2 = gerstnerWave(pos.xz, 0.05, 12.0, vec2(-0.5, 0.9), 0.5, uTime);

    vec3 total = w1 + w2;
    pos.x += total.x;
    pos.y += total.y;
    pos.z += total.z;

    vWaveHeight = total.y;

    float k1 = 6.28318 / 22.0;
    float k2 = 6.28318 / 12.0;
    vec2 d1 = normalize(vec2(1.0, 0.3));
    vec2 d2 = normalize(vec2(-0.5, 0.9));
    float f1 = k1 * (dot(d1, pos.xz) - sqrt(9.8 / k1) * 0.4 * uTime);
    float f2 = k2 * (dot(d2, pos.xz) - sqrt(9.8 / k2) * 0.5 * uTime);

    vec3 n = vec3(
      -(d1.x * k1 * 0.08 * cos(f1)) - (d2.x * k2 * 0.05 * cos(f2)),
      1.0 - (k1 * 0.08 * sin(f1)) - (k2 * 0.05 * sin(f2)),
      -(d1.y * k1 * 0.08 * cos(f1)) - (d2.y * k2 * 0.05 * cos(f2))
    );

    vNormal = normalize(n);
    vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const mobileFragmentShader = /* glsl */ `
  precision mediump float;

  uniform float uTime;
  uniform vec3 uWaterColor;
  uniform vec3 uDeepColor;
  uniform vec3 uSunColor;
  uniform float uOpacity;

  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying float vWaveHeight;

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

  float caustic(vec2 p, float time) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float minDist = 1.0;
    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 n = vec2(float(x), float(y));
        vec2 seed = vec2(hash(i + n + vec2(0.5)), hash(i + n + vec2(0.3)));
        vec2 animated = seed * 0.5 + 0.25 + 0.06 * vec2(sin(time * 0.4 + seed.x * 6.28));
        float d = length(n + animated - f);
        minDist = min(minDist, d);
      }
    }
    return pow(1.0 - minDist, 2.5);
  }

  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    vec3 normal = normalize(vNormal);

    // Minimal perturbation
    float nx = noise(vUv * 6.0 + uTime * 0.04);
    normal.x += (nx - 0.5) * 0.04;
    normal = normalize(normal);

    vec3 sunDir = normalize(vec3(0.5, 0.8, 0.3));
    vec3 sunCol = vec3(1.0, 0.95, 0.88);

    float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 4.0);
    fresnel = mix(0.03, 1.0, fresnel);

    float depth = smoothstep(-0.1, 0.2, vWaveHeight);
    vec3 color = mix(uDeepColor, uWaterColor, depth);

    float sss = pow(max(dot(viewDir, -sunDir), 0.0), 3.0);
    color += vec3(0.06, 0.4, 0.45) * sss * 0.3;

    vec3 skyColor = mix(vec3(0.62, 0.75, 0.82), vec3(0.72, 0.84, 0.90), fresnel * 0.3 + 0.2);
    color = mix(color, skyColor, fresnel * 0.28);

    float NdotL = max(dot(normal, sunDir), 0.0);
    color += sunCol * NdotL * 0.22;

    vec3 halfDir = normalize(sunDir + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), 120.0);
    color += sunCol * spec * 1.2;

    vec3 reflectDir = reflect(-sunDir, normal);
    float sparkle = pow(max(dot(viewDir, reflectDir), 0.0), 300.0);
    color += sunCol * sparkle * noise(vUv * 40.0 + uTime) * 1.5;

    float caust = caustic(vUv * 4.0, uTime * 0.4);
    color += vec3(0.2, 0.5, 0.6) * caust * 0.15;

    float foam = smoothstep(0.03, 0.08, vWaveHeight) * 0.28;
    foam *= noise(vUv * 15.0 + uTime * 0.4) * 0.4 + 0.7;
    color = mix(color, vec3(1.0, 1.0, 0.96), foam * 0.5);

    float edge = smoothstep(0.0, 0.08, vUv.x) * smoothstep(1.0, 0.92, vUv.x);
    edge *= smoothstep(0.0, 0.08, vUv.y) * smoothstep(1.0, 0.92, vUv.y);

    gl_FragColor = vec4(color, 0.60 * edge * uOpacity);
  }
`

interface MinimalWaterProps {
  isMobile?: boolean
  reducedMotion?: boolean
  docSize?: { width: number; height: number }
  opacity?: number
}

export default function MinimalWater({ isMobile = false, reducedMotion = false, docSize, opacity = 1.0 }: MinimalWaterProps) {
  const meshRef = useRef<Mesh | null>(null)
  const targetOpacity = useRef(1.0)
  const elapsedTime = useRef(0)

  useEffect(() => {
    targetOpacity.current = opacity
  }, [opacity])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uWaterColor: { value: new Color('#4DD0E1') },
      uDeepColor: { value: new Color('#006064') },
      uSunColor: { value: new Color('#FFF8E0') },
      uOpacity: { value: 1.0 },
    }),
    []
  )

  useFrame((_, delta) => {
    if (!meshRef.current) return
    const material = meshRef.current.material as ShaderMaterial

    if (!reducedMotion) {
      elapsedTime.current += delta
      material.uniforms.uTime.value = elapsedTime.current
    }

    const current = material.uniforms.uOpacity.value
    const target = targetOpacity.current
    material.uniforms.uOpacity.value = current + (target - current) * 0.05
  })

  useEffect(() => {
    return () => {
      if (meshRef.current) {
        meshRef.current.geometry.dispose()
        const material = meshRef.current.material as ShaderMaterial
        material.dispose()
        material.uniforms.uWaterColor.value.dispose()
        material.uniforms.uDeepColor.value.dispose()
        material.uniforms.uSunColor.value.dispose()
      }
    }
  }, [])

  // Balanced segment counts
  const segments = isMobile ? 28 : 64

  const vertexShader = isMobile ? mobileVertexShader : desktopVertexShader
  const fragmentShader = isMobile ? mobileFragmentShader : desktopFragmentShader

  const planeWidth = docSize?.width ?? 500
  const planeHeight = docSize?.height ?? 500

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[planeWidth, planeHeight, segments, segments]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={2}
      />
    </mesh>
  )
}
