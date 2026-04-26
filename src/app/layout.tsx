import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Oro Azul | Clases de Natación',
  description:
    'Aprendé a nadar toda tu vida. Clases de natación para todas las edades, rehabilitación acuática y actividades recreativas en un ambiente seguro y profesional.',
  keywords: ['natación', 'clases de natación', 'pileta', 'natatorio', 'rehabilitación acuática', 'AquaGym'],
  openGraph: {
    title: 'Oro Azul | Clases de Natación',
    description:
      'Aprendé a nadar toda tu vida. Clases de natación para todas las edades.',
    type: 'website',
    locale: 'es_AR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oro Azul | Clases de Natación',
    description: 'Aprendé a nadar toda tu vida.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={plusJakartaSans.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="font-sans antialiased">
        {/* Skip to main content - accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--color-turquoise)] focus:text-white focus:font-semibold focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          Saltar al contenido principal
        </a>
        {children}
      </body>
    </html>
  )
}
