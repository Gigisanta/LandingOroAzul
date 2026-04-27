'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface PricingPlan {
  id: string
  name: string
  classes: number
  price: number
  currency: string
  description?: string
  features: string[]
  isDefault?: boolean
}

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

interface PricingCardProps {
  plan: PricingPlan
  index: number
  reducedMotion: boolean
}

function PricingCard({ plan, index, reducedMotion }: PricingCardProps) {
  const isPopular = plan.isDefault

  return (
    <motion.div
      variants={fadeInUp}
      custom={index}
      whileHover={reducedMotion ? {} : { y: -8, transition: { duration: 0.3 } }}
      tabIndex={0}
      role="article"
      aria-label={`Plan ${plan.name}: ${plan.classes} clases por mes a ${plan.price} pesos`}
      className={`relative ${isPopular ? 'scale-[1.02] overflow-hidden' : ''} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-turquoise)] rounded-2xl`}
    >
      <div
        className={`h-full flex flex-col rounded-2xl p-6 transition-all duration-300 ${
          isPopular
            ? 'bg-[var(--color-turquoise)]/25 backdrop-blur-xl border border-[var(--color-turquoise)]/50 shadow-2xl shadow-black/30'
            : 'bg-[var(--color-dark)]/85 backdrop-blur-xl hover:bg-[var(--color-dark)]/90 border border-white/40 shadow-2xl shadow-black/40'
        }`}
      >
        {isPopular && (
          <motion.div
            initial={reducedMotion ? undefined : { scale: 0 }}
            animate={reducedMotion ? undefined : { scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
            className="absolute -top-3 left-1/2 -translate-x-1/2"
          >
            <span
              className="px-4 py-1 text-xs font-semibold text-white rounded-full"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Más Popular
            </span>
          </motion.div>
        )}

        <div className="text-center pb-4 border-b border-white/10">
          <motion.h3
            className="text-xl font-bold mb-2 text-white"
            whileHover={reducedMotion ? {} : { scale: 1.05 }}
          >
            {plan.name}
          </motion.h3>
          {plan.description && (
            <p className="text-base text-white/90">{plan.description}</p>
          )}
        </div>

        <div className="flex-1 py-4">
          <div className="text-center mb-4">
            <motion.span
              className="text-4xl font-bold text-white"
              whileHover={reducedMotion ? {} : { scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {formatPrice(plan.price)}
            </motion.span>
            <span className="text-white/90 text-base">/mes</span>
          </div>

          <div className="text-center mb-4">
            <motion.span
              className="inline-block px-3 py-1 text-xs font-medium rounded-full text-white"
              style={{ backgroundColor: 'var(--color-turquoise-dark)' }}
              whileHover={reducedMotion ? {} : { scale: 1.1 }}
            >
              {plan.classes} clases/mes
            </motion.span>
          </div>

          <ul className="space-y-2">
            {plan.features.map((feature, idx) => (
              <motion.li
                key={idx}
                className="flex items-center gap-2 text-base"
                initial={reducedMotion ? undefined : { opacity: 0, x: -10 }}
                whileInView={reducedMotion ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <motion.div
                  whileHover={reducedMotion ? {} : { scale: 1.2, rotate: 10 }}
                >
                  <Check className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-turquoise)' }} />
                </motion.div>
                <span className="text-white">{feature}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <motion.div
          className="pt-4 border-t border-white/10"
          whileHover={reducedMotion ? {} : { scale: 1.02 }}
        >
          <a
            href={`https://wa.me/5491100000000?text=Hola!%20Quiero%20info%20sobre%20${encodeURIComponent(plan.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Consultar por ${plan.name} vía WhatsApp`}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 min-h-[44px] flex items-center justify-center ${
              isPopular
                ? 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white focus-visible:ring-[var(--color-primary)]'
                : 'bg-[var(--color-turquoise)] hover:bg-[var(--color-turquoise-dark)] text-white focus-visible:ring-[var(--color-turquoise)]'
            }`}
          >
            Consultar por WhatsApp
          </a>
        </motion.div>
      </div>
    </motion.div>
  )
}

interface PricingProps {
  plans: PricingPlan[]
}

export default function Pricing({ plans }: PricingProps) {
  const reducedMotion = useReducedMotion()

  return (
    <section id="precios" aria-labelledby="precios-heading" className="py-20 px-4 relative z-10" style={{ background: 'var(--color-dark-overlay)', backdropFilter: 'blur(12px)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          variants={reducedMotion ? {} : staggerContainer}
          initial={reducedMotion ? undefined : 'hidden'}
          whileInView={reducedMotion ? undefined : 'visible'}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-12"
        >
          <motion.h2
            id="precios-heading"
            variants={reducedMotion ? {} : fadeInUp}
            className="text-4xl md:text-5xl font-bold mb-4 text-white"
          >
            Nuestros Planes
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg text-white/70 max-w-2xl mx-auto"
          >
            Encontrá el plan perfecto para vos. Todas las clases incluyen acceso a nuestras
            instalaciones.
          </motion.p>
        </motion.div>

        {/* Pricing Grid */}
        <motion.div
          variants={reducedMotion ? {} : staggerContainer}
          initial={reducedMotion ? undefined : 'hidden'}
          whileInView={reducedMotion ? undefined : 'visible'}
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
        >
          {plans.map((plan, index) => (
            <PricingCard key={plan.id} plan={plan} index={index} reducedMotion={reducedMotion} />
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          variants={scaleIn}
          initial={reducedMotion ? undefined : 'hidden'}
          whileInView={reducedMotion ? undefined : 'visible'}
          viewport={{ once: true }}
          transition={reducedMotion ? {} : { delay: 0.4 }}
          className="mt-12 text-center"
        >
          <motion.div
            className="inline-block px-6 py-4 rounded-2xl bg-[var(--color-dark)]/70 backdrop-blur-xl border border-white/30 shadow-2xl shadow-black/30"
            whileHover={reducedMotion ? {} : { scale: 1.05 } }
          >
            <p className="text-base text-white/90">
              <span className="font-semibold text-[var(--color-turquoise)]">
                Inscripción:
              </span>{' '}
              2 cuotas de $25.000
            </p>
            <p className="text-base text-white/90 mt-1">
              <span className="font-semibold text-[var(--color-turquoise)]">
                Métodos de pago:
              </span>{' '}
              Efectivo, Transferencia, Mercado Pago
            </p>
          </motion.div>
        </motion.div>

        {/* Urgent CTA */}
        <motion.div
          variants={scaleIn}
          initial={reducedMotion ? undefined : 'hidden'}
          whileInView={reducedMotion ? undefined : 'visible'}
          viewport={{ once: true }}
          transition={reducedMotion ? {} : { delay: 0.5 }}
          className="mt-8 text-center"
        >
          <a
            href="https://wa.me/5491100000000?text=Hola!%20Quiero%20reservar%20una%20clase%20gratis"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 min-h-[44px] bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold rounded-lg transition-colors duration-200 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            Reservar clase gratis
          </a>
          <p className="mt-3 text-white/70 text-sm">Cupos limitados - Inscripciones abiertas</p>
        </motion.div>
      </div>
    </section>
  )
}
