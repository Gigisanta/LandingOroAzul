'use client'

import { memo } from 'react'

function UnderwaterLightsInner() {
  return (
    <group>
      {/* Central caustic light - main underwater glow */}
      <pointLight
        position={[0, 0.3, 0]}
        intensity={2.0}
        color="#40E0D0"
        distance={40}
        decay={2}
      />

      {/* Side caustic lights for depth */}
      <pointLight
        position={[-12, 0.4, -8]}
        intensity={0.8}
        color="#48D1CC"
        distance={30}
        decay={2}
      />
      <pointLight
        position={[12, 0.4, -8]}
        intensity={0.8}
        color="#48D1CC"
        distance={30}
        decay={2}
      />

      {/* Deep water ambient */}
      <pointLight
        position={[0, -2, 0]}
        intensity={0.6}
        color="#1A9EAA"
        distance={50}
        decay={1.5}
      />

      {/* Moving caustic accents */}
      <pointLight
        position={[-6, 0.2, 6]}
        intensity={0.5}
        color="#5DD9E8"
        distance={25}
        decay={2}
      />
      <pointLight
        position={[6, 0.2, 6]}
        intensity={0.5}
        color="#5DD9E8"
        distance={25}
        decay={2}
      />
    </group>
  )
}

export default memo(UnderwaterLightsInner)
