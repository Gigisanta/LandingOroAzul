'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback, useRef, memo } from 'react'
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

const EASE_SMOOTH: [number, number, number, number] = [0.16, 1, 0.3, 1]

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
}

// staggerContainer removed - using inline props for reducedMotion compatibility

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
      ease: EASE_SMOOTH,
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.5,
      ease: EASE_SMOOTH,
    },
  }),
}

const StarRating = memo(function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-[var(--color-turquoise)]' : 'text-white/40'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden={star > rating}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
})

const TestimonialCard = memo(function TestimonialCard({ testimonial, reducedMotion }: { testimonial: Testimonial; reducedMotion: boolean }) {
  return (
    <motion.div
      className="w-full h-full"
      style={{ perspective: 1000 }}
    >
      <motion.div
        initial={{ scale: 1 }}
        whileHover={reducedMotion ? {} : { scale: 1.02 }}
        transition={{ duration: 0.4 }}
        className="bg-[var(--color-dark)]/85 backdrop-blur-xl md:backdrop-blur-md rounded-2xl p-6 border border-white/40 relative overflow-hidden shadow-2xl shadow-black/40 h-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          suppressHydrationWarning
          style={{
            background: 'linear-gradient(135deg, var(--color-primary) 0%, transparent 50%, var(--color-turquoise) 100%)',
          }}
        />

        {/* Static border glow */}
        <div
          className="absolute inset-0 rounded-2xl opacity-20 pointer-events-none"
          suppressHydrationWarning
          style={{
            background: 'linear-gradient(135deg, var(--color-turquoise), var(--color-primary))',
            filter: 'blur(8px)',
          }}
        />

        {/* Decorative quote mark */}
        <div aria-hidden="true" className="absolute top-2 left-4 text-9xl text-white/[0.03] font-serif leading-none select-none">
          &ldquo;
        </div>

        <div className="flex items-center gap-3 mb-4 relative z-10">
          <motion.div
            className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-turquoise)] flex items-center justify-center text-white font-bold text-lg shadow-lg"
            style={{
              boxShadow: '0 0 20px var(--color-turquoise), 0 4px 12px rgba(0,0,0,0.3)',
            }}
            whileHover={reducedMotion ? {} : { scale: 1.1, rotate: 3 }}
            transition={{ duration: 0.3 }}
          >
            {testimonial.name.charAt(0).toUpperCase()}
          </motion.div>
          <div>
            <h4 className="font-semibold text-white text-base">{testimonial.name}</h4>
            <StarRating rating={testimonial.rating} />
          </div>
        </div>

        <p className="text-white/90 text-base leading-relaxed italic relative z-10 mb-3">
          &ldquo;{testimonial.text}&rdquo;
        </p>
        {testimonial.plan && (
          <motion.span
            className="inline-block px-3 py-1 text-sm font-semibold rounded-full text-white relative z-10 shadow-md"
            style={{ backgroundColor: 'var(--color-turquoise-dark)' }}
            whileHover={reducedMotion ? {} : { scale: 1.05, boxShadow: '0 0 20px var(--color-turquoise-dark)' }}
          >
            {testimonial.plan}
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  )
})

function TestimonialCarousel({ testimonials, reducedMotion }: { testimonials: Testimonial[]; reducedMotion: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [direction, setDirection] = useState(1)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!carouselRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsPaused(!entry.isIntersecting),
      { threshold: 0.1 }
    )
    observer.observe(carouselRef.current)
    return () => observer.disconnect()
  }, [])

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
    <div className="md:hidden">
      {/* Navigation arrows */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <motion.button
          onClick={prev}
          whileHover={reducedMotion ? {} : { scale: 1.15, backgroundColor: 'var(--color-surface-20)' }}
          whileTap={reducedMotion ? {} : { scale: 0.9 }}
          className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white min-w-[44px] min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-turquoise)]"
          aria-label="Testimonio anterior"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>

        <div
          ref={carouselRef}
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          role="region"
          aria-label="Testimonios de clientes"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="overflow-hidden max-w-2xl mx-auto">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={testimonials[currentIndex].id}
                custom={direction}
                variants={carouselVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <TestimonialCard
                  testimonial={testimonials[currentIndex]}
                  reducedMotion={reducedMotion}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <motion.button
          onClick={next}
          whileHover={reducedMotion ? {} : { scale: 1.15, backgroundColor: 'var(--color-surface-20)' }}
          whileTap={reducedMotion ? {} : { scale: 0.9 }}
          className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white min-w-[44px] min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-turquoise)]"
          aria-label="Siguiente testimonio"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center gap-3 mt-8 min-w-[44px] min-h-[44px] items-center">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-turquoise)] ${
              index === currentIndex
                ? 'w-8 bg-[var(--color-turquoise)]'
                : 'w-2.5 bg-white/25'
            }`}
            aria-label={`Ir al testimonio ${index + 1}`}
          />
        ))}
      </div>

      {/* Pause/Play Control */}
      <div className="flex justify-center mt-4">
        <motion.button
          onClick={() => setIsPaused(!isPaused)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white min-w-[44px] min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-turquoise)]"
          aria-label={isPaused ? 'Reanudar carousel' : 'Pausar carousel'}
        >
          {isPaused ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          )}
        </motion.button>
      </div>
    </div>
  )
}

const TestimonialGrid = memo(function TestimonialGrid({ testimonials, reducedMotion }: { testimonials: Testimonial[]; reducedMotion: boolean }) {
  const visibleTestimonials = testimonials

  return (
    <div className="hidden md:block">
      <motion.div
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {visibleTestimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <TestimonialCard
              testimonial={testimonial}
              reducedMotion={reducedMotion}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
})

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const reducedMotion = useReducedMotion()

  return (
    <section
      id="testimonios"
      aria-labelledby="testimonios-heading"
      className="py-16 px-4 relative z-10 bg-[var(--color-dark)]/98"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-8"
        >
          <h2 id="testimonios-heading" className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Lo Que Dicen Nuestros Clientes
          </h2>
          <p className="text-lg text-white/70">
            Experiencias reales de familias que confían en Oro Azul.
          </p>
        </motion.div>

        {/* Desktop: Grid view */}
        <TestimonialGrid testimonials={testimonials} reducedMotion={reducedMotion} />

        {/* Mobile: Carousel */}
        <TestimonialCarousel testimonials={testimonials} reducedMotion={reducedMotion} />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="mt-8 text-center"
        >
          <a
            href="#precios"
            className="inline-block px-8 py-3 min-h-[44px] bg-[var(--color-turquoise)] hover:bg-[var(--color-turquoise-dark)] text-white font-semibold rounded-lg transition-colors duration-200 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            Ver precios y empezar hoy
          </a>
        </motion.div>
      </div>
    </section>
  )
}
