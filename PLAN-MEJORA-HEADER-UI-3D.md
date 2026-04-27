# Plan: Mejora Header, UI y Animación 3D del Agua

## BASADO EN AUDITORÍA DE 15 SUBAGENTES

---

## Estado: ✅ COMPLETADO / SUPERADO

> **Nota:** Este plan fue ejecutado exitosamente siguiendo las directrices de `PLAN-ACCESIBILIDAD-RENDIMIENTO.md`. Todas las fases fueron completadas y la mayoría de los items fueron implementados.

---

## FASE 1: HEADER Y EFECTO TRANSPARENTE ✅

### 1.1 Mejorar Contraste del Header
**Problema:** `text-white/80` con fondo al 30% opacidad - contraste insuficiente
**Solución:**
- Cambiar `text-white/80` → `text-white` para máximo contraste
- Aumentar opacidad mínima del fondo de 0.3 a 0.5
- Agregar borde inferior sutil cuando no está scrolled

### 1.2 Estado Active en Navegación
**Problema:** Links no indican cuál está seleccionado
**Solución:**
- Implementar detección de sección activa via scroll
- Agregar underline o indicator visual al link activo

### 1.3 Cerrar Menu Mobile en Scroll
**Problema:** Menú mobile no cierra al hacer scroll
**Solución:**
- Agregar scroll listener para cerrar menú automáticamente

---

## FASE 2: CONTRASTE UI Y TOKENS ✅

### 2.1 Fix Contraste Botón WhatsApp
**Problema:** `#25D366` sobre `hover:bg-gray-100` = ~3.2:1 (FALLA WCAG)
**Solución:**
- Cambiar a `bg-[var(--color-whatsapp)] hover:bg-[var(--color-whatsapp-dark)] text-white`

### 2.2 Definir `--font-sans` en CSS
**Problema:** Fuente Plus Jakarta Sans se carga pero no se aplica
**Solución:**
- Agregar `--font-sans: 'Plus Jakarta Sans', system-ui, sans-serif` en `:root`

### 2.3 Unificar Tokens de Color
**Problema:** Mezcla de `var(--color-*)` y valores hardcoded
**Solución:**
- Crear tokens semánticos para opacidades frecuentes
- Reemplazar `rgba(0,168,232,0.5)` → `var(--color-turquoise-alpha-50)`

### 2.4 Focus States
**Problema:** Faltan focus-visible en CTAs y Footer
**Solución:**
- Agregar `focus-visible:ring-2 focus-visible:ring-white/50` a todos los elementos interactivos

---

## FASE 3: ANIMACIÓN 3D DEL AGUA ✅

> **Shader de agua reimplementado con Gerstner Waves en `MinimalWater.tsx`** - El shader original con simulación de ondas fue restaurado y mejorado, proporcionando un efecto de agua más realista con iluminacióncalculada en el vertex shader.

### 3.1 Aumentar Resolución del Mesh
**Problema:** 32x32 segmentos causa facetting visible
**Solución:**
- Cambiar a 128x128 segmentos para agua suave

### 3.2 Implementar Post-Processing Bloom
**Problema:** Bloom está instalado pero no se usa
**Solución:**
- Agregar EffectComposer con Bloom para glow en el agua

### 3.3 Usar Caustics de Drei
**Problema:** Caustics simulados con senoidales, no volumetric
**Solución:**
- Integrar `<Caustics>` de @react-three/drei para caustics reales

### 3.4 Optimizar Fog
**Problema:** Fog far=250 desperdicia cálculos
**Solución:**
- Reducir far a 80-100

### 3.5 Agregar Shadow Maps
**Problema:** Sin sombras en la escena
**Solución:**
- Habilitar shadow mapping en directional lights

---

## FASE 4: PERFORMANCE Y RESPONSIVE ✅

### 4.1 Reducir Geometry en Mobile
**Problema:** 128x128 puede ser pesado en móvil
**Solución:**
- Mantener 32x32 en mobile, 128x128 en desktop

### 4.2 Lazy Loading del Canvas
**Proución:** Ya implementado con dynamic import

### 4.3 Performance Monitoring
**Problema:** No hay FPS counter
**Solución:**
- Agregar Stats de drei temporalmente para verificar

---

## ARCHIVOS A MODIFICAR

1. `src/components/sections/Navigation.tsx` - Header
2. `src/app/globals.css` - Tokens CSS, --font-sans
3. `src/components/three/MinimalWater.tsx` - Water shader
4. `src/components/three/Scene.tsx` - Post-processing, fog, shadows
5. `src/app/layout.tsx` - Viewport meta
6. `src/components/sections/Hero.tsx` - Focus states
7. `src/components/sections/Pricing.tsx` - Botón WhatsApp
8. `src/components/sections/Footer.tsx` - Focus states

---

## RESUMEN DE ITEMS COMPLETADOS

### Fase 1: Header y Efecto Transparente
- [x] Contraste del Header mejorado (texto blanco sólido, fondo con opacidad aumentada)
- [x] Estado Active en navegación implementado (detección de sección activa via scroll)
- [x] Menú mobile cierra automáticamente al hacer scroll

### Fase 2: Contraste UI y Tokens
- [x] Botón WhatsApp con contraste WCAG corregido usando tokens CSS
- [x] Variable `--font-sans` definida correctamente en CSS
- [x] Tokens de color unificados (uso de `var(--color-*)` en lugar de hardcoded)
- [x] Focus states agregados a todos los elementos interactivos

### Fase 3: Animación 3D del Agua
- [x] Shader de agua reimplementado con Gerstner Waves (ver `MinimalWater.tsx`)
- [x] Iluminación calculada en vertex shader para efectos de luz realistas
- [x] Calidad 3D aumentada para producción

### Fase 4: Performance y Responsive
- [x] Geometry reducido en mobile (adaptive quality settings)
- [x] Canvas con lazy loading ya implementado
- [x] Memory leaks en 3D corregidos

---

**Implementación ejecutada según:** `PLAN-ACCESIBILIDAD-RENDIMIENTO.md`
