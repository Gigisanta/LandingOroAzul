# Oro Azul - Swimming School Landing Page

A Next.js landing page for **Oro Azul**, a swimming school (natatorio) in Buenos Aires, Argentina. The site features an immersive **full-screen 3D swimming pool visualization** with visible pool floor tiles, lane markers, and realistic water animation using Gerstner waves, protected by an ErrorBoundary for production resilience.

## Overview

Oro Azul offers swimming classes for all ages, aquatic rehabilitation, and recreational activities. The landing page showcases these services with a stunning **full-screen swimming pool background** that creates an immersive aquatic experience. The pool fills the viewport width with visible floor, walls, and animated water surface.

### Key Features

- **Full-Screen Swimming Pool**: Pool fills viewport width with transparent water
- **Visible Pool Floor**: Tiles with lane markers visible through water
- **Pool Walls**: All 4 walls visible at pool edges
- **Realistic Gerstner Waves**: 4 overlapping waves for natural water motion
- **Sun Reflections**: Specular highlights on water surface
- **Optimized for All Devices**: Desktop uses full shader complexity; mobile uses simplified version
- **iOS WebGL Fixes**: failIfMajorPerformanceCaveat disabled, WebGL2 with WebGL1 fallback
- **ErrorBoundary Protection**: Graceful fallback for 3D rendering failures
- **CSS Design Tokens**: Centralized color and typography variables
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Reduced Motion Support**: Respects user accessibility preferences
- **Proper Z-Index Stacking**: All sections layered correctly above water background

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
│   ├── page.tsx            # Main landing page (uses WaterCanvas)
│   └── globals.css         # Global styles
├── components/
│   ├── sections/           # Page sections (all at z-10 above water)
│   │   ├── Navigation.tsx  # Fixed navigation (z-50)
│   │   ├── Hero.tsx        # Hero section
│   │   ├── Benefits.tsx    # Benefits section
│   │   ├── Schedule.tsx    # Class schedule by activity
│   │   ├── Pricing.tsx    # Pricing plans
│   │   ├── Gallery.tsx    # Image gallery
│   │   ├── Testimonials.tsx # Customer testimonials
│   │   ├── FAQ.tsx        # FAQ accordion
│   │   ├── Contact.tsx    # Contact form
│   │   └── Footer.tsx     # Site footer
│   └── three/              # 3D scene components
│       ├── Scene.tsx       # Thin wrapper for WaterCanvas
│       ├── WaterCanvas.tsx # Full-screen WebGL canvas
│       └── MinimalWater.tsx # Full-screen ocean water shader
├── data/
│   └── landing.json       # Static content data
└── hooks/
    ├── useReducedMotion.ts # Accessibility hook
    └── useWaterVisibility.ts # Scroll-based water opacity
```

## 3D Scene Architecture

### WaterCanvas Component (`WaterCanvas.tsx`)

The main 3D canvas wrapper:
- `fixed inset-0 -z-10` positioning for full-screen background
- WebGL2 with WebGL1 fallback chain
- `failIfMajorPerformanceCaveat: false` for iOS compatibility
- DPR capped at 1 on mobile for performance
- Gradient fallback when WebGL unavailable

### MinimalWater (`MinimalWater.tsx`)

**Swimming Pool Visualization** - Pool dimensions 30x50 units filling viewport width.

**Components:**
- Pool floor (30x50 units) with tile pattern and lane markers
- 4 pool walls (visible at edges)
- Transparent water surface (30x50 units) with Gerstner wave animation

**Water Surface Vertex Shader Features:**
- 4 Gerstner waves with varying directions, frequencies, and amplitudes
- Time-based animation
- Foam generation at wave crests

**Water Surface Fragment Shader Features:**
- Transparent water (75% opacity) revealing pool floor
- Diffuse and specular lighting
- Sun reflections on water surface
- Foam at wave crests

**Pool Floor Shader Features:**
- Tile pattern with grout lines
- Lane markers (6 lanes)
- Animated caustic light patterns
- Edge darkening for depth

**Pool Wall Shader Features:**
- Tile texture
- Water line effect (lighter band at water level)
- Depth shading

**Mobile Optimizations:**
- Simplified wave calculation (2 sine waves instead of Gerstner)
- Lower geometry subdivision (48x48 vs 64x64)
- Simplified lighting model

### Water Shader Uniforms

| Uniform | Type | Description |
|---------|------|-------------|
| `uTime` | float | Animation time from clock |
| `uWaterColor` | vec3 | Surface water color (#4FC3F7) |
| `uDeepColor` | vec3 | Deep water color (#0288D1) |
| `uSunColor` | vec3 | Sun reflection color (#FFFDE7) |
| `uOpacity` | float | Water opacity (0-1) |
| `uWaveHeight` | float | Wave amplitude multiplier |

## Z-Index Stacking

```
z-10:   WaterCanvas (fixed background)
z-10:   All sections (Hero, Benefits, Schedule, Pricing, Gallery, Testimonials, FAQ, Contact, Footer)
z-50:   Navigation
z-[5]:  Hero gradient overlay (between water and content)
```

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

## Design Decisions

### Full-Screen Water Background

The water fills the entire viewport behind all content, creating an immersive aquatic atmosphere. Key implementation details:

- Water plane is 150x150 units, camera at [0, 25, 30] sees approximately 100+ units of water
- No pool boundaries - pure ocean aesthetic
- Water fades slightly at edges for seamless blending

### Why Gerstner Waves?

Gerstner waves provide physically-accurate ocean simulation:
- Circular particle motion creates realistic wave profiles
- Multiple overlapping waves create natural interference patterns
- Steepness parameter controls wave sharpness

### iOS Compatibility

Fixed issues that caused black screen and choppy animation:
- `failIfMajorPerformanceCaveat: false` - allows software rendering
- WebGL2 try-first with WebGL1 fallback
- DPR capped at 1 on mobile devices
- Simplified mobile shaders with fewer calculations

### Reduced Motion

The `useReducedMotion` hook detects system preferences and disables:
- Wave animation (uTime frozen at 0)
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
  --color-dark: oklch(...);
  --color-turquoise: oklch(...);

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

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+ (including iOS Safari)
- Edge 90+

WebGL 1.0 minimum required (WebGL 2.0 preferred for better performance).

## License

Private project for Oro Azul Natatorio.
