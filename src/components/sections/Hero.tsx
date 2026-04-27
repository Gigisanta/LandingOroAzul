'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

interface HeroProps {
  businessName?: string
}

export default function Hero({ businessName = 'Oro Azul' }: HeroProps) {
  const reducedMotion = useReducedMotion()

  return (
    <section id="inicio" className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 pt-20" aria-labelledby="hero-heading">
      {/* Dark gradient overlay for better text contrast */}
      <div className="absolute inset-0 bg-[var(--color-dark)]/85 pointer-events-none" />
      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Title */}
        <motion.h1
          id="hero-heading"
          variants={reducedMotion ? {} : fadeInUp}
          initial={reducedMotion ? undefined : 'hidden'}
          animate="visible"
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6"
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
        >
          Aprendé a nadar{' '}
          <span className="text-[var(--color-turquoise)]">toda tu vida</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={reducedMotion ? {} : fadeInUp}
          initial={reducedMotion ? undefined : 'hidden'}
          animate="visible"
          transition={reducedMotion ? { delay: 0 } : { delay: 0.4 }}
          className="text-xl md:text-2xl text-white/90 max-w-2xl mb-10"
        >
          Clases de natación para todas las edades, rehabilitación acuática y actividades
          recreativas en un ambiente seguro y profesional.
        </motion.p>

        {/* Urgency Badge */}
        <motion.div
          variants={reducedMotion ? {} : fadeInUp}
          initial={reducedMotion ? undefined : 'hidden'}
          animate="visible"
          className="mb-6 px-4 py-2 bg-[var(--color-turquoise)]/20 border border-[var(--color-turquoise)]/40 rounded-full"
        >
          <span className="text-[var(--color-turquoise)] font-semibold text-sm">Inscripciones abiertas - Cupos limitados</span>
        </motion.div>

        {/* CTAs */}
        <motion.div
          variants={reducedMotion ? {} : staggerContainer}
          initial={reducedMotion ? undefined : 'hidden'}
          animate="visible"
          className="flex flex-col sm:flex-row gap-4 mb-16"
        >
          <motion.a
            variants={reducedMotion ? {} : fadeInUp}
            href="#horarios"
            className="px-8 py-3 min-h-[44px] bg-[var(--color-turquoise)] hover:bg-[var(--color-turquoise-dark)] text-white font-semibold rounded-lg transition-colors duration-200 text-center flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
          >
            Ver horarios
          </motion.a>
          <motion.a
            variants={reducedMotion ? {} : fadeInUp}
            href="#precios"
            className="px-8 py-3 min-h-[44px] border-2 border-white/50 hover:border-white text-white font-semibold rounded-lg transition-colors duration-200 text-center flex items-center justify-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-turquoise)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-dark)]"
          >
            Reservar clase gratis
          </motion.a>
        </motion.div>

        {/* Stats */}
        <motion.div
          role="region"
          aria-label="Estadísticas del club"
          variants={reducedMotion ? {} : staggerContainer}
          initial={reducedMotion ? undefined : 'hidden'}
          animate="visible"
          className="flex flex-wrap justify-center gap-8 md:gap-16"
        >
          {[
            { value: '500+', label: 'Alumnos' },
            { value: '15+', label: 'Años' },
            { value: '28°C', label: 'Agua climatizada' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={reducedMotion ? {} : fadeInUp}
              className="text-center"
            >
              <div
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
                style={{ color: 'var(--color-turquoise)' }}
              >
                {stat.value}
              </div>
              <div className="text-white/90 text-sm md:text-base uppercase tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={reducedMotion ? undefined : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={reducedMotion ? {} : { y: [0, 8, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <svg
            className="w-8 h-8 text-white/60"
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
