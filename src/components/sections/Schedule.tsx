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

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
}

const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
}

const fadeInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const cardHoverVariants = {
  rest: { scale: 1, transition: { duration: 0.3 } },
  hover: {
    scale: 1.02,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
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
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setSelectedActivity(activities[index])
      return
    } else {
      return
    }
    setSelectedActivity(activities[newIndex])
    document.getElementById(`tab-${activities[newIndex].id}`)?.focus()
  }

  return (
    <section id="horarios" className="py-24 px-4 bg-gradient-to-b from-[var(--color-dark)]/95 to-[var(--color-dark)]/95 backdrop-blur-sm overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          variants={reducedMotion ? {} : staggerContainer}
          initial={reducedMotion ? undefined : 'hidden'}
          whileInView={reducedMotion ? undefined : 'visible'}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-12"
        >
          <motion.h2
            variants={reducedMotion ? {} : fadeInUp}
            className="text-4xl md:text-5xl font-bold mb-4 text-white"
          >
            Nuestros Horarios
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg text-white/70 max-w-2xl mx-auto"
          >
            Encontrá la clase perfecta para vos. Actividades para todas las edades y niveles.
          </motion.p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          role="tablist"
          aria-label="Actividades"
          variants={reducedMotion ? {} : staggerContainer}
          initial={reducedMotion ? undefined : 'hidden'}
          whileInView={reducedMotion ? undefined : 'visible'}
          viewport={{ once: true, margin: '-50px' }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {activities.map((activity, index) => (
            <motion.button
              key={activity.id}
              role="tab"
              id={`tab-${activity.id}`}
              aria-selected={selectedActivity.id === activity.id}
              aria-controls={`panel-${activity.id}`}
              tabIndex={selectedActivity.id === activity.id ? 0 : -1}
              onClick={() => setSelectedActivity(activity)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              variants={reducedMotion ? {} : fadeInUp}
              whileHover={reducedMotion ? {} : { scale: 1.05 }}
              whileTap={reducedMotion ? {} : { scale: 0.95 }}
              className={`
                px-5 py-3 rounded-xl font-medium text-base transition-all duration-200
                flex items-center gap-2 min-h-[44px] min-w-[44px]
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2
                ${
                  selectedActivity.id === activity.id
                    ? 'bg-[var(--color-turquoise)] text-[var(--color-dark)] shadow-lg shadow-[var(--color-turquoise)]/20'
                    : 'bg-white/10 text-white/80 border border-white/20 hover:bg-white/20 hover:border-white/40 hover:text-white'
                }
              `}
            >
              <span className="text-lg">{activity.icon}</span>
              <span>{activity.name}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedActivity.id}
            role="tabpanel"
            id={`panel-${selectedActivity.id}`}
            aria-labelledby={`tab-${selectedActivity.id}`}
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* Activity Info Card */}
              <motion.div
                variants={reducedMotion ? {} : fadeInLeft}
                initial={reducedMotion ? undefined : 'hidden'}
                animate={reducedMotion ? undefined : 'visible'}
                whileHover={reducedMotion ? {} : cardHoverVariants.hover}
                className="bg-[var(--color-dark)]/85 backdrop-blur-xl rounded-2xl p-6 border border-white/40 shadow-2xl shadow-black/40"
              >
                <div className="flex items-center gap-3 mb-4">
                  <motion.span
                    className="text-4xl"
                    whileHover={reducedMotion ? {} : { scale: 1.2, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {selectedActivity.icon}
                  </motion.span>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {selectedActivity.name}
                    </h3>
                    <p className="text-white/90">{selectedActivity.ages}</p>
                  </div>
                </div>

                <ul className="space-y-3">
                  {selectedActivity.features.map((feature, index) => (
                    <motion.li
                      key={index}
                      variants={reducedMotion ? {} : fadeInUp}
                      className="flex items-start gap-3"
                      initial={reducedMotion ? undefined : 'hidden'}
                      animate={reducedMotion ? undefined : 'visible'}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="w-5 h-5 rounded-full bg-[var(--color-turquoise)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-[var(--color-turquoise)]" />
                      </div>
                      <span className="text-white">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Schedule Card */}
              <motion.div
                variants={reducedMotion ? {} : fadeInRight}
                initial={reducedMotion ? undefined : 'hidden'}
                animate={reducedMotion ? undefined : 'visible'}
                whileHover={reducedMotion ? {} : cardHoverVariants.hover}
                className="bg-[var(--color-dark)]/85 backdrop-blur-xl rounded-2xl p-6 border border-white/40 shadow-2xl shadow-black/40"
              >
                <h3 className="text-xl font-bold mb-2 text-white">
                  Horarios de {selectedActivity.name}
                </h3>
                <p className="text-white/90 text-base mb-4">Días y horarios disponibles</p>

                <div className="space-y-2">
                  {selectedActivity.schedule.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={reducedMotion ? undefined : { opacity: 0, x: 20 }}
                      animate={reducedMotion ? undefined : { opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                      className="flex justify-between items-center py-3 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors group"
                    >
                      <span className="font-medium text-white group-hover:text-[var(--color-turquoise)] transition-colors">
                        {item.day}
                      </span>
                      <span className="text-white/90 font-mono group-hover:text-white transition-colors">
                        {item.time}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
