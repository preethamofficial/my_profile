import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, CheckCircle2, Download, TerminalSquare } from 'lucide-react'
import { FaGithub, FaLinkedinIn } from 'react-icons/fa6'
import { MdEmail } from 'react-icons/md'
import Typed from 'typed.js'
import { scroller } from 'react-scroll'

import { profile, typingRoles } from '@/data/portfolio'
import { RippleButton } from '@/components/common/RippleButton'
import { downloadResumePdf } from '@/utils/resume'

interface HeroSectionProps {
  avatarUrl?: string
}

const bootSequenceSteps = [
  'BOOT: Initializing neural workspace...',
  'SYNC: Loading prompt orchestration modules...',
  'INDEX: Connecting vector memory channels...',
  'READY: Agent runtime online.',
]

export function HeroSection({ avatarUrl }: HeroSectionProps) {
  const typedElementRef = useRef<HTMLSpanElement | null>(null)
  const [bootStep, setBootStep] = useState(0)
  const { scrollY } = useScroll()
  const parallaxY = useTransform(scrollY, [0, 800], [0, 130])
  const isBootComplete = bootStep >= bootSequenceSteps.length

  useEffect(() => {
    const timer = window.setInterval(() => {
      setBootStep((currentStep) => {
        if (currentStep >= bootSequenceSteps.length) {
          window.clearInterval(timer)
          return currentStep
        }

        return currentStep + 1
      })
    }, 530)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!typedElementRef.current) {
      return
    }

    const typed = new Typed(typedElementRef.current, {
      strings: typingRoles,
      typeSpeed: 66,
      backSpeed: 40,
      backDelay: 1350,
      loop: true,
      smartBackspace: true,
    })

    return () => typed.destroy()
  }, [])

  const scrollToProjects = () => {
    scroller.scrollTo('projects', { duration: 650, smooth: true, offset: -78 })
  }

  return (
    <section id="top" className="hero-gradient relative isolate overflow-hidden pt-28 sm:pt-32">
      <motion.div
        aria-hidden
        className="absolute -top-20 left-[8%] h-72 w-72 rounded-full bg-brand-cyan/15 blur-3xl"
        animate={{ x: [0, 35, 0], y: [0, -18, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="absolute right-[10%] top-24 h-80 w-80 rounded-full bg-brand-purple/16 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div style={{ y: parallaxY }} className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="command-pill inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em]"
            >
              AI Command Center
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="mt-5 text-4xl font-extrabold leading-tight text-[var(--text-primary)] sm:text-5xl lg:text-6xl"
            >
              <span className="glitch-text gradient-text inline-block" data-text={profile.name}>
                {profile.name}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.52, delay: 0.2 }}
              className="mt-4 text-base text-[var(--text-secondary)] sm:text-lg"
            >
              {profile.title}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.52, delay: 0.28 }}
              className="mt-4 min-h-[2rem] text-lg font-semibold text-brand-cyan sm:text-2xl"
              aria-label="Current role animation"
            >
              <span ref={typedElementRef} />
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.52, delay: 0.36 }}
              className="mt-5 max-w-2xl text-sm text-[var(--text-secondary)] sm:text-base"
            >
              {profile.summary}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.47 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <RippleButton type="button" variant="primary" onClick={scrollToProjects}>
                View Projects
              </RippleButton>
              <RippleButton
                type="button"
                variant="secondary"
                onClick={() => {
                  void downloadResumePdf()
                }}
              >
                <Download className="h-4 w-4" />
                Download Resume
              </RippleButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-7 flex items-center gap-3"
            >
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn profile"
                className="focusable rounded-full border border-white/15 bg-white/10 p-3 text-[var(--text-primary)] transition hover:-translate-y-1 hover:border-brand-cyan hover:text-brand-cyan hover:shadow-lg hover:shadow-brand-cyan/30"
              >
                <FaLinkedinIn className="h-5 w-5" />
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub profile"
                className="focusable rounded-full border border-white/15 bg-white/10 p-3 text-[var(--text-primary)] transition hover:-translate-y-1 hover:border-brand-purple hover:text-brand-purple hover:shadow-lg hover:shadow-brand-purple/30"
              >
                <FaGithub className="h-5 w-5" />
              </a>
              <a
                href={`mailto:${profile.email}`}
                aria-label="Send email"
                className="focusable rounded-full border border-white/15 bg-white/10 p-3 text-[var(--text-primary)] transition hover:-translate-y-1 hover:border-brand-blue hover:text-brand-blue hover:shadow-lg hover:shadow-brand-blue/30"
              >
                <MdEmail className="h-5 w-5" />
              </a>
            </motion.div>
          </div>

          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.28 }}
            className="ai-border-card rounded-3xl"
          >
            <div className="glass-card-strong rounded-3xl p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
                  <TerminalSquare className="h-3.5 w-3.5" />
                  Boot Sequence
                </span>
                <span
                  className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                    isBootComplete
                      ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-300'
                      : 'border-brand-cyan/40 bg-brand-cyan/10 text-brand-cyan'
                  }`}
                >
                  {isBootComplete ? 'System Ready' : 'Initializing'}
                </span>
              </div>

              <div className="neural-shell rounded-2xl p-4">
                <ul className="space-y-2 font-mono text-[11px] text-[var(--text-secondary)]">
                  {bootSequenceSteps.map((step, index) => {
                    const isVisible = index < bootStep
                    return (
                      <motion.li
                        key={step}
                        initial={{ opacity: 0, x: -8 }}
                        animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0.16, x: -8 }}
                        transition={{ duration: 0.25 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle2
                          className={`h-3.5 w-3.5 ${isVisible ? 'text-emerald-300' : 'text-[var(--text-secondary)]/50'}`}
                        />
                        {step}
                      </motion.li>
                    )
                  })}
                </ul>
              </div>

              <div className="mt-5 flex items-center gap-4">
                <div className="animate-float-slow rounded-full bg-gradient-to-tr from-brand-cyan via-brand-purple to-brand-blue p-1 shadow-2xl shadow-brand-cyan/20">
                  <img
                    src={avatarUrl ?? `https://avatars.githubusercontent.com/${profile.githubUsername}`}
                    alt={`${profile.name} profile`}
                    loading="lazy"
                    className="h-16 w-16 rounded-full border border-white/20 object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{profile.role}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{profile.location}</p>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>

        <button
          type="button"
          onClick={() => scroller.scrollTo('about', { duration: 650, smooth: true, offset: -76 })}
          className="focusable mt-12 inline-flex min-h-[44px] min-w-[44px] animate-bounce items-center justify-center rounded-full border border-white/20 bg-white/10 p-2 text-[var(--text-primary)] transition hover:border-brand-cyan hover:text-brand-cyan"
          aria-label="Scroll down to about section"
        >
          <ArrowDown className="h-5 w-5" />
        </button>
      </motion.div>
    </section>
  )
}

