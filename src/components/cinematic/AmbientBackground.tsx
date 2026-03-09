import { motion, useScroll, useTransform } from 'framer-motion'

export function AmbientBackground() {
  const { scrollY } = useScroll()
  const glowA = useTransform(scrollY, [0, 1800], [0, 240])
  const glowB = useTransform(scrollY, [0, 1800], [0, -180])
  const gridY = useTransform(scrollY, [0, 1800], [0, 120])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div style={{ y: glowA }} className="absolute -left-24 top-12 h-[28rem] w-[28rem] rounded-full bg-[#ff2a2a]/14 blur-[120px]" />
      <motion.div style={{ y: glowB }} className="absolute right-[-8rem] top-[18rem] h-[32rem] w-[32rem] rounded-full bg-white/[0.08] blur-[140px]" />
      <div className="absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_62%)]" />
      <motion.div style={{ y: gridY }} className="ambient-grid absolute inset-0 opacity-40" />
      <div className="ambient-noise absolute inset-0 opacity-[0.08]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  )
}
