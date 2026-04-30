import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'text-shadow-title',
    'text-shadow-subtitle',
    'text-shadow-stat',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0077B6',
          dark: '#005A8C',
          light: '#0096C7',
        },
        turquoise: {
          DEFAULT: '#00B4D8',
          dark: '#0096B8',
          light: '#48CAE4',
        },
        dark: '#0A1628',
        darkLight: '#112240',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
