'use client'

import { memo } from 'react'

function UnderwaterLightsInner() {
  return (
    <group>
      <pointLight
        position={[0, 0.5, 0]}
        intensity={1.5}
        color="#00EEFF"
        distance={30}
        decay={2}
      />
      <pointLight position={[-8, 0.5, 0]} intensity={0.4} color="#00CCFF" distance={20} decay={2} />
      <pointLight position={[8, 0.5, 0]} intensity={0.4} color="#00CCFF" distance={20} decay={2} />
    </group>
  )
}

export default memo(UnderwaterLightsInner)
