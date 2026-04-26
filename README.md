# Oro Azul - Swimming School Landing Page

A Next.js landing page for **Oro Azul**, a swimming school (natatorio) in Buenos Aires, Argentina. The site features an immersive 3D swimming pool visualization with custom GLSL shaders for realistic water effects using Gerstner waves, protected by an ErrorBoundary for production resilience.

## Overview

Oro Azul offers swimming classes for all ages, aquatic rehabilitation, and recreational activities. The landing page showcases these services with a stunning 3D pool background that creates an immersive aquatic experience for visitors.

### Key Features

- **3D Swimming Pool Visualization**: Realistic swimming pool rendered in WebGL
- **Custom Water Shader**: Animated wave effects using Gerstner waves
- **ErrorBoundary Protection**: Graceful fallback for 3D rendering failures
- **CSS Design Tokens**: Centralized color and typography variables
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
| [next/font/google](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) | Plus Jakarta Sans font |
| [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) | Design tokens |
| [GLSL Shaders](https://www.khronos.org/opengl/wiki/Core_Language_(GLSL)) | Custom water effects with Gerstner waves |

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
│   │   ├── Gallery.tsx     # Image gallery with motion.a
│   │   ├── Testimonials.tsx # Customer testimonials
│   │   ├── Contact.tsx     # Contact form
│   │   └── Footer.tsx      # Site footer
│   └── three/              # 3D scene components
│       ├── Scene.tsx       # Main 3D canvas with ErrorBoundary
│       └── MinimalWater.tsx # Water surface with Gerstner waves
├── data/
│   └── landing.json       # Static content data
└── hooks/
    └── useReducedMotion.ts # Accessibility hook
```

## 3D Scene Architecture

The 3D scene is built with React Three Fiber and protected by an ErrorBoundary for graceful failure handling.

### Scene Component (`Scene.tsx`)

The main canvas wrapper that sets up the R3F Canvas with:
- Camera position: `[0, 25, 30]` with 45 FOV
- High-performance WebGL context
- Sky gradient background
- Ambient and directional lighting
- ErrorBoundary wrapping for production resilience

### MinimalWater Shader (`MinimalWater.tsx`)

Custom GLSL shader creating realistic water surface with Gerstner waves:

**Vertex Shader Features:**
- Gerstner wave algorithm for realistic ocean-like motion
- Multiple wave frequencies and amplitudes
- Dynamic normal calculation for reflections
- Time-based animation

**Fragment Shader Features:**
- Depth-based color gradient (deep to shallow)
- Specular highlights using Blinn-Phong lighting
- Fresnel effect for view-dependent reflections
- Sun reflection simulation
- Transparency with edge opacity

## Water Shader Reference

### Vertex Shader Uniforms

| Uniform | Type | Description |
|---------|------|-------------|
| `uTime` | float | Animation time from clock |
| `uColor` | vec3 | Surface water color |
| `uDeepColor` | vec3 | Deep water color |
| `uHighlightColor` | vec3 | Specular highlight color |
| `uSkyColor` | vec3 | Sky reflection color |

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
- Gerstner wave algorithm for realistic ocean-like motion

### Reduced Motion

The `useReducedMotion` hook detects system preferences and disables:
- Wave animation
- Scroll indicator animation
- Framer Motion stagger effects

## CSS Design Tokens

The project uses CSS custom properties defined in `globals.css` for consistent theming:

```css
:root {
  /* Colors */
  --color-primary: oklch(...);
  --color-secondary: oklch(...);
  --color-accent: oklch(...);
  --color-surface: oklch(...);
  --color-text: oklch(...);

  /* Typography */
  --font-family: 'Plus Jakarta Sans', sans-serif;
  --text-base: clamp(...);
  --text-hero: clamp(...);

  /* Spacing */
  --space-section: clamp(...);

  /* Animation */
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --ease-out-expo: cubic-bezier(...);
}
```

Typography is loaded via `next/font/google` with Plus Jakarta Sans for optimal performance.

## Swimming Pool Web Design Best Practices

Based on industry research:

1. **Visual Impact**: Swimming pool websites rely heavily on visual appeal. Crystal-clear water surfaces with natural reflections and realistic movement are essential.

2. **Color Palette**: Bright blues (#00A8E8), clean whites, and aquatic aesthetics create trust and convey cleanliness.

3. **3D Visualization**: Modern pool websites use 3D rendering to showcase pool designs with accurate lighting, materials, and water effects.

4. **Key Elements**:
   - Realistic water shaders with Gerstner waves
   - Proper refraction and reflection
   - Lane markers for authenticity
   - Graceful degradation for older browsers

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
