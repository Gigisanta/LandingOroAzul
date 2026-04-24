# Documentation Index

Welcome to the Oro Azul landing page documentation.

## Quick Links

- [README.md](../README.md) - Project overview and setup guide
- [3D Scene Architecture](3d-scene-architecture.md) - Detailed 3D visualization documentation

## Documentation Map

### Project Overview
- **README.md** - Complete project documentation including:
  - Tech stack and dependencies
  - Project structure
  - Feature descriptions
  - Installation instructions
  - Design decisions

### 3D Visualization
- **docs/3d-scene-architecture.md** - Technical deep dive into:
  - Scene component hierarchy
  - Water shader architecture
  - Caustics shader techniques
  - Pool environment construction
  - Underwater lighting setup
  - Performance considerations

## Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| 3D Engine | React Three Fiber + Three.js |
| Animation | Framer Motion |
| Shaders | Custom GLSL |

## Key Features

1. **3D Swimming Pool Background**
   - Custom water surface shader with wave animation
   - Caustics effect using FBM noise
   - Underwater lighting
   - Pool environment with lane lines, starting blocks, ladders

2. **Responsive Landing Page**
   - Hero section with statistics
   - Class schedule by activity
   - Pricing plans
   - Image gallery
   - Customer testimonials
   - Contact form

3. **Accessibility**
   - Reduced motion support
   - Semantic HTML
   - ARIA labels

## Data Structure

All content is managed via `src/data/landing.json`:
- Business information
- Pricing plans
- Activities and schedules
- Testimonials
- Gallery images

## Development Commands

```bash
npm run dev     # Development server (port 3001)
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint
```

## File Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout
│   ├── page.tsx         # Landing page
│   └── globals.css
├── components/
│   ├── sections/        # UI sections
│   │   ├── Navigation.tsx
│   │   ├── Hero.tsx
│   │   ├── Schedule.tsx
│   │   ├── Pricing.tsx
│   │   ├── Gallery.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   └── three/           # 3D components
│       ├── Scene.tsx
│       ├── Water.tsx
│       ├── Caustics.tsx
│       ├── PoolEnvironment.tsx
│       └── UnderwaterLights.tsx
├── data/
│   └── landing.json     # Static content
└── hooks/
    └── useReducedMotion.ts
```

## Related Documentation

- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber/)
- [Three.js Shaders](https://threejs.org/docs/#api/en/materials/ShaderMaterial)
- [GLSL Reference](https://www.khronos.org/opengl/wiki/Core_Language_(GLSL))
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/docs)
