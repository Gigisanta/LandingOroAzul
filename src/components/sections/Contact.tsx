'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

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

export default function Contact({ business }: ContactProps) {
  const reducedMotion = useReducedMotion()

  return (
    <section id="contacto" className="py-24 px-4 bg-[#0A1628]/95 backdrop-blur-md">
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
            Encontranos
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg text-white/70 max-w-2xl mx-auto"
          >
            Vení a conocernos. Te esperamos para que disfrutes del agua.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <motion.div
            variants={reducedMotion ? {} : staggerContainer}
            initial={reducedMotion ? undefined : 'hidden'}
            whileInView={reducedMotion ? undefined : 'visible'}
            viewport={{ once: true, margin: '-50px' }}
          >
            <div className="space-y-6">
              {business.address && (
                <motion.div variants={fadeInUp} className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(0, 168, 232, 0.1)' }}
                  >
                    <MapPin className="w-6 h-6" style={{ color: '#00A8E8' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-white">
                      Dirección
                    </h3>
                    <p className="text-white/70">{business.address}</p>
                  </div>
                </motion.div>
              )}

              {business.phone && (
                <motion.div variants={fadeInUp} className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(0, 168, 232, 0.1)' }}
                  >
                    <Phone className="w-6 h-6" style={{ color: '#00A8E8' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-white">
                      Teléfono
                    </h3>
                    <a
                      href={`tel:${business.phone.replace(/\s/g, '')}`}
                      className="text-white/70 hover:text-[#00A8E8] transition-colors"
                    >
                      {business.phone}
                    </a>
                  </div>
                </motion.div>
              )}

              {business.email && (
                <motion.div variants={fadeInUp} className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(0, 168, 232, 0.1)' }}
                  >
                    <Mail className="w-6 h-6" style={{ color: '#00A8E8' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-white">
                      Email
                    </h3>
                    <a
                      href={`mailto:${business.email}`}
                      className="text-white/70 hover:text-[#00A8E8] transition-colors"
                    >
                      {business.email}
                    </a>
                  </div>
                </motion.div>
              )}

              <motion.div variants={fadeInUp} className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(0, 168, 232, 0.1)' }}
                >
                  <Clock className="w-6 h-6" style={{ color: '#00A8E8' }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-white">
                    Horarios
                  </h3>
                  <p className="text-white/70">Lunes a Viernes: 8:00 - 20:00</p>
                  <p className="text-white/70">Sábados: 8:00 - 18:00</p>
                  <p className="text-white/70">Domingos: 9:00 - 13:00</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            variants={fadeInUp}
            className="rounded-2xl overflow-hidden h-80 md:h-full min-h-[320px] border border-white/20"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.4!3d-34.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM2JzAwLjAiUyA1OMKwMjQnMDAuMCJX!5e0!3m2!1ses!2sar!4v1600000000000!5m2!1ses!2sar"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Oro Azul"
            />
          </motion.div>
        </div>

        {/* WhatsApp CTA */}
        <motion.div
          variants={fadeInUp}
          initial={reducedMotion ? undefined : 'hidden'}
          whileInView={reducedMotion ? undefined : 'visible'}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <a
            href="https://wa.me/5491100000000?text=Hola!%20Quiero%20info%20sobre%20las%20clases%20de%20natación"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg shadow-[#25D366]/30"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Escribinos por WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  )
}
