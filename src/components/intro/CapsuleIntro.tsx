import { type CSSProperties, type MouseEvent, useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, type PanInfo, useMotionValue, useSpring } from 'framer-motion'

interface CapsuleIntroProps {
  brandName?: string
  tagline?: string
  destinationLabel?: string
  accentHex?: string
  redirectUrl?: string
  onEnter: () => void
}

const INTRO_EXIT_MS = 1150
const DRAG_THRESHOLD_PX = 10

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function CapsuleIntro({
  brandName = 'Your Website Name',
  tagline = '',
  destinationLabel = '',
  accentHex = '#3b82f6',
  redirectUrl,
  onEnter,
}: CapsuleIntroProps) {
  const [isActivating, setIsActivating] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const hasCompletedRef = useRef(false)
  const inertiaResetRef = useRef<number | null>(null)
  const dragDistanceRef = useRef(0)

  const dragTiltX = useMotionValue(0)
  const dragTiltY = useMotionValue(0)
  const smoothTiltX = useSpring(dragTiltX, { stiffness: 190, damping: 24, mass: 0.55 })
  const smoothTiltY = useSpring(dragTiltY, { stiffness: 190, damping: 24, mass: 0.55 })

  useEffect(() => {
    return () => {
      if (inertiaResetRef.current) {
        window.clearTimeout(inertiaResetRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isActivating) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      if (hasCompletedRef.current) {
        return
      }

      hasCompletedRef.current = true

      if (redirectUrl) {
        window.location.assign(redirectUrl)
        return
      }

      onEnter()
    }, INTRO_EXIT_MS)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [isActivating, onEnter, redirectUrl])

  const handleActivate = (event: MouseEvent<HTMLButtonElement>) => {
    if (isActivating || hasCompletedRef.current) {
      return
    }

    if (dragDistanceRef.current > DRAG_THRESHOLD_PX) {
      event.preventDefault()
      dragDistanceRef.current = 0
      return
    }

    setIsActivating(true)
  }

  const handlePanStart = () => {
    if (isActivating) {
      return
    }

    setIsDragging(true)
    dragDistanceRef.current = 0

    if (inertiaResetRef.current) {
      window.clearTimeout(inertiaResetRef.current)
      inertiaResetRef.current = null
    }
  }

  const handlePan = (_event: PointerEvent, info: PanInfo) => {
    if (isActivating) {
      return
    }

    dragDistanceRef.current = Math.max(dragDistanceRef.current, Math.hypot(info.offset.x, info.offset.y))

    dragTiltX.set(clamp(-info.offset.y * 0.13, -24, 24))
    dragTiltY.set(clamp(info.offset.x * 0.15, -30, 30))
  }

  const handlePanEnd = (_event: PointerEvent, info: PanInfo) => {
    if (isActivating) {
      return
    }

    const momentumX = clamp(-info.velocity.y * 0.015, -16, 16)
    const momentumY = clamp(info.velocity.x * 0.017, -20, 20)

    animate(dragTiltX, momentumX, { type: 'spring', stiffness: 180, damping: 20, mass: 0.6 })
    animate(dragTiltY, momentumY, { type: 'spring', stiffness: 180, damping: 20, mass: 0.6 })

    inertiaResetRef.current = window.setTimeout(() => {
      animate(dragTiltX, 0, { type: 'spring', stiffness: 165, damping: 22, mass: 0.68 })
      animate(dragTiltY, 0, { type: 'spring', stiffness: 165, damping: 22, mass: 0.68 })
      setIsDragging(false)
      dragDistanceRef.current = 0
    }, 220)
  }

  const introStyle = {
    ['--intro-accent' as const]: accentHex,
  } as CSSProperties

  return (
    <motion.section
      className={`capsule-intro ${isActivating ? 'is-activating' : ''}`}
      style={introStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.45, ease: 'easeInOut' } }}
      aria-label="Website intro animation"
    >
      <div className="capsule-intro-bg" aria-hidden />

      <motion.button
        type="button"
        className="capsule-hit-area focusable"
        aria-label={`Enter ${brandName}`}
        onClick={handleActivate}
        whileHover={isActivating ? undefined : { scale: 1.02 }}
        whileTap={isActivating ? undefined : { scale: 0.985 }}
      >
        <span className="capsule-ripple" aria-hidden />

        <span className="capsule-scene" aria-hidden>
          <span className="capsule-ground-shadow" />

          <motion.span
            className={`capsule-track ${isDragging ? 'is-dragging' : ''}`}
            style={{ rotateX: smoothTiltX, rotateY: smoothTiltY, touchAction: 'none' }}
            onPanStart={handlePanStart}
            onPan={handlePan}
            onPanEnd={handlePanEnd}
          >
            <span className={`capsule-object ${isDragging ? 'is-dragging' : ''}`}>
              <span className="capsule-shell" aria-hidden>
                <span className="capsule-chrome-core" aria-hidden>
                  <span className="capsule-loading" aria-hidden>
                    <span className="capsule-dot" />
                    <span className="capsule-dot" />
                    <span className="capsule-dot" />
                    <span className="capsule-dot" />
                    <span className="capsule-dot" />
                  </span>
                </span>
              </span>
            </span>
          </motion.span>
        </span>

        <span className="capsule-meta">
          <span className="capsule-name">{brandName}</span>
          {tagline ? <span className="capsule-tagline">{tagline}</span> : null}
          {destinationLabel ? <span className="capsule-instruction">{destinationLabel}</span> : null}
        </span>
      </motion.button>

      <AnimatePresence>
        {isActivating ? (
          <motion.p
            className="capsule-enter-text"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            Entering experience...
          </motion.p>
        ) : null}
      </AnimatePresence>
    </motion.section>
  )
}
