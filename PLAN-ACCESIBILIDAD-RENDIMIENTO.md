# Plan: Accesibilidad, Colorimetría y Rendimiento

## Estado: ✅ COMPLETADO

---

## CRITICAL (Bloquean Merge) ✅

### 1. Skip Link + Focus Management ✅
**Archivos:** `layout.tsx`, `page.tsx`
- Añadir skip-to-content link visible en focus ✅
- Añadir `id="main-content"` a `<main>` ✅

### 2. Mobile Menu Focus Trap + Escape Key ✅
**Archivo:** `Navigation.tsx`
- Implementar focus trap con `useRef` y `useEffect` ✅
- Añadir listener para Escape key cierra menu ✅
- Restaurar focus en toggle button al cerrar ✅

### 3. Focus-Visible Outlines ✅
**Archivos:** `Hero.tsx`, `Contact.tsx`, `Footer.tsx`, `Testimonials.tsx`
- Hero CTAs: añadir `focus-visible:ring-white/50` ✅
- Contact links: añadir `focus-visible:ring-turquoise` ✅
- Footer links: añadir `focus-visible:ring-turquoise` ✅
- Testimonials carousel: añadir `focus-visible:ring-turquoise` ✅

---

## HIGH Priority ✅

### 4. useReducedMotion en Navigation y 3D ✅
**Archivos:** `Navigation.tsx`, `Scene.tsx`, `MinimalWater.tsx`
- Navigation: usar `useReducedMotion` para hide/show y menu animations ✅
- 3D Scene: pausar shader animation cuando reduced motion activo ✅

### 5. Gallery Keyboard Accessibility ✅
**Archivo:** `Gallery.tsx`
- Galería items necesitan `tabIndex={0}` o envolver en `<button>` ✅
- Category filter con `onKeyDown` handler ✅

### 6. Pricing Cards Keyboard Focus ✅
**Archivo:** `Pricing.tsx`
- Cards: añadir `tabIndex={0}` y `focus-visible` styles ✅

### 7. Touch Target Fixes ✅
**Archivos:** `Contact.tsx`, `Testimonials.tsx`
- WhatsApp CTA: añadir `min-h-[44px]` ✅
- Testimonial dots: envolver en container con `min-w-[44px] min-h-[44px]` ✅

### 8. 3D Memory Cleanup ✅
**Archivo:** `MinimalWater.tsx`
- Disponer geometry y material en cleanup effect ✅

### 9. 3D ErrorBoundary ✅
**Archivo:** `page.tsx`, `ErrorBoundary.tsx`
- Crear ErrorBoundary component ✅
- Envolver Scene en ErrorBoundary ✅

### 10. Font Loading (next/font) ✅
**Archivo:** `layout.tsx`
- Reemplazar Google Fonts manual con `next/font/google` ✅
- Eliminar render-blocking ✅

### 11. Gallery Next/Image ✅
**Archivo:** `Gallery.tsx`
- Reemplazar `<motion.img>` con Next.js `<Image>` ✅
- Añadir explicit width/height para CLS ✅ (usando fill + aspect-square)

---

## MEDIUM Priority ✅

### 12. Navigation aria-controls ✅
**Archivo:** `Navigation.tsx`
- Añadir `aria-controls="mobile-menu"` a menu button ✅

### 13. scroll-padding-top ✅
**Archivo:** `globals.css`
- Añadir `scroll-padding-top: 80px` para fixed header ✅

### 14. Inline rgba → CSS Variables ✅
**Archivos:** `Contact.tsx`, `Gallery.tsx`, `Navigation.tsx`
- Reemplazar `rgba(0, 168, 232, 0.1)` con variable CSS ✅
- Creados tokens: `--color-turquoise-10`, `--color-turquoise-20`, `--color-turquoise-40` ✅

### 15. CSS Tokens (Spacing/Radius/Shadow) ✅
**Archivo:** `globals.css`
- Crear tokens: `--space-section-sm/md/lg`, `--radius-sm/md/lg`, `--shadow-sm/md/lg` ✅

### 16. Typography Mobile Fix ✅
- Subir `text-sm` a `text-base` (16px) en nav links, pricing, gallery, schedule, footer, testimonials ✅

---

## Actualización de Paleta (2026-04-25) ✅

### Extensión de tokens CSS ✅
**Archivo:** `globals.css`
- `--color-bg-overlay-90`: rgba(10, 22, 40, 0.9) para Navigation scrolled
- `--color-bg-overlay-60`: rgba(10, 22, 40, 0.6) para Navigation normal
- `--color-surface-40`: rgba(255, 255, 255, 0.4)
- `--color-surface-45`: rgba(255, 255, 255, 0.45)

### Componentes actualizados ✅
- `Navigation.tsx`: background overlay → tokens CSS
- `Gallery.tsx`: border glow → turquoise-50/turquoise-30
- `Testimonials.tsx`: dark overlay + surface-20 + surface-45
- `Pricing.tsx`: dark overlay → token CSS

### Accesibilidad adicional (2026-04-25) ✅
- `Gallery.tsx`: Cambiado `motion.div role="button"` → `motion.a` con href para apertura en nueva pestaña (semantic correct)

---

## Orden de Implementación

1. Skip link + main content id ✅
2. Mobile menu focus trap + Escape ✅
3. Focus-visible outlines (Hero, Contact, Footer, Testimonials) ✅
4. useReducedMotion en Navigation ✅
5. Touch targets (WhatsApp, dots) ✅
6. Gallery keyboard + Next/Image ✅
7. Pricing cards tabIndex ✅
8. 3D ErrorBoundary + memory cleanup ✅
9. next/font ✅
10. CSS tokens + inline styles fix ✅
11. aria-controls + scroll-padding ✅
12. Typography mobile fix ✅
