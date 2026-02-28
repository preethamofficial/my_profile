import { motion } from 'framer-motion'
import { Download } from 'lucide-react'

import { Reveal } from '@/components/common/Reveal'
import { SectionHeading } from '@/components/common/SectionHeading'
import { skillCategories, techBadges } from '@/data/portfolio'

const levelClassName: Record<string, string> = {
  Expert: 'text-emerald-300 bg-emerald-500/15 border-emerald-400/40',
  Advanced: 'text-cyan-300 bg-cyan-500/15 border-cyan-400/40',
  Intermediate: 'text-violet-300 bg-violet-500/15 border-violet-400/40',
}

export function SkillsSection() {
  return (
    <section id="skills" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Skills"
        title="Technical Stack Across AI, Backend, and Cloud"
        description="Categorized competencies with practical proficiency levels based on shipped work."
      />

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {skillCategories.map((category, categoryIndex) => (
          <Reveal key={category.category} delay={categoryIndex * 0.05} className="glass-card rounded-2xl p-5 sm:p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">{category.category}</h3>
            <div className="mt-4 space-y-4">
              {category.items.map((skill) => (
                <div key={skill.name}>
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-[var(--text-primary)]">{skill.name}</span>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] ${levelClassName[skill.level]}`}
                    >
                      {skill.level}
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-blue"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.percentage}%` }}
                      viewport={{ once: true, amount: 0.7 }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-12">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Technology Hex Grid</h3>
          <a
            href="/resume.pdf"
            download="A-Preetham-Reddy-Resume.pdf"
            className="focusable inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition hover:border-brand-cyan hover:text-brand-cyan"
          >
            <Download className="h-4 w-4" />
            View Resume
          </a>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-7">
          {techBadges.map((badge) => (
            <div
              key={`hex-${badge.name}`}
              className="group hex-cell glass-card hover-lift flex aspect-square items-center justify-center p-3 transition"
              aria-label={`${badge.name} technology badge`}
            >
              <img
                src={`https://cdn.simpleicons.org/${badge.icon}/${badge.color}`}
                alt={`${badge.name} logo`}
                loading="lazy"
                className="h-8 w-8"
                onError={(event) => {
                  event.currentTarget.style.display = 'none'
                }}
              />
              <span className="absolute bottom-2 translate-y-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--text-primary)] opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                {badge.name}
              </span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
