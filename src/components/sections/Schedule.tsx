'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface ScheduleItem {
  day: string
  time: string
}

interface Activity {
  id: string
  name: string
  ages: string
  icon: string
  features: string[]
  schedule: ScheduleItem[]
}

interface ScheduleProps {
  activities: Activity[]
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
}

export default function Schedule({ activities }: ScheduleProps) {
  const [selectedActivity, setSelectedActivity] = useState<Activity>(activities[0])
  const reducedMotion = useReducedMotion()

  return (
    <section id="horarios" className="py-24 px-4 bg-gradient-to-b from-white to-[#F0F8FF]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#005691' }}>
            Nuestros Horarios
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Encontrá la clase perfecta para vos. Actividades para todas las edades y niveles.
          </p>
        </div>

        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Actividades"
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {activities.map((activity) => (
            <button
              key={activity.id}
              role="tab"
              id={`tab-${activity.id}`}
              aria-selected={selectedActivity.id === activity.id}
              aria-controls={`panel-${activity.id}`}
              tabIndex={selectedActivity.id === activity.id ? 0 : -1}
              onClick={() => setSelectedActivity(activity)}
              className={`
                px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200
                flex items-center gap-2 min-h-[44px] min-w-[44px]
                ${
                  selectedActivity.id === activity.id
                    ? 'bg-[#005691] text-white shadow-lg'
                    : 'bg-white text-[#005691] hover:bg-[#005691]/10 border border-[#005691]/20'
                }
              `}
            >
              <span className="text-lg">{activity.icon}</span>
              <span>{activity.name}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedActivity.id}
            variants={reducedMotion ? {} : fadeIn}
            initial={reducedMotion ? undefined : 'hidden'}
            animate={reducedMotion ? undefined : 'visible'}
            exit={reducedMotion ? undefined : 'exit'}
            role="tabpanel"
            id={`panel-${selectedActivity.id}`}
            aria-labelledby={`tab-${selectedActivity.id}`}
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* Activity Info Card */}
              <div className="bg-white rounded-2xl p-6 border border-[#005691]/20 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{selectedActivity.icon}</span>
                  <div>
                    <h3 className="text-2xl font-bold" style={{ color: '#005691' }}>
                      {selectedActivity.name}
                    </h3>
                    <p className="text-gray-500">{selectedActivity.ages}</p>
                  </div>
                </div>

                <ul className="space-y-3">
                  {selectedActivity.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#00A8E8]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-[#00A8E8]" />
                      </div>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Schedule Card */}
              <div className="bg-white rounded-2xl p-6 border border-[#005691]/20 shadow-sm">
                <h3 className="text-xl font-bold mb-2" style={{ color: '#005691' }}>
                  Horarios de {selectedActivity.name}
                </h3>
                <p className="text-gray-500 text-sm mb-4">Días y horarios disponibles</p>

                <div className="space-y-2">
                  {selectedActivity.schedule.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-3 px-4 rounded-lg bg-[#F0F8FF]/50 hover:bg-[#F0F8FF] transition-colors"
                    >
                      <span className="font-medium" style={{ color: '#005691' }}>
                        {item.day}
                      </span>
                      <span className="text-gray-600 font-mono">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
