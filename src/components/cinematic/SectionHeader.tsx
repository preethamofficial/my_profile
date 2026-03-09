import { motion } from 'framer-motion'

interface SectionHeaderProps {
  eyebrow: string
  title: string
  description: string
  align?: 'left' | 'center'
}

export function SectionHeader({ eyebrow, title, description, align = 'left' }: SectionHeaderProps) {
  const alignment = align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55 }}
      className={alignment}
    >
      <span className="glass-chip inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
        {eyebrow}
      </span>
      <h2 className="mt-4 font-heading text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-white/62 sm:text-base">{description}</p>
    </motion.div>
  )
}
