import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CinematicCursor() {
  const outerX = useMotionValue(-120)
  const outerY = useMotionValue(-120)
  const innerX = useMotionValue(-120)
  const innerY = useMotionValue(-120)
  const springOuterX = useSpring(outerX, { stiffness: 180, damping: 18, mass: 0.4 })
  const springOuterY = useSpring(outerY, { stiffness: 180, damping: 18, mass: 0.4 })
  const springInnerX = useSpring(innerX, { stiffness: 520, damping: 34, mass: 0.2 })
  const springInnerY = useSpring(innerY, { stiffness: 520, damping: 34, mass: 0.2 })
  const [enabled, setEnabled] = useState(false)
  const [interactive, setInteractive] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine)')
    const syncState = () => setEnabled(media.matches)
    syncState()
    media.addEventListener('change', syncState)

    return () => media.removeEventListener('change', syncState)
  }, [])

  useEffect(() => {
    if (!enabled) {
      return
    }

    const handleMove = (event: MouseEvent) => {
      outerX.set(event.clientX - 18)
      outerY.set(event.clientY - 18)
      innerX.set(event.clientX - 4)
      innerY.set(event.clientY - 4)
    }

    const handleOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      setInteractive(Boolean(target?.closest('a, button, [data-cursor="interactive"]')))
    }

    const resetCursor = () => {
      setInteractive(false)
      outerX.set(-120)
      outerY.set(-120)
      innerX.set(-120)
      innerY.set(-120)
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseover', handleOver)
    window.addEventListener('blur', resetCursor)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseover', handleOver)
      window.removeEventListener('blur', resetCursor)
    }
  }, [enabled, innerX, innerY, outerX, outerY])

  if (!enabled) {
    return null
  }

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[90] hidden rounded-full border border-white/20 bg-white/[0.03] mix-blend-screen md:block"
        style={{
          x: springOuterX,
          y: springOuterY,
          width: interactive ? 52 : 36,
          height: interactive ? 52 : 36,
          boxShadow: interactive ? '0 0 40px rgba(255, 42, 42, 0.24)' : '0 0 24px rgba(255,255,255,0.06)',
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[91] hidden rounded-full bg-[#ff2a2a] md:block"
        style={{
          x: springInnerX,
          y: springInnerY,
          width: interactive ? 10 : 8,
          height: interactive ? 10 : 8,
          boxShadow: '0 0 18px rgba(255, 42, 42, 0.72)',
        }}
      />
    </>
  )
}
