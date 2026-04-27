'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface GalleryImage {
  id: string
  title?: string
  altText?: string
  imageUrl: string
  category: string
}

interface GalleryProps {
  images: GalleryImage[]
}

const categories = [
  { id: 'all', label: 'Todas' },
  { id: 'facility', label: 'Pileta' },
  { id: 'classes', label: 'Clases' },
]

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
}

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const imageHoverVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.08,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
}

const overlayVariants = {
  rest: { opacity: 0 },
  hover: { opacity: 1 },
}

export default function Gallery({ images }: GalleryProps) {
  const [activeCategory, setActiveCategory] = useState('all')
  const reducedMotion = useReducedMotion()

  const filteredImages =
    activeCategory === 'all'
      ? images
      : images.filter((img) => img.category === activeCategory)

  return (
    <section id="galeria" aria-labelledby="galeria-heading" className="py-24 px-4 bg-[var(--color-dark)]/90 backdrop-blur-xl overflow-hidden">
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
            id="galeria-heading"
            variants={reducedMotion ? {} : fadeInUp}
            className="text-4xl md:text-5xl font-bold mb-4 text-white"
          >
            Nuestra Galería
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg text-white/70 max-w-2xl mx-auto"
          >
            Conocé nuestras instalaciones y momentos especiales en Oro Azul.
          </motion.p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          variants={reducedMotion ? {} : staggerContainer}
          initial={reducedMotion ? undefined : 'hidden'}
          whileInView={reducedMotion ? undefined : 'visible'}
          viewport={{ once: true, margin: '-50px' }}
          className="flex flex-wrap justify-center gap-2 mb-10"
          role="group"
          aria-label="Filtrar galería por categoría"
        >
          {categories.map((cat, index) => (
            <motion.button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              aria-pressed={activeCategory === cat.id}
              variants={reducedMotion ? {} : fadeInUp}
              whileHover={reducedMotion ? {} : { scale: 1.05, y: -2 }}
              whileTap={reducedMotion ? {} : { scale: 0.95 }}
              className={`px-5 py-3 rounded-full font-medium text-base transition-all duration-200 min-h-[44px] flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 ${
                activeCategory === cat.id
                  ? 'bg-[var(--color-turquoise)] text-[var(--color-dark)] shadow-lg shadow-[var(--color-turquoise)]/20'
                  : 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/40 hover:text-white'
              }`}
            >
              {cat.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Image Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            variants={reducedMotion ? {} : staggerContainer}
            initial={reducedMotion ? undefined : 'hidden'}
            whileInView={reducedMotion ? undefined : 'visible'}
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {filteredImages.map((image, index) => (
              <motion.a
                key={image.id}
                href={image.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                variants={reducedMotion ? {} : fadeInScale}
                whileHover={reducedMotion ? {} : 'hover'}
                initial={reducedMotion ? undefined : 'rest'}
                animate="rest"
                aria-label={image.altText || image.title || 'Ver imagen de galería'}
                className={`relative overflow-hidden rounded-xl group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-turquoise)] aspect-square ${
                  index === 0 || index === 5 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
              >
                <Image
                  src={image.imageUrl}
                  alt={image.altText || image.title || 'Galería Oro Azul'}
                  fill
                  className="object-cover aspect-square"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />

                {/* Gradient overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                  variants={reducedMotion ? {} : overlayVariants}
                  transition={{ duration: 0.3 }}
                />

                {/* Content overlay */}
                <motion.div
                  className="absolute inset-0 flex items-end p-4"
                  variants={reducedMotion ? {} : overlayVariants}
                  transition={{ duration: 0.3 }}
                >
                  {image.title && (
                    <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <p className="text-white font-medium text-base drop-shadow-lg">{image.title}</p>
                    </div>
                  )}
                </motion.div>

                {/* Border glow on hover */}
                <motion.div
                  className="absolute inset-0 rounded-xl border-2 border-transparent pointer-events-none"
                  whileHover={reducedMotion ? {} : {
                    borderColor: 'var(--color-turquoise-50)',
                    boxShadow: '0 0 20px var(--color-turquoise-30)',
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
