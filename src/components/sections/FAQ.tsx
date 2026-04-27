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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
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
      className="py-24 px-4 relative z-10"
      style={{ background: 'var(--color-dark-overlay)', backdropFilter: 'blur(12px)' }}
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Preguntas Frecuentes
          </h2>
          <p className="text-lg text-white/70">
            Todo lo que necesitás saber sobre nuestras clases de natación.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="bg-[var(--color-dark)]/80 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden">
                <button
                  onClick={() => toggle(faq.id)}
                  aria-expanded={openId === faq.id}
                  aria-controls={`faq-answer-${faq.id}`}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left min-h-[44px]"
                >
                  <span className="font-semibold text-white pr-4">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openId === faq.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center"
                  >
                    <ChevronDown className="w-4 h-4 text-white" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openId === faq.id && (
                    <motion.div
                      id={`faq-answer-${faq.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-white/80 leading-relaxed border-t border-white/10 pt-4">
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
