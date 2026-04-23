import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
