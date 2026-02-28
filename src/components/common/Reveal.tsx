import type { PropsWithChildren } from 'react'
import { motion } from 'framer-motion'

interface RevealProps extends PropsWithChildren {
  className?: string
  delay?: number
  y?: number
}

export function Reveal({ children, className = '', delay = 0, y = 28 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.62, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}
