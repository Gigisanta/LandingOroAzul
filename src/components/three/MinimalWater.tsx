'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh, ShaderMaterial } from 'three'
import { Color } from 'three'

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

    vec3 totalWave = wave1 + wave2 + wave3;
    pos.x += totalWave.x;
    pos.y += totalWave.y;
    pos.z += totalWave.z;

    // Calculate normal from waves
    vec3 n1 = gerstnerNormal(position.xz, 0.08, 25.0, vec2(1.0, 0.3), uTime * 0.4);
    vec3 n2 = gerstnerNormal(position.xz, 0.05, 15.0, vec2(-0.5, 1.0), uTime * 0.35);
    vec3 n3 = gerstnerNormal(position.xz, 0.03, 8.0, vec2(0.7, -0.7), uTime * 0.5);

    vNormal = normalize(n1 + n2 + n3);
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
  uniform float uOpacity;
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

  // FBM - Fractal Brownian Motion for natural detail
  float fbm(vec2 p, int octaves) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 4; i++) {
      if (i >= octaves) break;
      value += amplitude * noise(p * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  // Voronoi-based caustics for realistic light patterns
  float voronoi(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float minDist = 1.0;
    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 neighbor = vec2(float(x), float(y));
        vec2 point = hash(i + neighbor) * vec2(0.5) + 0.25;
        vec2 diff = neighbor + point - f;
        float dist = length(diff);
        minDist = min(minDist, dist);
      }
    }
    return minDist;
  }

  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    vec3 normal = normalize(vNormal);

    // Add micro-detail to normal with FBM
    float fbmNormal = fbm(vUv * 12.0 + uTime * 0.15, 4);
    vec3 fbmNormalOffset = vec3(
      fbm(vUv * 12.0 + uTime * 0.15 + vec2(0.1, 0.0), 4) - 0.5,
      0.0,
      fbm(vUv * 12.0 + uTime * 0.15 + vec2(0.0, 0.1), 4) - 0.5
    ) * 0.15;
    normal = normalize(normal + fbmNormalOffset);

    // Sun direction
    vec3 sunDir = normalize(vec3(40.0, 55.0, 25.0));

    // Fresnel - more reflection at grazing angles
    float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 4.0);
    fresnel = mix(0.02, 1.0, fresnel);

    // Specular highlight - GGX approximation for smoother falloff
    vec3 halfDir = normalize(sunDir + viewDir);
    float NdotH = max(dot(normal, halfDir), 0.0);
    float spec = pow(NdotH, 256.0);

    // Sun disk reflection - sharp sparkle
    vec3 reflectDir = reflect(-sunDir, normal);
    float sunReflect = pow(max(dot(viewDir, reflectDir), 0.0), 256.0);

    // Base water color - poolcore clean aqua
    vec3 color = uWaterColor;

    // Add depth variation - favor surface color
    float depth = smoothstep(-0.3, 0.8, vWorldPosition.y);
    color = mix(uDeepColor, color, depth);

    // Subsurface scattering approximation - warm pool light
    float sss = pow(max(dot(viewDir, -sunDir), 0.0), 3.0) * 0.3;
    color += vec3(0.1, 0.5, 0.55) * sss;

    // Fresnel reflection - warm sky color (cream to beige gradient)
    vec3 skyColor = mix(vec3(0.65, 0.80, 0.85), vec3(0.72, 0.84, 0.87), fresnel * 0.6 + 0.2);
    color = mix(color, skyColor, fresnel * 0.30);

    // Specular glow
    color += uSunColor * spec * 1.2;

    // Sun sparkle - enhanced with noise for more natural shimmer
    float sparkleNoise = noise(vUv * 120.0 + uTime * 3.0) * 0.5 + 0.5;
    float sunSparkle = sunReflect * sparkleNoise;
    color += vec3(1.0, 0.98, 0.95) * sunSparkle * 1.5;

    // Voronoi-based caustics for realistic light patterns
    float caustic1 = voronoi(vUv * 8.0 + uTime * 0.4);
    float causticPattern = pow(1.0 - caustic1, 3.0);
    color += vec3(0.4, 0.6, 0.7) * causticPattern * 0.15;

    // FBM-based caustics for organic variation
    float fbmCaustic = fbm(vUv * 10.0 + uTime * 0.5, 5);
    fbmCaustic = pow(fbmCaustic, 1.5) * 0.1;
    color += vec3(0.2, 0.4, 0.5) * fbmCaustic;

    // Soft foam at peaks (subtle)
    float foam = smoothstep(0.06, 0.12, vWorldPosition.y) * 0.2;
    float foamNoise = noise(vUv * 40.0 + uTime * 0.8);
    foam *= foamNoise;
    color = mix(color, vec3(1.0, 1.0, 0.98), foam);

    float alpha = 0.92 * uOpacity;

    gl_FragColor = vec4(color, alpha);
  }
`

interface MinimalWaterProps {
  isMobile?: boolean
  reducedMotion?: boolean
  docSize?: { width: number; height: number }
  opacity?: number
}

const mobileFluidWaterFragmentShader = /* glsl */ `
  precision mediump float;

  uniform float uTime;
  uniform vec3 uWaterColor;
  uniform vec3 uDeepColor;
  uniform vec3 uSunColor;
  uniform float uOpacity;
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

  // 2-octave FBM without dynamic loop (iOS safe)
  float fbm2(vec2 p) {
    float v = noise(p) * 0.5;
    v += noise(p * 2.0) * 0.25;
    return v;
  }

  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    vec3 normal = normalize(vNormal);

    // Simplified micro-detail
    float fbmN = fbm2(vUv * 8.0 + uTime * 0.12);
    vec3 fbmNormalOffset = vec3(
      fbm2(vUv * 8.0 + uTime * 0.12 + vec2(0.1, 0.0)) - 0.5,
      0.0,
      fbm2(vUv * 8.0 + uTime * 0.12 + vec2(0.0, 0.1)) - 0.5
    ) * 0.08;
    normal = normalize(normal + fbmNormalOffset);

    vec3 sunDir = normalize(vec3(40.0, 55.0, 25.0));

    float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 4.0);
    fresnel = mix(0.02, 1.0, fresnel);

    vec3 halfDir = normalize(sunDir + viewDir);
    float NdotH = max(dot(normal, halfDir), 0.0);
    float spec = pow(NdotH, 120.0);

    vec3 reflectDir = reflect(-sunDir, normal);
    float sunReflect = pow(max(dot(viewDir, reflectDir), 0.0), 120.0);

    vec3 color = uWaterColor;
    float depth = smoothstep(-0.2, 0.6, vWorldPosition.y);
    color = mix(uDeepColor, color, depth);

    float sss = pow(max(dot(viewDir, -sunDir), 0.0), 3.0) * 0.35;
    color += vec3(0.15, 0.55, 0.6) * sss;

    vec3 skyColor = mix(vec3(0.65, 0.80, 0.85), vec3(0.72, 0.84, 0.87), fresnel * 0.6 + 0.2);
    color = mix(color, skyColor, fresnel * 0.25);

    color += uSunColor * spec * 1.2;

    float sparkleNoise = noise(vUv * 60.0 + uTime * 2.0) * 0.5 + 0.5;
    float sparkle = sunReflect * sparkleNoise;
    color += vec3(1.0, 0.98, 0.95) * sparkle * 1.2;

    // Simplified caustic
    float caustic = fbm2(vUv * 10.0 + uTime * 0.4);
    caustic = pow(caustic, 2.0) * 0.15;
    color += vec3(0.3, 0.55, 0.65) * caustic;

    float foam = smoothstep(0.05, 0.1, vWorldPosition.y) * 0.15;
    foam *= noise(vUv * 30.0 + uTime * 0.6);
    color = mix(color, vec3(1.0, 1.0, 0.98), foam);

    gl_FragColor = vec4(color, 0.92 * uOpacity);
  }
`

const mobileFluidWaterVertexShader = /* glsl */ `
  precision mediump float;
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;

  vec3 gerstnerWave(vec2 pos, float steepness, float wavelength, vec2 direction, float time) {
    float k = 2.0 * 3.14159 / wavelength;
    float c = sqrt(9.8 / k);
    vec2 d = normalize(direction);
    float a = steepness / k;
    float f = k * (dot(d, pos) - c * time);
    return vec3(d.x * a * cos(f), a * sin(f), d.y * a * cos(f));
  }

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

    vec3 wave1 = gerstnerWave(pos.xz, 0.08, 25.0, vec2(1.0, 0.3), uTime * 0.4);
    vec3 wave2 = gerstnerWave(pos.xz, 0.05, 15.0, vec2(-0.5, 1.0), uTime * 0.35);

    vec3 totalWave = wave1 + wave2;
    pos.x += totalWave.x;
    pos.y += totalWave.y;
    pos.z += totalWave.z;

    vec3 n1 = gerstnerNormal(position.xz, 0.08, 25.0, vec2(1.0, 0.3), uTime * 0.4);
    vec3 n2 = gerstnerNormal(position.xz, 0.05, 15.0, vec2(-0.5, 1.0), uTime * 0.35);
    vNormal = normalize(n1 + n2);

    vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

export default function MinimalWater({ isMobile = false, reducedMotion = false, docSize, opacity = 1.0 }: MinimalWaterProps) {
  const meshRef = useRef<Mesh | null>(null)
  const targetOpacity = useRef(1.0)

  // Update target opacity when prop changes
  useEffect(() => {
    targetOpacity.current = opacity
  }, [opacity])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uWaterColor: { value: new Color('#5DD9E8') },
      uDeepColor: { value: new Color('#1A9EAA') },
      uSunColor: { value: new Color('#FFF8E0') },
      uOpacity: { value: 1.0 },
    }),
    []
  )

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const material = meshRef.current.material as ShaderMaterial
    material.uniforms.uTime.value = clock.getElapsedTime()

    // Smoothly interpolate opacity
    if (!reducedMotion) {
      const current = material.uniforms.uOpacity.value
      const target = targetOpacity.current
      material.uniforms.uOpacity.value = current + (target - current) * 0.05
    } else {
      material.uniforms.uOpacity.value = targetOpacity.current
    }
  })

  useEffect(() => {
    return () => {
      if (meshRef.current) {
        meshRef.current.geometry.dispose()
        const material = meshRef.current.material as ShaderMaterial
        material.dispose()
        // Dispose THREE.Color instances to prevent memory leaks
        material.uniforms.uWaterColor.value.dispose()
        material.uniforms.uDeepColor.value.dispose()
        material.uniforms.uSunColor.value.dispose()
      }
    }
  }, [])

  const segments = isMobile ? 24 : 40
  const vertexShader = mobileFluidWaterVertexShader
  const fragmentShader = mobileFluidWaterFragmentShader

  const planeWidth = docSize?.width ?? 400
  const planeHeight = docSize?.height ?? 400

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
        side={2}
      />
    </mesh>
  )
}
