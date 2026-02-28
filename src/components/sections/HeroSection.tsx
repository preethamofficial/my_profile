import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, Download, TerminalSquare } from 'lucide-react'
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
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-24 h-[560px] w-[560px] -translate-x-1/2 rounded-full border border-white/10 bg-white/5 blur-[0.5px]"
        style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 0 80px rgba(6,182,212,0.18), 0 0 120px rgba(168,85,247,0.14)' }}
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
              className="mt-5 text-5xl font-extrabold leading-[0.95] text-[var(--text-primary)] sm:text-6xl lg:text-7xl"
            >
              <span className="glitch-text gradient-text inline-block" data-text="A Preetham Reddy">
                A Preetham Reddy
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.52, delay: 0.18 }}
              className="mt-3 text-sm font-semibold uppercase tracking-[0.28em] text-[var(--text-secondary)]"
            >
              {profile.title}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.52, delay: 0.26 }}
              className="mt-4 min-h-[2rem] text-lg font-semibold text-brand-cyan sm:text-2xl"
              aria-label="Current role animation"
            >
              <span ref={typedElementRef} />
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.52, delay: 0.34 }}
              className="mt-5 max-w-2xl text-sm text-[var(--text-secondary)] sm:text-base"
            >
              {profile.summary}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.45 }}
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
              transition={{ duration: 0.6, delay: 0.58 }}
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
            <motion.div
              className="glass-card-strong group relative overflow-hidden rounded-3xl p-5 sm:p-6"
              style={{ transformPerspective: 900, transformStyle: 'preserve-3d' }}
              initial={{ rotateX: 6, rotateY: -10 }}
              whileHover={{ y: -6, rotateX: 4, rotateY: -8 }}
              transition={{ duration: 0.25 }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    'radial-gradient(circle at 30% 10%, rgba(6,182,212,0.20), transparent 55%), radial-gradient(circle at 70% 90%, rgba(168,85,247,0.18), transparent 58%)',
                }}
              />

              <div className="mb-4 flex items-center justify-between">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
                  <TerminalSquare className="h-3.5 w-3.5" />
                  Python Window
                </span>
                <span
                  className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                    isBootComplete
                      ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-300'
                      : 'border-brand-cyan/40 bg-brand-cyan/10 text-brand-cyan'
                  }`}
                >
                  {isBootComplete ? 'Online' : 'Booting'}
                </span>
              </div>

              <div className="neural-shell rounded-2xl border border-white/10 bg-black/20 p-4 shadow-[0_28px_90px_-70px_rgba(6,182,212,0.9)]">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" aria-hidden />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" aria-hidden />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/80" aria-hidden />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--text-secondary)]">agent.py</span>
                </div>

                <pre className="overflow-hidden rounded-xl bg-white/5 p-3 text-[11px] leading-relaxed text-slate-200">
                  <code>
                    <span className="text-brand-purple">from</span> <span className="text-slate-100">dataclasses</span>{' '}
                    <span className="text-brand-purple">import</span> <span className="text-slate-100">dataclass</span>
                    {'\n'}
                    {'\n'}
                    <span className="text-brand-purple">@dataclass</span>
                    {'\n'}
                    <span className="text-brand-purple">class</span> <span className="text-brand-cyan">Agent</span>:
                    {'\n'}
                    {'  '}<span className="text-slate-100">name</span>: <span className="text-slate-300">str</span>
                    {'\n'}
                    {'  '}<span className="text-slate-100">focus</span>: <span className="text-slate-300">list</span>[<span className="text-slate-300">str</span>]
                    {'\n'}
                    {'\n'}
                    <span className="text-brand-purple">def</span> <span className="text-brand-cyan">boot</span>() -&gt; <span className="text-slate-300">None</span>:
                    {'\n'}
                    {'  '}<span className="text-brand-purple">print</span>(<span className="text-emerald-200">"READY: runtime online"</span>)
                    {'\n'}
                    {'\n'}
                    <span className="text-slate-400"># {bootSequenceSteps[Math.min(bootStep, bootSequenceSteps.length - 1)]}</span>
                  </code>
                </pre>
              </div>

              <div className="mt-5 flex items-center gap-4">
                <div className="animate-float-slow rounded-full bg-gradient-to-tr from-brand-cyan via-brand-purple to-brand-blue p-1 shadow-2xl shadow-brand-cyan/20">
                  <img
                    src={avatarUrl ?? `https://avatars.githubusercontent.com/${profile.githubUsername}`}
                    alt={`${profile.name} profile`}
                    loading="lazy"
                    className="h-14 w-14 rounded-full border border-white/20 object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{profile.role}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{profile.location}</p>
                </div>
              </div>
            </motion.div>
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

