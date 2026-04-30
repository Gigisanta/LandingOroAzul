'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// Animation variants removed - using inline props for reducedMotion compatibility

interface HeroProps {
  businessName?: string
}

export default function Hero({ businessName = 'Oro Azul' }: HeroProps) {
  const reducedMotion = useReducedMotion()

  return (
    <section
      id="inicio"
      className="relative min-h-screen z-10 flex flex-col items-center justify-center px-4 pt-20"
      aria-labelledby="hero-heading"
    >
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(10,22,40,0.7) 0%, rgba(10,22,40,0.5) 40%, rgba(10,22,40,0.75) 100%)',
        }}
      />

      <div className="relative z-20 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <motion.h1
            id="hero-heading"
            initial={reducedMotion ? { opacity: 0, y: 20 } : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]"
          >
            <span className="text-white" style={{ textShadow: '0 2px 12px rgba(0, 0, 0, 0.6), 0 1px 2px rgba(0, 0, 0, 0.4)' }}>Aprendé a nadar</span>
            <br />
            <span
              className="text-[var(--color-turquoise-light)]"
              style={{ textShadow: '0 0 30px rgba(0, 180, 216, 0.5)' }}
            >
              toda tu vida
            </span>
          </motion.h1>

          <motion.p
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl lg:text-2xl text-white/85 max-w-2xl mb-10 leading-relaxed"
            style={{ textShadow: '0 1px 4px rgba(0, 0, 0, 0.4)' }}
          >
            Clases de natación para todas las edades, rehabilitación acuática y actividades
            recreativas en un ambiente seguro y profesional.
          </motion.p>

          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <motion.a
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              href="#horarios"
              className="group relative px-8 py-3.5 min-h-[48px] bg-[var(--color-turquoise)] hover:bg-[var(--color-turquoise-dark)] text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              style={{ boxShadow: 'var(--shadow-button), 0 0 0 0 rgba(0, 180, 216, 0)' }}
              whileHover={reducedMotion ? {} : { y: -2, boxShadow: 'var(--shadow-button-hover), 0 0 20px rgba(0, 180, 216, 0.3)' }}
              whileTap={reducedMotion ? {} : { scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span>Ver horarios</span>
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.a>
            <motion.a
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              href="#precios"
              className="group px-8 py-3.5 min-h-[48px] border-2 border-white/30 hover:border-white/60 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-turquoise)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-dark)]"
              whileHover={reducedMotion ? {} : { y: -2, backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={reducedMotion ? {} : { scale: 0.98 }}
            >
              <span>Reservar clase gratis</span>
              <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div
          role="region"
          aria-label="Estadísticas del club"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-10 md:gap-16 lg:gap-20"
        >
          {[
            { value: '500+', label: 'Alumnos', icon: '👥' },
            { value: '15+', label: 'Años', icon: '🏊' },
            { value: '28°C', label: 'Agua climatizada', icon: '🌡️' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={reducedMotion ? {} : { scale: 1.05 } }
              transition={{ duration: 0.7, delay: 0.15 * index, ease: [0.16, 1, 0.3, 1] }}
              className="text-center will-change-transform"
            >
              <div
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2"
                style={{ color: 'var(--color-turquoise-light)', textShadow: '0 0 30px rgba(72, 202, 228, 0.5)' }}
              >
                {stat.value}
              </div>
              <div className="text-white/75 text-sm md:text-base uppercase tracking-wider font-medium" style={{ textShadow: '0 1px 4px rgba(0, 0, 0, 0.5)' }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={reducedMotion ? undefined : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={reducedMotion ? {} : { y: [0, 8, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative"
        >
          <div className="absolute inset-0 bg-[var(--color-turquoise)]/20 rounded-full blur-md" />
          <svg
            className="w-7 h-7 text-white/70 relative z-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}