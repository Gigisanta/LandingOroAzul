'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { Testimonial } from '@/lib/api'

interface TestimonialsProps {
  testimonials: Testimonial[]
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
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-[#00A8E8]' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: Testimonial
  index: number
}) {
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      variants={reducedMotion ? {} : fadeInUp}
      custom={index}
      className="bg-white rounded-2xl p-6 shadow-sm border border-[#005691]/10"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#005691] to-[#00A8E8] flex items-center justify-center text-white font-bold text-lg">
          {testimonial.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h4 className="font-semibold" style={{ color: '#005691' }}>
            {testimonial.name}
          </h4>
          <StarRating rating={testimonial.rating} />
        </div>
      </div>
      <p className="text-gray-600 italic">"{testimonial.text}"</p>
      {testimonial.plan && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span
            className="inline-block px-3 py-1 text-xs font-medium rounded-full text-white"
            style={{ backgroundColor: '#00A8E8' }}
          >
            {testimonial.plan}
          </span>
        </div>
      )}
    </motion.div>
  )
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const reducedMotion = useReducedMotion()

  return (
    <section
      id="testimonios"
      className="py-24 px-4 bg-gradient-to-b from-[#F0F8FF] to-white"
    >
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
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: '#005691' }}
          >
            Lo Que Dicen Nuestros Clientes
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Experiencias reales de familias que confían en Oro Azul.
          </motion.p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={reducedMotion ? {} : staggerContainer}
          initial={reducedMotion ? undefined : 'hidden'}
          whileInView={reducedMotion ? undefined : 'visible'}
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
