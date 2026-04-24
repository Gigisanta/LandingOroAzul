'use client'

import { memo } from 'react'

function UnderwaterLightsInner() {
  return (
    <group>
      {/* Soft ambient glow from water surface */}
      <pointLight
        position={[0, 0.5, 0]}
        intensity={1.2}
        color="#00EEFF"
        distance={35}
        decay={2}
      />

      {/* Subtle fill lights */}
      <pointLight position={[-8, 0.5, 0]} intensity={0.3} color="#00CCFF" distance={20} decay={2} />
      <pointLight position={[8, 0.5, 0]} intensity={0.3} color="#00CCFF" distance={20} decay={2} />
    </group>
  )
}

export default memo(UnderwaterLightsInner)
