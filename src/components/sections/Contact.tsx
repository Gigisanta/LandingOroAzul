'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle, User, MessageSquare } from 'lucide-react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useState } from 'react'

interface FormData {
  name: string
  email: string
  phone: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

interface Business {
  name: string
  phone: string
  whatsapp: string
  email: string
  address: string
  instagram: string
  facebook: string
}

interface ContactProps {
  business: Business
}

// Animation variants removed - using inline props for reducedMotion compatibility

export default function Contact({ business }: ContactProps) {
  const reducedMotion = useReducedMotion()

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresá un email válido'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es requerido'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'El mensaje debe tener al menos 10 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setSubmitStatus('idle')

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSubmitStatus('success')
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contacto" aria-labelledby="contacto-heading" className="relative z-10 py-16 px-4 bg-[var(--color-dark)]/98 overflow-hidden">
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
            id="contacto-heading"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-bold mb-4 text-white"
          >
            Encontranos
          </motion.h2>
          <motion.p
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg text-white/70 max-w-2xl mx-auto"
          >
            Vení a conocernos. Te esperamos para que disfrutes del agua.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="space-y-6">
              {business.address && (
                <motion.div
                  initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  whileHover={reducedMotion ? {} : { x: 10 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-4 group"
                >
                  <motion.div
                    whileHover={reducedMotion ? {} : { scale: 1.15, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-shadow"
                    style={{ backgroundColor: 'var(--color-turquoise-10)' }}
                  >
                    <MapPin className="w-6 h-6" style={{ color: 'var(--color-turquoise)' }} />
                  </motion.div>
                  <div>
                    <h3 className="text-sm font-semibold mb-1 text-white">Dirección</h3>
                    <p className="text-white/90 group-hover:text-white transition-colors">{business.address}</p>
                  </div>
                </motion.div>
              )}

              {business.phone && (
                <motion.div
                  initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  whileHover={reducedMotion ? {} : { x: 10 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-4 group"
                >
                  <motion.div
                    whileHover={reducedMotion ? {} : { scale: 1.15, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'var(--color-turquoise-10)' }}
                  >
                    <Phone className="w-6 h-6" style={{ color: 'var(--color-turquoise)' }} />
                  </motion.div>
                  <div>
                    <h3 className="text-sm font-semibold mb-1 text-white">Teléfono</h3>
                    <a
                      href={`tel:${business.phone.replace(/\s/g, '')}`}
                      className="text-white/90 hover:text-[var(--color-turquoise)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-turquoise)] rounded px-1"
                    >
                      {business.phone}
                    </a>
                  </div>
                </motion.div>
              )}

              {business.email && (
                <motion.div
                  initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  whileHover={reducedMotion ? {} : { x: 10 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-4 group"
                >
                  <motion.div
                    whileHover={reducedMotion ? {} : { scale: 1.15, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'var(--color-turquoise-10)' }}
                  >
                    <Mail className="w-6 h-6" style={{ color: 'var(--color-turquoise)' }} />
                  </motion.div>
                  <div>
                    <h3 className="text-sm font-semibold mb-1 text-white">Email</h3>
                    <a
                      href={`mailto:${business.email}`}
                      className="text-white/90 hover:text-[var(--color-turquoise)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-turquoise)] rounded px-1"
                    >
                      {business.email}
                    </a>
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={reducedMotion ? {} : { x: 10 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-start gap-4 group"
              >
                <motion.div
                  whileHover={reducedMotion ? {} : { scale: 1.15, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'var(--color-turquoise-10)' }}
                >
                  <Clock className="w-6 h-6" style={{ color: 'var(--color-turquoise)' }} />
                </motion.div>
                <div>
                  <h3 className="text-sm font-semibold mb-1 text-white">Horarios</h3>
                  <p className="text-white/90">Lunes a Viernes: 8:00 - 20:00</p>
                  <p className="text-white/90">Sábados: 8:00 - 18:00</p>
                  <p className="text-white/90">Domingos: 9:00 - 13:00</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            whileHover={reducedMotion ? {} : { scale: 1.02 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl overflow-hidden h-80 md:h-full min-h-[320px] border border-white/20"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3285.5!2d-58.4!3d-34.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcca3b4ef90cbb%3A0x1f2e1b4f0e8c8e2!2sBuenos%20Aires%2C%20Argentina!5e0!3m2!1ses!2ses!4v1700000000000!5m2!1ses!2ses"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Oro Azul"
              suppressHydrationWarning
            />
          </motion.div>
        </div>

        {/* WhatsApp CTA */}
        <motion.div
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-center"
        >
          <motion.a
            href={`https://wa.me/${business.whatsapp}?text=Hola!%20Quiero%20info%20sobre%20las%20clases%20de%20natación`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={reducedMotion ? {} : { scale: 1.05, y: -3 }}
            whileTap={reducedMotion ? {} : { scale: 0.98 }}
            className="inline-flex items-center gap-3 px-8 py-4 min-h-[44px] bg-[var(--color-whatsapp)] hover:bg-[var(--color-whatsapp)]/90 text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg shadow-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Escribinos por WhatsApp
          </motion.a>
        </motion.div>

        <motion.div
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 max-w-xl mx-auto"
        >
          <h3 className="text-2xl font-bold mb-6 text-white text-center">
            Envianos un mensaje
          </h3>

          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-500/15 border border-green-500/30 rounded-xl flex items-center gap-3 text-green-400"
            >
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <p>¡Mensaje enviado! Te responderemos pronto.</p>
            </motion.div>
          )}

          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/15 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>Algo salió mal. Intentá de nuevo más tarde.</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1.5">
                Nombre <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Tu nombre completo"
                  className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-turquoise)] transition-colors ${
                    errors.name ? 'border-red-500' : 'border-white/10'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1.5">
                Email <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-turquoise)] transition-colors ${
                    errors.email ? 'border-red-500' : 'border-white/10'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-white/80 mb-1.5">
                Teléfono <span className="text-white/40">(opcional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+54 11 1234-5678"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-turquoise)] transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-1.5">
                Mensaje <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-white/40 pointer-events-none" />
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="¿En qué podemos ayudarte?"
                  rows={4}
                  className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-turquoise)] transition-colors resize-none ${
                    errors.message ? 'border-red-500' : 'border-white/10'
                  }`}
                />
              </div>
              {errors.message && (
                <p className="mt-1 text-sm text-red-400">{errors.message}</p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={reducedMotion ? {} : { scale: 1.02 }}
              whileTap={reducedMotion ? {} : { scale: 0.98 }}
              className="w-full py-3 px-6 min-h-[44px] bg-[var(--color-turquoise)] hover:bg-[var(--color-turquoise)]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Enviando...
                </span>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Enviar mensaje
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
