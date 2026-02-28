import { motion } from 'framer-motion'

import { Reveal } from '@/components/common/Reveal'
import { SectionHeading } from '@/components/common/SectionHeading'
import { learningResources, roadmap } from '@/data/portfolio'

export function RoadmapSection() {
  return (
    <section id="roadmap" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Roadmap"
        title="Learning Progress (2025 - 2026)"
        description="A structured plan from fundamentals to production-grade multi-model orchestration."
      />

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {roadmap.map((phase, index) => (
          <Reveal key={phase.phase} delay={index * 0.08} className="glass-card rounded-2xl p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-cyan">{phase.phase}</p>
            <h3 className="mt-2 text-xl font-semibold text-[var(--text-primary)]">{phase.title}</h3>
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-xs font-semibold text-[var(--text-secondary)]">
                <span>Progress</span>
                <span>{phase.progress}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-blue"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${phase.progress}%` }}
                  viewport={{ once: true, amount: 0.65 }}
                  transition={{ duration: 0.85, ease: 'easeOut' }}
                />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {phase.focus.map((skill) => (
                <span
                  key={`${phase.phase}-${skill}`}
                  className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-[var(--text-primary)]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-8 glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Resources Used</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {learningResources.map((resource) => (
            <span
              key={resource}
              className="rounded-full border border-brand-purple/40 bg-brand-purple/15 px-3 py-1 text-xs font-semibold text-brand-purple"
            >
              {resource}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
