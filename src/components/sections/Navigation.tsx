'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const navLinks = [
  { href: '#horarios', label: 'Horarios' },
  { href: '#precios', label: 'Precios' },
  { href: '#galeria', label: 'Galería' },
  { href: '#testimonios', label: 'Testimonios' },
  { href: '#contacto', label: 'Contacto' },
]

interface NavigationProps {
  whatsapp: string
}

const fadeInDown = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
}

export default function Navigation({ whatsapp }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const lastScrollYRef = useRef(0)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const toggleButtonRef = useRef<HTMLButtonElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      const isScrollingDown = currentY > lastScrollYRef.current

      setIsScrolled(currentY > 50)
      setIsHidden(isScrollingDown && currentY > 120)
      lastScrollYRef.current = currentY

      // Close mobile menu on scroll
      if (isMobileMenuOpen && currentY > 50) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobileMenuOpen])

  // Close mobile menu on route change/hash change
  useEffect(() => {
    const handleHashChange = () => setIsMobileMenuOpen(false)
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Focus trap + Escape key for mobile menu
  useEffect(() => {
    if (!isMobileMenuOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
        toggleButtonRef.current?.focus()
        return
      }

      // Focus trap
      if (e.key === 'Tab') {
        const menu = mobileMenuRef.current
        if (!menu) return

        const focusableElements = menu.querySelectorAll<HTMLElement>(
          'a[href], button, [tabindex]:not([tabindex="-1"])'
        )
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMobileMenuOpen])

  return (
    <>
      <motion.nav
        variants={fadeInDown}
        initial="visible"
        animate={isHidden ? { y: -100, opacity: 0 } : { y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'py-1' : 'py-3'
        }`}
        style={{
          backgroundColor: isScrolled ? 'rgba(50, 40, 35, 0.85)' : 'rgba(50, 40, 35, 0.25)',
          backdropFilter: isScrolled ? 'blur(20px)' : 'blur(16px)',
          WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#"
            className="flex items-center gap-2"
            whileHover={reducedMotion ? {} : { scale: 1.05 }}
            whileTap={reducedMotion ? {} : { scale: 0.95 }}
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-turquoise)] flex items-center justify-center overflow-hidden relative">
              {/* Animated water drop icon */}
              <motion.svg
                className="w-6 h-6 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
                animate={reducedMotion ? {} : {
                  scale: [1, 1.15, 1],
                  y: [0, -2, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <path d="M12 2C12 2 5.5 10 5.5 15.5C5.5 19.09 8.41 22 12 22C15.59 22 18.5 19.09 18.5 15.5C18.5 10 12 2 12 2ZM12 20C9.52 20 7.5 17.98 7.5 15.5C7.5 13.34 10.17 9.44 12 6.72C13.83 9.44 16.5 13.34 16.5 15.5C16.5 17.98 14.48 20 12 20Z" />
                <motion.circle
                  cx="12"
                  cy="15"
                  r="3"
                  fill="white"
                  opacity={0.6}
                  animate={reducedMotion ? {} : {
                    scale: [0.8, 1.2, 0.8],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.svg>
              {/* Subtle glow ring */}
              <motion.div
                className="absolute inset-0 rounded-xl border-2 border-white/30"
                animate={reducedMotion ? {} : {
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0, 0.3],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
            <span className="text-xl font-bold text-white">Oro Azul</span>
          </motion.a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="text-white hover:text-white/80 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-lg px-2 py-1 relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-[var(--color-turquoise)] after:transition-all hover:after:w-full"
                whileHover={reducedMotion ? {} : { scale: 1.05 }}
                whileTap={reducedMotion ? {} : { scale: 0.95 }}
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={reducedMotion ? {} : { scale: 1.05 }}
              whileTap={reducedMotion ? {} : { scale: 0.95 }}
              className="px-4 py-2 bg-[var(--color-whatsapp)] hover:bg-[var(--color-whatsapp-dark)] text-white text-base font-semibold rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              WhatsApp
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            ref={toggleButtonRef}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-11 h-11 flex items-center justify-center text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-lg"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            whileTap={reducedMotion ? {} : { scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <motion.button
              className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-default"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Cerrar menú"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              ref={mobileMenuRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-0 bottom-0 w-[85vw] max-w-[320px] p-6 pt-20 backdrop-blur-xl"
              style={{ backgroundColor: 'var(--color-dark)' }}
              role="dialog"
              aria-modal="true"
              aria-label="Menú de navegación"
              tabIndex={-1}
              id="mobile-menu"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-white/80 hover:text-white text-lg font-medium py-3 transition-colors focus-visible:outline-none focus-visible:bg-white/10 rounded-lg px-2"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={reducedMotion ? {} : { x: 10 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
                <motion.a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  className="mt-4 px-4 py-3 bg-[var(--color-whatsapp)] hover:bg-[var(--color-whatsapp-dark)] text-white font-semibold rounded-lg text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                >
                  WhatsApp
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
