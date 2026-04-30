'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
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

// Animation variants removed - using inline props for reducedMotion compatibility

export default function Gallery({ images }: GalleryProps) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const reducedMotion = useReducedMotion()

  const handleImageClick = useCallback((image: GalleryImage) => {
    setSelectedImage(image)
  }, [])

  const handleClose = useCallback(() => {
    setSelectedImage(null)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedImage) {
        handleClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedImage, handleClose])

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedImage])

  const filteredImages = useMemo(
    () =>
      activeCategory === 'all'
        ? images
        : images.filter((img) => img.category === activeCategory),
    [activeCategory, images]
  )

  return (
    <section id="galeria" aria-labelledby="galeria-heading" className="relative z-10 py-16 px-4 bg-[var(--color-dark)]/98 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-8"
        >
          <motion.h2
            id="galeria-heading"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-bold mb-4 text-white"
          >
            Nuestra Galería
          </motion.h2>
          <motion.p
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg text-white/70 max-w-2xl mx-auto"
          >
            Conocé nuestras instalaciones y momentos especiales en Oro Azul.
          </motion.p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap justify-center gap-2 mb-10"
          role="group"
          aria-label="Filtrar galería por categoría"
        >
          {categories.map((cat, index) => (
            <motion.button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              aria-pressed={activeCategory === cat.id}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={reducedMotion ? {} : { scale: 1.05, y: -2 }}
              whileTap={reducedMotion ? {} : { scale: 0.95 }}
              transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
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
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {filteredImages.map((image, index) => {
              const isLarge = index === 0 || index === 5
              return (
              <motion.button
                key={image.id}
                onClick={() => handleImageClick(image)}
                initial={reducedMotion ? { opacity: 0, scale: 0.9 } : { opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={reducedMotion ? {} : { scale: 1.06 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                aria-label={image.altText || image.title || 'Ver imagen de galería'}
                className={`relative overflow-hidden rounded-xl group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-turquoise)] aspect-square ${
                  isLarge ? 'md:col-span-2 md:row-span-2' : ''
                }`}
              >
                <Image
                  src={image.imageUrl}
                  alt={image.altText || image.title || 'Galería Oro Azul'}
                  fill
                  className="object-cover transition-transform duration-500"
                  sizes={isLarge ? '(max-width: 768px) 100vw, (max-width: 1024px) 66vw, 50vw' : '(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'}
                  priority={index < 4}
                  loading={index < 4 ? 'eager' : 'lazy'}
                />

                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />

                <motion.div
                  className="absolute inset-0 flex items-end p-4"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {image.title && (
                    <div className="translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <p className="text-white font-medium text-sm md:text-base drop-shadow-lg">{image.title}</p>
                    </div>
                  )}
                </motion.div>

                <div
                  className="absolute inset-0 rounded-xl border border-transparent group-hover:border-[var(--color-turquoise)]/40 transition-colors duration-300"
                  style={{ boxShadow: 'inset 0 0 0 0 rgba(0, 180, 216, 0)' }}
                />
              </motion.button>
            )
            })}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
              onClick={handleClose}
              role="dialog"
              aria-modal="true"
              aria-label="Imagen en detalle"
            >
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                onClick={handleClose}
                className="absolute top-4 right-4 md:top-6 md:right-6 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                aria-label="Cerrar"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </motion.button>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-5xl max-h-[85vh] md:max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative w-full h-full" style={{ aspectRatio: '16/10' }}>
                  <Image
                    src={selectedImage.imageUrl}
                    alt={selectedImage.altText || selectedImage.title || 'Galería Oro Azul'}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 90vw"
                    priority
                  />
                </div>
                {selectedImage.title && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white text-lg font-medium text-center">{selectedImage.title}</p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
