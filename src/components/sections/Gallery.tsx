'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { GalleryImage } from '@/lib/api'

interface GalleryProps {
  images: GalleryImage[]
}

const categories = [
  { id: 'all', label: 'Todas' },
  { id: 'pool', label: 'Pileta' },
  { id: 'classes', label: 'Clases' },
  { id: 'facilities', label: 'Instalaciones' },
]

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

export default function Gallery({ images }: GalleryProps) {
  const [activeCategory, setActiveCategory] = useState('all')
  const reducedMotion = useReducedMotion()

  const filteredImages =
    activeCategory === 'all'
      ? images
      : images.filter((img) => img.category === activeCategory)

  return (
    <section id="galeria" className="py-24 px-4 bg-white">
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
            Nuestra Galería
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Conocé nuestras instalaciones y momentos especiales en Oro Azul.
          </motion.p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                activeCategory === cat.id
                  ? 'bg-[#005691] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <motion.div
          variants={reducedMotion ? {} : staggerContainer}
          initial={reducedMotion ? undefined : 'hidden'}
          whileInView={reducedMotion ? undefined : 'visible'}
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              variants={fadeInUp}
              className={`relative overflow-hidden rounded-xl group ${
                index === 0 || index === 5 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <img
                src={image.imageUrl}
                alt={image.altText || image.title || 'Galería Oro Azul'}
                className="w-full h-full object-cover aspect-square group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                {image.title && (
                  <p className="text-white font-medium text-sm">{image.title}</p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
