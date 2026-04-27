'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface Benefit {
  id: string
  icon: string
  title: string
  description: string
}

const benefits: Benefit[] = [
  {
    id: '1',
    icon: '🏊',
    title: 'Instructores Certificados',
    description: 'Todos nuestros profesionales tienen certificación oficial y años de experiencia enseñando a niños de todas las edades.',
  },
  {
    id: '2',
    icon: '👥',
    title: 'Grupos Reducidos',
    description: 'Máximo 6 alumnos por clase para garantizar atención personalizada y mayor tiempo de práctica para cada niño.',
  },
  {
    id: '3',
    icon: '📈',
    title: 'Progreso Garantizado',
    description: 'Seguimiento individual de cada alumno con nuestro sistema de niveles. Avanzas cuando estás listo, sin presiones.',
  },
  {
    id: '4',
    icon: '🛡️',
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
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

export default function Benefits() {
  const reducedMotion = useReducedMotion()

  return (
    <section
      id="beneficios"
      className="py-24 px-4 bg-[var(--color-dark)]/85 overflow-hidden"
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
            className="text-4xl md:text-5xl font-bold mb-4 text-white"
          >
            ¿Por Qué Elegir Oro Azul?
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg text-white/70 max-w-2xl mx-auto"
          >
            Más de 10 años formando nadadores felices y seguros en el agua.
          </motion.p>
        </motion.div>

        <motion.div
          variants={reducedMotion ? {} : staggerContainer}
          initial={reducedMotion ? undefined : 'hidden'}
          whileInView={reducedMotion ? undefined : 'visible'}
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {benefits.map((benefit) => (
            <motion.div
              key={benefit.id}
              variants={fadeInUp}
              whileHover={reducedMotion ? {} : { scale: 1.03, y: -5 }}
              transition={{ duration: 0.3 }}
              className="bg-[var(--color-dark)]/85 backdrop-blur-xl rounded-2xl p-6 border border-white/40 shadow-2xl shadow-black/40 text-center group"
            >
              <motion.div
                className="text-5xl mb-4 inline-block"
                whileHover={reducedMotion ? {} : { scale: 1.15, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {benefit.icon}
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
              <p className="text-white/70 text-sm leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
