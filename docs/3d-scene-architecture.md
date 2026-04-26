# 3D Scene Architecture Documentation

This document provides detailed technical documentation for the 3D swimming pool visualization in the Oro Azul landing page.

## Overview

The 3D scene creates an immersive swimming pool environment as a fixed background to the landing page. It uses React Three Fiber as the React renderer for Three.js, with custom GLSL shaders for water simulation. The water surface incorporates realistic Gerstner wave physics, Voronoi-based caustics, and physically-inspired lighting.

## Architecture Layers

```
┌─────────────────────────────────────────────┐
│            Canvas (R3F)                    │
│  ┌───────────────────────────────────────┐ │
│  │           Sky Gradient                │ │
│  │  ┌─────────────────────────────────┐ │ │
│  │  │       MinimalWater              │ │ │
│  │  │  (Water + Caustics unified)    │ │ │
│  │  │  ┌───────────────────────────┐  │ │ │
│  │  │  │  Gerstner Waves          │  │ │ │
│  │  │  │  Voronoi Caustics        │  │ │ │
│  │  │  │  Fresnel + Specular      │  │ │ │
│  │  │  └───────────────────────────┘  │ │ │
│  │  └─────────────────────────────────┘ │ │
│  │         Underwater Lights            │ │
│  └───────────────────────────────────────┘ │
│              Lighting                      │
└─────────────────────────────────────────────┘
```

## Component Details

### Scene.tsx

**Purpose**: Main 3D canvas orchestrator with ErrorBoundary wrapper

**Props**:
```typescript
interface SceneProps {
  children?: React.ReactNode
}
```

**Configuration**:
- Camera: `position: [0, 14, 24], fov: 55` (desktop) / `fov: 65` (mobile)
- WebGL Context:
  - `antialias: true` (desktop only)
  - `alpha: true`
  - `powerPreference: 'high-performance'` (desktop) / `'low-power'` (mobile)
- Background: Linear gradient from `#006080` (deep) through `#00A5B5`, `#00CED1`, `#40E0D0` to `#7FDBDB` (shallow)
- Fog: `color: '#0088A0'`, near: `80`, far: `100`

**Lighting Setup**:
- Ambient light: `intensity: 1.5`, white (desktop) / `1.0` (mobile)
- Primary directional light (sun): `position: [40, 55, 25]`, `intensity: 2.8`, warm white `#FFF8E0`, castShadow enabled (desktop)
- Additional directional lights (desktop only):
  - `position: [-25, 35, 20]`, `intensity: 0.8`, cool white `#E0F0FF`
  - `position: [0, 25, -35]`, `intensity: 0.45`, `#F0F8FF`
- Point lights for accent (desktop only):
  - `position: [20, 10, 15]`, `intensity: 1.5`, `#FFE4B5`, distance `60`
  - `position: [-15, 5, 5]`, `intensity: 0.6`, `#B8E8FF`, distance `40`

**Post-Processing** (desktop only):
- EffectComposer with Bloom:
  - `intensity: 0.4`
  - `luminanceThreshold: 0.8`
  - `luminanceSmoothing: 0.9`
  - `mipmapBlur: true`

**Child Components**:
1. `MinimalWater` - Animated water surface with integrated caustics
2. `UnderwaterLights` - Underwater illumination (desktop only)

### MinimalWater.tsx

**Purpose**: Unified water surface with integrated Gerstner wave simulation, Voronoi caustics, and advanced lighting

**Shader Architecture**:

```
MinimalWater Vertex Shader (Gerstner Waves):
├── Input: planeGeometry (128x128 desktop, 48x48 mobile)
├── Gerstner Wave Function:
│   ├── k = 2π / wavelength
│   ├── c = sqrt(9.8 / k)  // wave speed
│   ├── a = steepness / k  // amplitude
│   └── f = k(dot(d, pos) - c·time)
├── 4 Layered Gerstner Waves (desktop):
│   ├── Wave 1: steepness 0.08, wavelength 25.0, direction (1.0, 0.3)
│   ├── Wave 2: steepness 0.05, wavelength 15.0, direction (-0.5, 1.0)
│   ├── Wave 3: steepness 0.03, wavelength 8.0, direction (0.7, -0.7)
│   └── Wave 4: steepness 0.02, wavelength 4.0, direction (-0.3, -0.9)
├── 3 Layered Gerstner Waves (mobile)
└── Output: vUv, vWorldPosition, vNormal

MinimalWater Fragment Shader:
├── Input: uTime, uWaterColor, uDeepColor, uSunColor
├── Processing:
│   ├── FBM micro-detail normals (4 octaves)
│   ├── Fresnel reflection (pow 4.0, range 0.02-1.0)
│   ├── GGX specular highlight (exponent 256)
│   ├── Sun disk reflection (exponent 256)
│   ├── Voronoi-based caustics (2 layers)
│   ├── FBM caustics (5 octaves)
│   ├── Subsurface scattering approximation
│   ├── Sun sparkle (noise-modulated)
│   └── Foam at wave peaks
└── Output: vec4 with alpha 0.92
```

**Gerstner Wave Formulas**:
```glsl
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
```

**Voronoi Caustics**:
```glsl
float voronoi(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float minDist = 1.0;
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 neighbor = vec2(float(x), float(y));
      vec2 point = hash(i + neighbor) * 0.5 + 0.25;
      vec2 diff = neighbor + point - f;
      minDist = min(minDist, length(diff));
    }
  }
  return minDist;
}
```

**Color Palette**:
- Surface water: `#4FC3F7`
- Deep water: `#0288D1`
- Sun color: `#FFF8E0`
- Sky reflection: `rgb(0.7, 0.9, 1.0)`

**Performance**:
- Desktop: 128x128 geometry (16,384 vertices), 4 Gerstner waves
- Mobile: 48x48 geometry (2,304 vertices), 3 Gerstner waves
- Fragment shader: Voronoi + FBM caustics, GGX specular, noise sparkle
- Uses `useFrame` to update time uniform

**Props**:
```typescript
interface MinimalWaterProps {
  isMobile?: boolean    // Reduces geometry segments and wave count
  reducedMotion?: boolean  // Disables wave animation
}
```

### UnderwaterLights.tsx

**Purpose**: Underwater illumination for atmosphere

**Light Grid**:
- 3 rows × 5 columns = 15 point lights
- Spacing: 5 units horizontally, 10 units vertically
- Position range: x: [-10, 10], z: [-15, 15]
- Y position: -2.5 (below water surface)

**Light Configuration**:
```typescript
// Grid lights
{
  x: -10 + col * 5,
  z: -15 + row * 10,
  intensity: 0.3 + Math.random() * 0.2  // 0.3-0.5
}

// Main glow
{
  position: [0, -1, 0],
  intensity: 1.5,
  color: "#00DDFF",
  distance: 20,
  decay: 2
}

// Side accents (4 lights)
{
  position: [-8, -1, 0],  // left
  intensity: 0.8,
  color: "#00AAFF",
  distance: 15,
  decay: 2
}
// ... right, front-back pairs
```

**Color Palette**:
- Grid lights: `#00DDFF`
- Main glow: `#00DDFF`
- Side accents: `#00AAFF`
- Front/back: `#00CCFF`

## Shader Performance Considerations

### Water Shader (MinimalWater)
- Desktop: 128x128 plane geometry (16,384 vertices)
- 4 Gerstner wave calculations per vertex (3 on mobile)
- Normal calculation from wave derivatives
- Fragment: Voronoi caustics (2 layers) + FBM caustics (5 octaves)
- GGX specular with 256 exponent
- Noise-modulated sun sparkle

### Mobile Optimization
- Reduced geometry: 48x48 (vs 128x128)
- Fewer waves: 3 (vs 4)
- Simpler caustics: single noise layer (vs Voronoi + FBM)
- Lower specular exponent: 128 (vs 256)
- No post-processing Bloom

### Optimization Strategies
1. **Geometry resolution**: Mobile uses 48x48 vs 128x128 desktop
2. **Wave complexity**: Mobile uses 3 waves vs 4 desktop waves
3. **Caustic complexity**: Mobile uses single noise vs Voronoi + FBM
4. **Post-processing**: Bloom only on desktop

## Accessibility

The `useReducedMotion` hook disables:
- Water wave animation (shader uniform `uTime` stops updating)
- All framer-motion animations on the page

This respects `prefers-reduced-motion` media query.

## WebGL Configuration

```typescript
{
  antialias: !isMobile,           // Smooth edges (desktop only)
  alpha: true,                    // Transparent Canvas background
  powerPreference: isMobile ? 'low-power' : 'high-performance'
}
```

## Camera Setup

```typescript
camera: {
  position: [0, 14, 24],  // Above and angled toward pool
  fov: isMobile ? 65 : 55,  // Wider on mobile for better framing
  near: 0.1,               // Default
  far: 1000                // Far enough for fog gradient
}
```

## Integration with Next.js

The Scene component is loaded dynamically:

```typescript
const Scene = dynamic(() => import('@/components/three/Scene'), {
  ssr: false,  // WebGL only works client-side
  loading: () => (
    <div className="fixed inset-0 -z-10 bg-[#006080]">
      <Spinner />
    </div>
  )
})
```

## Future Improvements

1. **Ray-traced Caustics**: For more realistic light patterns
2. **Interactive Elements**: Clickable pool features
3. **Multiple Camera Angles**: Smooth transitions on scroll
4. **Water Refraction**: Refract underwater view
5. **Bubble Particles**: Animated bubbles rising from floor
6. **Diving Board/Platform**: Additional pool equipment
7. **Water Reflections**: Reflective pool deck surface
