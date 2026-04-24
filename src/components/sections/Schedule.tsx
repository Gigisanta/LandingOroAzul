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

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let newIndex = index
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      newIndex = (index + 1) % activities.length
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      newIndex = (index - 1 + activities.length) % activities.length
    } else {
      return
    }
    setSelectedActivity(activities[newIndex])
    document.getElementById(`tab-${activities[newIndex].id}`)?.focus()
  }

  return (
    <section id="horarios" className="py-24 px-4 bg-gradient-to-b from-[var(--color-dark)]/98 to-[var(--color-dark)]/98 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Nuestros Horarios
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Encontrá la clase perfecta para vos. Actividades para todas las edades y niveles.
          </p>
        </div>

        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Actividades"
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {activities.map((activity, index) => (
            <button
              key={activity.id}
              role="tab"
              id={`tab-${activity.id}`}
              aria-selected={selectedActivity.id === activity.id}
              aria-controls={`panel-${activity.id}`}
              tabIndex={selectedActivity.id === activity.id ? 0 : -1}
              onClick={() => setSelectedActivity(activity)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`
                px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200
                flex items-center gap-2 min-h-[44px] min-w-[44px]
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2
                ${
                  selectedActivity.id === activity.id
                    ? 'bg-[var(--color-turquoise)] text-white shadow-lg'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'
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
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{selectedActivity.icon}</span>
                  <div>
                    <h3 className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                      {selectedActivity.name}
                    </h3>
                    <p className="text-white/60">{selectedActivity.ages}</p>
                  </div>
                </div>

                <ul className="space-y-3">
                  {selectedActivity.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[var(--color-turquoise)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-[var(--color-turquoise)]" />
                      </div>
                      <span className="text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Schedule Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
                <h3 className="text-xl font-bold mb-2 text-white">
                  Horarios de {selectedActivity.name}
                </h3>
                <p className="text-white/50 text-sm mb-4">Días y horarios disponibles</p>

                <div className="space-y-2">
                  {selectedActivity.schedule.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-3 px-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <span className="font-medium text-white">
                        {item.day}
                      </span>
                      <span className="text-white/70 font-mono">{item.time}</span>
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
