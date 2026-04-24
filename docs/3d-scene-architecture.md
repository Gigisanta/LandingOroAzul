# 3D Scene Architecture Documentation

This document provides detailed technical documentation for the 3D swimming pool visualization in the Oro Azul landing page.

## Overview

The 3D scene creates an immersive swimming pool environment as a fixed background to the landing page. It uses React Three Fiber as the React renderer for Three.js, with custom GLSL shaders for water simulation.

## Architecture Layers

```
┌─────────────────────────────────────────────┐
│            Canvas (R3F)                    │
│  ┌───────────────────────────────────────┐ │
│  │           Sky Gradient                │ │
│  │  ┌─────────────────────────────────┐ │ │
│  │  │      Pool Environment           │ │ │
│  │  │  ┌───────────────────────────┐ │ │ │
│  │  │  │    Caustics Plane         │ │ │ │
│  │  │  │  ┌─────────────────────┐  │ │ │ │
│  │  │  │  │   Water Surface     │  │ │ │ │
│  │  │  │  └─────────────────────┘  │ │ │ │
│  │  │  └───────────────────────────┘ │ │ │
│  │  └─────────────────────────────────┘ │ │
│  │         Underwater Lights            │ │
│  └───────────────────────────────────────┘ │
│              Lighting                      │
└─────────────────────────────────────────────┘
```

## Component Details

### Scene.tsx

**Purpose**: Main 3D canvas orchestrator

**Props**:
```typescript
interface SceneProps {
  children?: React.ReactNode
}
```

**Configuration**:
- Camera: `position: [0, 25, 30], fov: 45`
- WebGL Context:
  - `antialias: true`
  - `alpha: false`
  - `powerPreference: 'high-performance'`
- Background: Linear gradient from `#87CEEB` (sky) to `#1a5a7a` (deep)

**Lighting Setup**:
- Ambient light: `intensity: 0.8`, white
- Directional light (sun): `position: [15, 50, 20]`, `intensity: 1.5`, warm white `#fff5e0`

**Child Order** (z-index):
1. `PoolEnvironment` - Pool structure (furthest back)
2. `UnderwaterLights` - Underwater illumination
3. `Caustics` - Light patterns on floor
4. `Water` - Animated water surface (front)

### Water.tsx

**Purpose**: Animated water surface with custom GLSL shader

**Shader Architecture**:

```
Water Vertex Shader:
├── Input: planeGeometry (64x64 segments)
├── Output: vUv, vPosition, vNormal
├── Animation: 5 overlapping sine waves
└── Calculates normals for lighting

Water Fragment Shader:
├── Input: uTime, uColor, uDeepColor, uHighlightColor, uSkyColor
├── Processing:
│   ├── Depth gradient (deep → shallow)
│   ├── Specular highlights (Blinn-Phong)
│   ├── Fresnel reflection
│   ├── Sun reflection (high exponent)
│   ├── Surface shimmer
│   └── Edge opacity fade
└── Output: vec4 with alpha
```

**Wave Formulas**:
```glsl
float wave1 = sin(position.x * 0.3 + uTime * 0.5) * 0.12;
float wave2 = sin(position.z * 0.25 + uTime * 0.4) * 0.1;
float wave3 = sin((position.x + position.z) * 0.2 + uTime * 0.35) * 0.08;
float wave4 = sin(position.x * 0.5 + position.z * 0.4 + uTime * 0.6) * 0.05;
float wave5 = cos(position.x * 0.4 - position.z * 0.3 + uTime * 0.45) * 0.06;
```

**Color Palette**:
- Surface: `#00B4D8`
- Deep: `#0077B6`
- Highlights: `#90E0EF`
- Sky reflection: `#CAF0F8`

**Performance**: Uses `useFrame` to update time uniform, 64x64 geometry for smooth waves.

### Caustics.tsx

**Purpose**: Realistic light caustics on pool floor

**Shader Architecture**:

```
Caustics Fragment Shader:
├── Input: uTime, uIntensity, uColor
├── Processing:
│   ├── FBM noise (4 octaves)
│   ├── 3 animated noise layers
│   ├── Caustic multiplication
│   ├── Bright spot enhancement
│   ├── Intensity pulse
│   └── Pool edge fadeout
└── Blending: AdditiveBlending
```

**Noise Functions**:
```glsl
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  // Smooth interpolation
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  // ... hash lookups and interpolation
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p * frequency);
    amplitude *= 0.5;
    frequency *= 2.0;
  }
  return value;
}
```

**Animation Layers**:
```glsl
vec2 p1 = uv + vec2(t * 0.5, t * 0.3);
vec2 p2 = uv * 1.3 - vec2(t * 0.4, t * 0.5);
vec2 p3 = uv * 0.8 + vec2(t * 0.6, -t * 0.4);
```

**Uniforms**:
- `uIntensity`: 2.2 (adjusts caustic brightness)
- `uColor`: `#aaddff` (light blue)

**Blending**: `AdditiveBlending` creates natural light accumulation effect.

### PoolEnvironment.tsx

**Purpose**: Complete pool structure with tiles, lane lines, ladders, starting blocks

**Dimensions**:
| Element | Value |
|---------|-------|
| Pool Width | 22 units |
| Pool Length | 34 units |
| Pool Depth | 3 units |
| Wall Thickness | 0.4 units |
| Deck Width | 3 units |
| Lane Count | 6 |

**Materials**:

| Material | Color | Roughness | Metalness |
|----------|-------|-----------|-----------|
| Tile (walls) | `#e8f4f8` | 0.2 | 0.1 |
| Tile Lines | `#00A8E8` | 0.3 | 0.1 |
| Floor | `#d0e8f0` | 0.4 | 0.1 |
| Deck | `#f0f0f0` | 0.5 | 0.0 |
| Lane Lines | `#0077b6` | 0.3 | 0.2 |

**Structure Elements**:
1. **Pool Floor**: Box geometry with tiles
2. **Lane Lines**: 5 lines on pool floor
3. **Walls**: 4 walls with tile accent lines
4. **Deck**: 4 deck sections surrounding pool
5. **Starting Blocks**: 2 blocks at deep end
6. **Ladders**: 2 ladders (left and right sides)

**Pool Wall Tile Lines**:
- 8 horizontal lines per wall
- Creates realistic tile pattern effect
- Uses `tileLineMaterial`

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

### Water Shader
- 64×64 plane geometry (4096 vertices)
- 5 wave calculations per vertex
- Normal calculation adds 3 cosine terms per vertex
- Fragment: specular, fresnel, shimmer calculations

### Caustics Shader
- 4-octave FBM per fragment
- 3 animated noise layers
- Additive blending (no depth write)

### Optimization Strategies
1. **Geometry resolution**: Balance between visual quality and vertex count
2. **Shader complexity**: Use efficient noise functions
3. **Blending**: AdditiveBlending avoids depth sorting issues
4. **Uniform updates**: Only update time, not static values

## Accessibility

The `useReducedMotion` hook disables:
- Water wave animation (shader uniform updates)
- All framer-motion animations on the page

This respects `prefers-reduced-motion` media query.

## WebGL Configuration

```typescript
{
  antialias: true,           // Smooth edges
  alpha: false,              // Opaque background (gradient set on Canvas)
  powerPreference: 'high-performance'  // Prefer discrete GPU
}
```

## Camera Setup

```typescript
camera: {
  position: [0, 25, 30],  // Above and behind pool
  fov: 45,                 // Wide enough to see pool
  near: 0.1,               // Default
  far: 1000                // Far enough for sky gradient
}
```

## Integration with Next.js

The Scene component is loaded dynamically:

```typescript
const Scene = dynamic(() => import('@/components/three/Scene'), {
  ssr: false,  // WebGL only works client-side
  loading: () => (
    <div className="fixed inset-0 -z-10 bg-[#0A1628]">
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
