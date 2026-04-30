'use client'

import dynamic from 'next/dynamic'

const WaterCanvas = dynamic(() => import('./WaterCanvas'), {
  ssr: false,
  loading: () => (
    <div
      className="fixed inset-0 z-0"
      style={{
        backgroundColor: '#0A1628'
      }}
    />
  ),
})

export default function Scene() {
  return <WaterCanvas />
}