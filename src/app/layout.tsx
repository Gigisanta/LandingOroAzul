import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://oroazul.com'),
  title: 'Oro Azul | Clases de Natación',
  description:
    'Aprendé a nadar toda tu vida. Clases de natación para todas las edades, rehabilitación acuática y actividades recreativas en un ambiente seguro y profesional.',
  keywords: ['natación', 'clases de natación', 'pileta', 'natatorio', 'rehabilitación acuática', 'AquaGym'],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'Oro Azul | Clases de Natación',
    description:
      'Aprendé a nadar toda tu vida. Clases de natación para todas las edades.',
    type: 'website',
    locale: 'es_AR',
    images: ['/og-image.png'],
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0A1628',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <link rel="canonical" href="https://oroazul.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
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
