import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Cloud, Code2, Database, Download, Sparkles, Wrench } from 'lucide-react'

import { Reveal } from '@/components/common/Reveal'
import { RippleButton } from '@/components/common/RippleButton'
import { SectionHeading } from '@/components/common/SectionHeading'
import { TechLogo } from '@/components/common/TechLogo'
import { skillCategories, techBadges } from '@/data/portfolio'
import { downloadResumePdf } from '@/utils/resume'

const levelClassName: Record<string, string> = {
  Expert: 'text-emerald-300 bg-emerald-500/15 border-emerald-400/40',
  Advanced: 'text-cyan-300 bg-cyan-500/15 border-cyan-400/40',
  Intermediate: 'text-violet-300 bg-violet-500/15 border-violet-400/40',
}

const moduleIconMap: Record<string, typeof Code2> = {
  Programming: Code2,
  'AI / ML': Sparkles,
  'Generative AI': Wrench,
  'Backend & Cloud': Cloud,
  'Databases & Tools': Database,
}

interface HexSignalCellProps {
  badge: (typeof techBadges)[number]
  index: number
}

function HexSignalCell({ badge, index }: HexSignalCellProps) {
  const isCoreNode = index < 3

  return (
    <motion.div
      whileHover={{ scale: 1.08, y: -6, rotateZ: index % 2 === 0 ? 2 : -2 }}
      transition={{ duration: 0.22 }}
      className={`group hex-node ${isCoreNode ? 'hex-node-core' : ''}`}
      aria-label={`${badge.name} technology badge`}
    >
      <span className="hex-node-ring" aria-hidden />
      <span className="hex-node-scan" aria-hidden />
      <motion.div
        className="relative z-10"
        animate={{ rotate: [0, index % 2 === 0 ? 4 : -4, 0] }}
        transition={{ duration: 4 + index * 0.1, repeat: Infinity, ease: 'easeInOut' }}
      >
        <TechLogo name={badge.name} icon={badge.icon} color={badge.color} className="h-8 w-8" />
      </motion.div>
      <span className="hex-node-name">{badge.name}</span>
    </motion.div>
  )
}

export function SkillsSection() {
  const [expandedModule, setExpandedModule] = useState(skillCategories[0]?.category ?? '')

  const topSkillSummary = useMemo(
    () =>
      skillCategories
        .flatMap((category) => category.items)
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 4),
    [],
  )

  return (
    <section id="skills" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Skills"
        title="Interactive AI Modules"
        description="Technical capabilities structured as expandable modules, similar to production AI system components."
      />

      <Reveal className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">High Confidence Zones</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {topSkillSummary.map((skill) => (
            <span
              key={`summary-${skill.name}`}
              className="rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-3 py-1 text-xs font-semibold text-brand-cyan"
            >
              {skill.name} {skill.percentage}%
            </span>
          ))}
        </div>
      </Reveal>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {skillCategories.map((category, categoryIndex) => {
          const isExpanded = expandedModule === category.category
          const Icon = moduleIconMap[category.category] ?? Sparkles

          return (
            <Reveal key={category.category} delay={categoryIndex * 0.05} className="ai-border-card rounded-2xl">
              <motion.article
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="glass-card-strong rounded-2xl p-5 sm:p-6"
              >
                <button
                  type="button"
                  className="focusable flex w-full items-center justify-between gap-3 rounded-xl text-left"
                  onClick={() => setExpandedModule((current) => (current === category.category ? '' : category.category))}
                  aria-expanded={isExpanded}
                  aria-controls={`module-${category.category}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex rounded-xl border border-white/15 bg-white/10 p-2 text-brand-cyan">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--text-primary)]">{category.category}</h3>
                      <p className="text-xs text-[var(--text-secondary)]">{category.items.length} capabilities loaded</p>
                    </div>
                  </div>
                  <motion.span animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="h-5 w-5 text-[var(--text-secondary)]" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded ? (
                    <motion.div
                      id={`module-${category.category}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.28, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 space-y-4">
                        {category.items.map((skill) => (
                          <div key={skill.name}>
                            <div className="mb-1.5 flex items-center justify-between gap-3">
                              <span className="text-sm font-medium text-[var(--text-primary)]">{skill.name}</span>
                              <span
                                className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] ${levelClassName[skill.level]}`}
                              >
                                {skill.level}
                              </span>
                            </div>
                            <div className="h-3.5 overflow-hidden rounded-full border border-white/10 bg-white/10">
                              <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-blue shadow-[0_0_22px_rgba(6,182,212,0.22)]"
                                initial={{ width: 0 }}
                                whileInView={{ width: `${skill.percentage}%` }}
                                viewport={{ once: true, amount: 0.7 }}
                                transition={{ duration: 0.75, ease: 'easeOut' }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.article>
            </Reveal>
          )
        })}
      </div>

      <Reveal className="mt-12">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Technology Signal Grid</h3>
          <RippleButton
            type="button"
            variant="secondary"
            onClick={() => {
              void downloadResumePdf()
            }}
          >
            <Download className="h-4 w-4" />
            View Resume
          </RippleButton>
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-4 sm:p-6">
          <div className="pointer-events-none absolute -left-10 top-2 h-28 w-28 rounded-full bg-brand-cyan/20 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -right-8 bottom-2 h-24 w-24 rounded-full bg-brand-purple/20 blur-3xl" aria-hidden />

          <div className="signal-rail relative mb-6 overflow-hidden rounded-full bg-white/10">
            <motion.span
              className="signal-pulse"
              animate={{ x: ['-10%', '110%'] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          <div className="hex-deck-grid relative z-10">
            {techBadges.map((badge, index) => (
              <HexSignalCell key={`hex-${badge.name}`} badge={badge} index={index} />
            ))}
          </div>

        </div>
      </Reveal>
    </section>
  )
}
