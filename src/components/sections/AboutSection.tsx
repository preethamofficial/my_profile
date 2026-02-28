import { useEffect, useRef, useState } from 'react'
import { BrainCircuit } from 'lucide-react'
import { useInView } from 'framer-motion'

import { SectionHeading } from '@/components/common/SectionHeading'
import { TechLogo } from '@/components/common/TechLogo'
import { Reveal } from '@/components/common/Reveal'
import { aboutParagraphs, aboutStats, techBadges } from '@/data/portfolio'

interface CounterProps {
  value: number
  suffix?: string
}

function Counter({ value, suffix = '' }: CounterProps) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const isInView = useInView(ref, { once: true, amount: 0.6 })
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (!isInView) return

    const duration = 900
    const steps = 35
    const increment = value / steps
    let currentStep = 0
    const timer = window.setInterval(() => {
      currentStep += 1
      const nextValue = Math.min(value, Math.round(increment * currentStep))
      setDisplayValue(nextValue)

      if (currentStep >= steps) {
        window.clearInterval(timer)
      }
    }, duration / steps)

    return () => window.clearInterval(timer)
  }, [isInView, value])

  return (
    <span ref={ref} className="text-2xl font-bold text-brand-cyan sm:text-3xl">
      {displayValue}
      {suffix}
    </span>
  )
}

export function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="About Me"
        title="Building Applied AI Systems, Not Just Demos"
        description="Practical Generative AI engineering with a clear focus on reliability, impact, and production outcomes."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <Reveal className="glass-card rounded-3xl p-6 sm:p-8">
          <div className="space-y-5 text-[var(--text-secondary)]">
            {aboutParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-cyan/40 bg-brand-cyan/10 px-4 py-2 text-sm font-semibold text-brand-cyan animate-pulse-glow">
              Currently Learning: Generative AI
            </p>
          </div>
        </Reveal>

        <Reveal className="glass-card relative overflow-hidden rounded-3xl p-6 sm:p-8" delay={0.12}>
          <div className="absolute right-4 top-4 h-14 w-14 rounded-full bg-brand-purple/20 blur-xl" aria-hidden />
          <div className="absolute bottom-6 left-6 h-20 w-20 rounded-full bg-brand-cyan/15 blur-xl" aria-hidden />
          <div className="relative">
            <div className="inline-flex rounded-2xl border border-white/10 bg-white/5 p-4">
              <BrainCircuit className="h-11 w-11 text-brand-cyan" aria-hidden />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-[var(--text-primary)]">AI Journey Snapshot</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              From Python automation to enterprise LLM workflows, with strong focus on evaluation, retrieval quality, and iterative prompt refinement.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {aboutStats.map((stat) => (
          <Reveal key={stat.label} className="glass-card rounded-2xl p-5 text-center">
            <Counter value={stat.value} suffix={stat.suffix} />
            <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-[var(--text-secondary)]">{stat.label}</p>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-10">
        <h3 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">Tech Stack</h3>
        <div className="flex flex-wrap gap-3">
          {techBadges.map((badge) => (
            <span
              key={badge.name}
              className="glass-card inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-[var(--text-primary)]"
            >
              <TechLogo name={badge.name} icon={badge.icon} color={badge.color} className="h-4 w-4" />
              {badge.name}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
