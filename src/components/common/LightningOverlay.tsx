import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const BOLTS = [
  // top-left cluster
  { d: 'M12 0 L4 34 L10 34 L2 62 L18 26 L11 26 L20 0 Z', x: '12%', y: '4%', w: 34 },
  { d: 'M12 0 L4 34 L10 34 L2 62 L18 26 L11 26 L20 0 Z', x: '22%', y: '0%', w: 22 },
  // right side
  { d: 'M12 0 L4 34 L10 34 L2 62 L18 26 L11 26 L20 0 Z', x: '86%', y: '12%', w: 40 },
  { d: 'M12 0 L4 34 L10 34 L2 62 L18 26 L11 26 L20 0 Z', x: '78%', y: '58%', w: 26 },
  // bottom-left
  { d: 'M12 0 L4 34 L10 34 L2 62 L18 26 L11 26 L20 0 Z', x: '8%', y: '70%', w: 30 },
]

const FLASH_KEYFRAMES: number[] = [0, 0.12, 0.2, 0.35, 1]
const FLASH_OPACITY: number[] = [0, 0.9, 0.15, 0.7, 0]

/**
 * Ambient lightning system: rare, random electric flashes at fixed sky positions.
 * Renders nothing when the user prefers reduced motion.
 */
export function LightningOverlay({ enabled = true }: { enabled?: boolean }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [boltIndex, setBoltIndex] = useState(0)

  useEffect(() => {
    if (!enabled) return

    let timeoutId: number

    const scheduleFlash = () => {
      const delay = 6000 + Math.random() * 9000
      timeoutId = window.setTimeout(() => {
        setBoltIndex(Math.floor(Math.random() * BOLTS.length))
        setActiveIndex((current) => (current === null ? 0 : current + 1))
        scheduleFlash()
      }, delay)
    }

    scheduleFlash()
    return () => window.clearTimeout(timeoutId)
  }, [enabled])

  if (!enabled) return null
  const bolt = BOLTS[boltIndex]

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden>
      <AnimatePresence>
        {activeIndex !== null ? (
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: FLASH_OPACITY }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, times: FLASH_KEYFRAMES }}
            style={{ position: 'absolute', left: bolt.x, top: bolt.y }}
          >
            <svg width={bolt.w} height={bolt.w * 3.2} viewBox="0 0 22 64" fill="none">
              <path d={bolt.d} fill="url(#lightningGrad)" filter="drop-shadow(0 0 10px rgba(103, 232, 249, 0.9))" />
              <defs>
                <linearGradient id="lightningGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#e0faff" />
                  <stop offset="0.5" stopColor="#67e8f9" />
                  <stop offset="1" stopColor="#818cf8" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
