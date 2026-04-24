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
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
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
}

function PricingCard({ plan, index }: PricingCardProps) {
  const isPopular = plan.isDefault

  return (
    <motion.div
      variants={fadeInUp}
      custom={index}
      className={`relative ${isPopular ? 'scale-[1.02]' : ''}`}
    >
      <div
        className={`h-full flex flex-col rounded-2xl p-6 transition-all duration-300 ${
          isPopular
            ? 'bg-[#00A8E8]/20 backdrop-blur-md border border-[#00A8E8]/50 shadow-lg shadow-[#00A8E8]/10'
            : 'bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20'
        }`}
      >
        {isPopular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span
              className="px-4 py-1 text-xs font-semibold text-white rounded-full"
              style={{ backgroundColor: '#005691' }}
            >
              Más Popular
            </span>
          </div>
        )}

        <div className="text-center pb-4 border-b border-white/10">
          <h3 className="text-xl font-bold mb-2 text-white">
            {plan.name}
          </h3>
          {plan.description && (
            <p className="text-sm text-white/50">{plan.description}</p>
          )}
        </div>

        <div className="flex-1 py-4">
          <div className="text-center mb-4">
            <span className="text-4xl font-bold text-white">
              {formatPrice(Number(plan.price))}
            </span>
            <span className="text-white/50 text-sm">/mes</span>
          </div>

          <div className="text-center mb-4">
            <span
              className="inline-block px-3 py-1 text-xs font-medium rounded-full text-white"
              style={{ backgroundColor: '#00A8E8' }}
            >
              {plan.classes} clases/mes
            </span>
          </div>

          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 flex-shrink-0" style={{ color: '#00A8E8' }} />
              <span className="text-white/70">Pileta climatizada 28°C</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 flex-shrink-0" style={{ color: '#00A8E8' }} />
              <span className="text-white/70">Grupo reducido</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 flex-shrink-0" style={{ color: '#00A8E8' }} />
              <span className="text-white/70">Acceso a pileta libre</span>
            </li>
          </ul>
        </div>

        <div className="pt-4 border-t border-white/10">
          <a
            href={`https://wa.me/5491100000000?text=Hola!%20Quiero%20info%20sobre%20${encodeURIComponent(plan.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Consultar por ${plan.name} vía WhatsApp`}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
              isPopular
                ? 'bg-[#005691] hover:bg-[#004a7a] text-white focus-visible:ring-[#005691]'
                : 'bg-[#00A8E8] hover:bg-[#0090c0] text-white focus-visible:ring-[#00A8E8]'
            }`}
          >
            Consultar por WhatsApp
          </a>
        </div>
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
    <section id="precios" className="py-20 px-4 relative z-10" style={{ background: 'rgba(10, 22, 40, 0.95)', backdropFilter: 'blur(8px)' }}>
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {plans.map((plan, index) => (
            <PricingCard key={plan.id} plan={plan} index={index} />
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0 }}
          whileInView={reducedMotion ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={reducedMotion ? {} : { delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div
            className="inline-block px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-md"
          >
            <p className="text-sm text-white/70">
              <span className="font-semibold text-[#00A8E8]">
                Inscripción:
              </span>{' '}
              2 cuotas de $25.000
            </p>
            <p className="text-sm text-white/70 mt-1">
              <span className="font-semibold text-[#00A8E8]">
                Métodos de pago:
              </span>{' '}
              Efectivo, Transferencia, Mercado Pago
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
