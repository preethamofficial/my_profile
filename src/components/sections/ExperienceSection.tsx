import { Building2, GraduationCap } from 'lucide-react'

import { Reveal } from '@/components/common/Reveal'
import { SectionHeading } from '@/components/common/SectionHeading'
import { experience, profile } from '@/data/portfolio'

export function ExperienceSection() {
  return (
    <section id="experience" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Experience"
        title="Professional Timeline"
        description="Hands-on work across production LLM systems, automation, and full-stack AI applications."
      />

      <div className="relative mt-10 pl-7 sm:pl-10">
        <span className="timeline-line absolute bottom-0 left-2 top-0 w-1 rounded-full sm:left-4" aria-hidden />

        <div className="space-y-8">
          {experience.map((item, index) => (
            <Reveal key={`${item.company}-${item.title}`} delay={index * 0.1} className="relative">
              <span
                className={`absolute -left-[1.66rem] top-7 inline-flex h-5 w-5 items-center justify-center rounded-full border ${
                  item.current
                    ? 'border-brand-cyan bg-brand-cyan/30 shadow-lg shadow-brand-cyan/30'
                    : 'border-brand-purple bg-brand-purple/20'
                } sm:-left-[2.2rem]`}
                aria-hidden
              />

              <article className="glass-card hover-lift rounded-2xl p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-brand-cyan">
                      <Building2 className="h-4 w-4" aria-hidden />
                      {item.company}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-[var(--text-primary)]">{item.title}</h3>
                  </div>
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-[var(--text-secondary)]">
                    {item.duration}
                  </span>
                </div>

                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[var(--text-secondary)]">
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap gap-2">
                  {item.tech.map((tech) => (
                    <span
                      key={`${item.company}-${tech}`}
                      className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-[var(--text-primary)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal className="mt-10 glass-card rounded-2xl p-6">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-brand-purple">
          <GraduationCap className="h-4 w-4" aria-hidden />
          Education
        </p>
        <h3 className="mt-2 text-xl font-semibold text-[var(--text-primary)]">Brindavan College of Engineering (BCE), Bangalore</h3>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Bachelor&apos;s degree track with specialization-aligned work in AI systems and software engineering practices.
        </p>
        <p className="mt-3 text-sm font-medium text-brand-cyan">{profile.education}</p>
      </Reveal>
    </section>
  )
}
