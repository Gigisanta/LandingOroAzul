'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface Testimonial {
  id: string
  name: string
  text: string
  rating: number
  plan?: string
}

interface TestimonialsProps {
  testimonials: Testimonial[]
}

const DISPLAY_DURATION = 6000
const TRANSITION_DURATION = 0.7

const carouselVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.9,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: TRANSITION_DURATION,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.5,
      ease: [0.55, 0, 1, 0.45] as [number, number, number, number],
    },
  }),
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-[var(--color-turquoise)]' : 'text-gray-600'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden={star > rating}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function TestimonialCard({ testimonial, direction, reducedMotion }: { testimonial: Testimonial; direction: number; reducedMotion: boolean }) {
  return (
    <motion.div
      custom={direction}
      variants={carouselVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="w-full max-w-2xl mx-auto"
      style={{ perspective: 1000 }}
    >
      <motion.div
        initial={{ scale: 1, rotateX: 0 }}
        whileHover={{ scale: 1.02, rotateX: 2 }}
        transition={{ duration: 0.4 }}
        className="bg-[var(--color-dark)]/85 backdrop-blur-xl rounded-2xl p-8 border border-white/40 relative overflow-hidden shadow-2xl shadow-black/40"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, var(--color-primary) 0%, transparent 50%, var(--color-turquoise) 100%)',
          }}
        />

        {/* Static border glow */}
        <div
          className="absolute inset-0 rounded-2xl opacity-20 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, var(--color-turquoise), var(--color-primary))',
            filter: 'blur(8px)',
          }}
        />

        {/* Decorative quote mark */}
        <div className="absolute top-2 left-4 text-9xl text-white/[0.03] font-serif leading-none select-none">
          &ldquo;
        </div>

        <div className="flex items-center gap-4 mb-6 relative z-10">
          <motion.div
            className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-turquoise)] flex items-center justify-center text-white font-bold text-xl shadow-lg"
            style={{
              boxShadow: '0 0 20px var(--color-turquoise), 0 4px 12px rgba(0,0,0,0.3)',
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            {testimonial.name.charAt(0).toUpperCase()}
          </motion.div>
          <div>
            <h4 className="font-semibold text-white text-lg">{testimonial.name}</h4>
            <StarRating rating={testimonial.rating} />
          </div>
        </div>

        <p className="text-white/90 text-lg leading-relaxed italic relative z-10 mb-4">
          &ldquo;{testimonial.text}&rdquo;
        </p>
        {testimonial.plan && (
          <motion.span
            className="inline-block px-4 py-1.5 text-sm font-semibold rounded-full text-white relative z-10 shadow-md"
            style={{ backgroundColor: 'var(--color-turquoise-dark)' }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px var(--color-turquoise-dark)' }}
          >
            {testimonial.plan}
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  )
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const reducedMotion = useReducedMotion()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [direction, setDirection] = useState(1)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex((prev) => {
        setDirection(index > prev ? 1 : -1)
        return index
      })
    },
    []
  )

  const next = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }, [testimonials.length])

  const prev = useCallback(() => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [testimonials.length])

  useEffect(() => {
    if (reducedMotion || isPaused || testimonials.length <= 1) return

    intervalRef.current = setInterval(() => {
      next()
    }, DISPLAY_DURATION)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [reducedMotion, isPaused, testimonials.length, next])

  return (
    <section
      id="testimonios"
      className="py-16 px-4 relative z-10"
      style={{ background: 'rgba(10, 22, 40, 0.92)', backdropFilter: 'blur(12px)' }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Lo Que Dicen Nuestros Clientes
          </h2>
          <p className="text-lg text-white/70">
            Experiencias reales de familias que confían en Oro Azul.
          </p>
        </motion.div>

        {/* Navigation arrows */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <motion.button
            onClick={prev}
            whileHover={{ scale: 1.15, backgroundColor: 'rgba(255,255,255,0.2)' }}
            whileTap={{ scale: 0.9 }}
            className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white min-w-[44px] min-h-[44px]"
            aria-label="Testimonio anterior"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            role="region"
            aria-label="Testimonios de clientes"
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <TestimonialCard
                  key={testimonials[currentIndex].id}
                  testimonial={testimonials[currentIndex]}
                  direction={direction}
                  reducedMotion={reducedMotion}
                />
              </AnimatePresence>
            </div>
          </div>

          <motion.button
            onClick={next}
            whileHover={{ scale: 1.15, backgroundColor: 'rgba(255,255,255,0.2)' }}
            whileTap={{ scale: 0.9 }}
            className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white min-w-[44px] min-h-[44px]"
            aria-label="Siguiente testimonio"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goTo(index)}
              animate={{
                width: index === currentIndex ? 32 : 10,
                backgroundColor: index === currentIndex
                  ? 'var(--color-turquoise)'
                  : 'rgba(255,255,255,0.3)',
              }}
              whileHover={{ scale: 1.2 }}
              className="h-2.5 rounded-full"
              aria-label={`Ir al testimonio ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
