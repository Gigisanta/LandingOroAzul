'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Waves, Users, TrendingUp, Shield, LucideIcon } from 'lucide-react'

interface Benefit {
  id: string
  icon: LucideIcon
  title: string
  description: string
}

const benefits: Benefit[] = [
  {
    id: '1',
    icon: Waves,
    title: 'Instructores Certificados',
    description: 'Todos nuestros profesionales tienen certificación oficial y años de experiencia enseñando a niños de todas las edades.',
  },
  {
    id: '2',
    icon: Users,
    title: 'Grupos Reducidos',
    description: 'Máximo 6 alumnos por clase para garantizar atención personalizada y mayor tiempo de práctica para cada niño.',
  },
  {
    id: '3',
    icon: TrendingUp,
    title: 'Progreso Garantizado',
    description: 'Seguimiento individual de cada alumno con nuestro sistema de niveles. Avanzas cuando estás listo, sin presiones.',
  },
  {
    id: '4',
    icon: Shield,
    title: 'Ambiente Seguro',
    description: 'Instalaciones con vigilancia, agua tratada, temperaturas controladas y protocolos de seguridad estrictos.',
  },
]

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
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
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const cardVariants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -4,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
}

const iconVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: { type: 'spring' as const, stiffness: 300, damping: 15 },
  },
}

export default function Benefits() {
  const reducedMotion = useReducedMotion()

  return (
    <section
      id="beneficios"
      className="relative z-10 py-20 md:py-24 px-4 bg-[var(--color-dark)]/98 overflow-hidden contain-layout"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={reducedMotion ? {} : staggerContainer}
          initial={reducedMotion ? undefined : 'hidden'}
          whileInView={reducedMotion ? undefined : 'visible'}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-12"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white"
          >
            ¿Por Qué Elegir Oro Azul?
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-base md:text-lg text-white/70 max-w-2xl mx-auto"
          >
            Más de 10 años formando nadadores felices y seguros en el agua.
          </motion.p>
        </motion.div>

        <motion.div
          variants={reducedMotion ? {} : staggerContainer}
          initial={reducedMotion ? undefined : 'hidden'}
          whileInView={reducedMotion ? undefined : 'visible'}
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
        >
          {benefits.map((benefit) => (
            <motion.div
              key={benefit.id}
              variants={fadeInUp}
              whileHover={reducedMotion ? {} : 'hover'}
              initial="rest"
              animate="rest"
              className="group relative bg-[var(--color-bg-card)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--color-border-light)] shadow-[var(--shadow-card)] cursor-pointer card-transition"
              style={{ contain: 'layout paint' }}
            >
              <motion.div
                variants={reducedMotion ? {} : iconVariants}
                className="mb-5 inline-flex p-4 rounded-xl bg-[var(--color-turquoise-15)]"
              >
                <benefit.icon
                  className="w-7 h-7"
                  style={{ color: 'var(--color-turquoise)' }}
                />
              </motion.div>

              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[var(--color-turquoise)] transition-colors duration-200">
                {benefit.title}
              </h3>
              <p className="text-sm text-white/65 leading-relaxed group-hover:text-white/75 transition-colors duration-200">
                {benefit.description}
              </p>

              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 180, 216, 0.08) 0%, transparent 60%)',
                  boxShadow: 'inset 0 0 30px rgba(0, 180, 216, 0.05)',
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}