# Oro Azul - Swimming School Landing Page

A Next.js landing page for **Oro Azul**, a swimming school (natatorio) in Buenos Aires, Argentina. The site features an immersive 3D swimming pool visualization with custom GLSL shaders for realistic water effects, caustics, and underwater lighting.

## Overview

Oro Azul offers swimming classes for all ages, aquatic rehabilitation, and recreational activities. The landing page showcases these services with a stunning 3D pool background that creates an immersive aquatic experience for visitors.

### Key Features

- **3D Swimming Pool Visualization**: Realistic swimming pool rendered in WebGL
- **Custom Water Shader**: Animated wave effects using multiple overlapping sine waves
- **Caustics Effect**: Light patterns on the pool floor using Fractal Brownian Motion (FBM)
- **Underwater Lighting**: Point lights creating depth and atmosphere
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Reduced Motion Support**: Respects user accessibility preferences
- **Multi-section Layout**: Hero, Schedule, Pricing, Gallery, Testimonials, Contact

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 15](https://nextjs.org/) | React framework with App Router |
| [React 19](https://react.dev/) | UI library |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) | React renderer for Three.js |
| [Three.js](https://threejs.org/) | 3D graphics library |
| [Framer Motion](https://www.framer.com/motion/) | Animation library |
| [GLSL Shaders](https://www.khronos.org/opengl/wiki/Core_Language_(GLSL)) | Custom water and caustics effects |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with fonts and metadata
│   ├── page.tsx            # Main landing page
│   └── globals.css         # Global styles
├── components/
│   ├── sections/           # Page sections
│   │   ├── Navigation.tsx  # Fixed navigation with CTA
│   │   ├── Hero.tsx        # Hero with 3D background
│   │   ├── Schedule.tsx    # Class schedule by activity
│   │   ├── Pricing.tsx     # Pricing plans
│   │   ├── Gallery.tsx     # Image gallery
│   │   ├── Testimonials.tsx # Customer testimonials
│   │   ├── Contact.tsx     # Contact form
│   │   └── Footer.tsx      # Site footer
│   └── three/              # 3D scene components
│       ├── Scene.tsx       # Main 3D canvas and lighting
│       ├── Water.tsx       # Animated water surface shader
│       ├── Caustics.tsx    # Light caustics on pool floor
│       ├── PoolEnvironment.tsx # Pool structure, tiles, lane lines
│       ├── Pool.tsx        # Pool mesh (legacy)
│       ├── PoolWalls.tsx   # Pool walls (legacy)
│       ├── Lights.tsx      # Scene lights (legacy)
│       └── UnderwaterLights.tsx # Underwater lighting
├── data/
│   └── landing.json       # Static content data
└── hooks/
    └── useReducedMotion.ts # Accessibility hook
```

## 3D Scene Architecture

The 3D scene is built with React Three Fiber and consists of several layered components:

### Scene Component (`Scene.tsx`)

The main canvas wrapper that sets up the R3F Canvas with:
- Camera position: `[0, 25, 30]` with 45 FOV
- High-performance WebGL context
- Sky gradient background
- Ambient and directional lighting

### Water Shader (`Water.tsx`)

Custom GLSL shader creating realistic water surface with:

**Vertex Shader Features:**
- 5 overlapping sine waves for realistic motion
- Dynamic normal calculation for reflections
- Time-based animation

**Fragment Shader Features:**
- Depth-based color gradient (deep to shallow)
- Specular highlights using Blinn-Phong lighting
- Fresnel effect for view-dependent reflections
- Sun reflection simulation
- Surface shimmer effect
- Transparency with edge opacity

### Caustics Effect (`Caustics.tsx`)

Light caustics projected onto the pool floor using:

**Fragment Shader Techniques:**
- Fractal Brownian Motion (FBM) noise
- Multiple animated noise layers
- Additive blending for light accumulation
- Intensity pulsing animation
- Pool edge fadeout

### Pool Environment (`PoolEnvironment.tsx`)

Complete pool structure including:
- **Pool Floor**: Light blue tiles with lane markers
- **Walls**: 4 walls with blue tile accent lines
- **Deck**: Surrounding deck area
- **Starting Blocks**: 2 blocks at one end
- **Ladders**: 2 stainless steel pool ladders
- **Lane Lines**: 5 underwater lane dividers

### Underwater Lights (`UnderwaterLights.tsx`)

Creates underwater atmosphere with:
- 15 point lights arranged in grid pattern
- Cyan/blue color scheme (`#00DDFF`, `#00AAFF`)
- Main central glow light
- Side accent lights

## Water Shader Reference

### Vertex Shader Uniforms

| Uniform | Type | Description |
|---------|------|-------------|
| `uTime` | float | Animation time from clock |
| `uColor` | vec3 | Surface water color |
| `uDeepColor` | vec3 | Deep water color |
| `uHighlightColor` | vec3 | Specular highlight color |
| `uSkyColor` | vec3 | Sky reflection color |

### Caustics Shader Uniforms

| Uniform | Type | Description |
|---------|------|-------------|
| `uTime` | float | Animation time |
| `uIntensity` | float | Caustic brightness (default: 2.2) |
| `uColor` | vec3 | Caustic light color |

### Pool Dimensions

- Width: 22 units
- Length: 34 units
- Depth: 3 units
- Wall thickness: 0.4 units
- Deck width: 3 units
- Lane count: 6

## Data Structure

All content is loaded from `src/data/landing.json`:

```typescript
{
  business: {
    name: string,
    phone: string,
    whatsapp: string,
    email: string,
    address: string,
    instagram: string,
    facebook: string
  },
  plans: Plan[],
  activities: Activity[],
  testimonials: Testimonial[],
  gallery: GalleryImage[]
}
```

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Development

The development server runs on port 3001:
```bash
npm run dev  # Starts on http://localhost:3001
```

## Design Decisions

### Why Custom GLSL Shaders?

Pre-built water materials often lack the specific look needed for a natatorio. Custom shaders provide:
- Control over wave frequency and amplitude
- Tunable optical properties (refraction, reflection)
- Performance optimization for mobile
- Consistent visual style across devices

### Caustics Approach

The caustics use FBM noise rather than ray-tracing because:
- FBM is much faster for real-time rendering
- Still produces natural-looking light patterns
- Works well with the stylized aesthetic
- No expensive compute shaders needed

### Reduced Motion

The `useReducedMotion` hook detects system preferences and disables:
- Wave animation
- Scroll indicator animation
- Framer Motion stagger effects

## Swimming Pool Web Design Best Practices

Based on industry research:

1. **Visual Impact**: Swimming pool websites rely heavily on visual appeal. Crystal-clear water surfaces with natural reflections and realistic movement are essential.

2. **Color Palette**: Bright blues (#00A8E8), clean whites, and aquatic aesthetics create trust and convey cleanliness.

3. **3D Visualization**: Modern pool websites use 3D rendering to showcase pool designs with accurate lighting, materials, and water effects.

4. **Key Elements**:
   - Realistic water shaders with proper refraction
   - Caustic light patterns on pool floors
   - Lane markers and starting blocks for authenticity
   - Underwater lighting for atmosphere

5. **Reference Sites**:
   - Orange Pools (wave animations)
   - Myrtha Pools (Virtual Trainer)
   - DanThree Studio (photorealistic 3D)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

WebGL 2.0 required for full shader support.

## License

Private project for Oro Azul Natatorio.
