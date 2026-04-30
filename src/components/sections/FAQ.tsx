'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface FAQItem {
  id: string
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    id: '1',
    question: '¿A partir de qué edad pueden asistir los niños?',
    answer: 'Acceptamos niños desde los 3 años de edad. Contamos con clases específicas para bebés (con padre/madre), niños pequeños, y todas las edades hasta adultos mayores.',
  },
  {
    id: '2',
    question: '¿Cómo funciona el sistema de progression?',
    answer: 'Seguimos un programa estructurado con 6 niveles. Cada alumno avanza a su propio ritmo, pasando al siguiente nivel cuando demuestra dominio de las habilidades requeridas. Los instructores evalúan constantemente el progreso.',
  },
  {
    id: '3',
    question: '¿Qué incluye la matrícula?',
    answer: 'La matrícula incluye el acceso a nuestra plataforma de seguimiento, materiales de clase (aletas, tablas, pullboys), y el primer mes de seguro deportivo. No hay costos ocultos.',
  },
  {
    id: '4',
    question: '¿Puedo cancelar o pausar mi suscripción?',
    answer: 'Sí, puedes pausar hasta 30 días por año sin costo adicional. La cancelación se puede hacer con 15 días de anticipación. No hay penalidades por terminar tu membresía.',
  },
  {
    id: '5',
    question: '¿Qué pasa si pierdo una clase?',
    answer: 'Ofrecemos hasta 2 clases de recuperación por mes que puedes usar en cualquier horario disponible. Las clases no usadas no se acumulan para el mes siguiente.',
  },
  {
    id: '6',
    question: '¿Los instructores están certificados?',
    answer: 'Todos nuestros instructores tienen certificación oficial de la Federación de Natación, primeros auxilios pediátricos, y más de 3 años de experiencia enseñando a niños.',
  },
  {
    id: '7',
    question: '¿Hay clases de prueba gratuitas?',
    answer: 'Sí, ofrecemos una clase de prueba sin compromiso para que puedas conocer nuestras instalaciones, conocer al instructor, y ver si tu hijo se siente cómodo antes de matricular.',
  },
]

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
}

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null)
  const reducedMotion = useReducedMotion()

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <section
      id="faq"
      className="py-16 px-4 relative z-10 bg-[var(--color-dark)]/98"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Preguntas Frecuentes
          </h2>
          <p className="text-lg text-white/70">
            Todo lo que necesitás saber sobre nuestras clases de natación.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="bg-[var(--color-bg-card)] backdrop-blur-xl rounded-xl border border-[var(--color-border-light)] hover:border-[var(--color-border-medium)] overflow-hidden card-transition">
                <button
                  onClick={() => toggle(faq.id)}
                  aria-expanded={openId === faq.id}
                  aria-controls={`faq-answer-${faq.id}`}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left min-h-[52px] group"
                >
                  <span className="font-semibold text-white group-hover:text-[var(--color-turquoise)] transition-colors duration-200 pr-2">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openId === faq.id ? 180 : 0, scale: openId === faq.id ? 1.1 : 1 }}
                    transition={{ duration: 0.25 }}
                    className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--color-surface-15)] group-hover:bg-[var(--color-turquoise-20)] flex items-center justify-center transition-colors duration-200"
                  >
                    <ChevronDown className="w-4 h-4 text-white/80 group-hover:text-[var(--color-turquoise)] transition-colors duration-200" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openId === faq.id && (
                    <motion.div
                      id={`faq-answer-${faq.id}`}
                      initial={{ maxHeight: 0, opacity: 0 }}
                      animate={{ maxHeight: 300, opacity: 1 }}
                      exit={{ maxHeight: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4 text-white/75 leading-relaxed border-t border-[var(--color-border-subtle)] pt-3">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
