'use client'

import dynamic from 'next/dynamic'

const WaterCanvas = dynamic(() => import('./WaterCanvas'), {
  ssr: false,
  loading: () => null,
})

export default function Scene() {
  return <WaterCanvas />
}