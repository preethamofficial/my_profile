import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, Download } from 'lucide-react'
import { FaGithub, FaLinkedinIn } from 'react-icons/fa6'
import { MdEmail } from 'react-icons/md'
import Typed from 'typed.js'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import { scroller } from 'react-scroll'

import { profile, typingRoles } from '@/data/portfolio'
import { RippleButton } from '@/components/common/RippleButton'

interface HeroSectionProps {
  avatarUrl?: string
}

export function HeroSection({ avatarUrl }: HeroSectionProps) {
  const typedElementRef = useRef<HTMLSpanElement | null>(null)
  const [particlesReady, setParticlesReady] = useState(false)
  const { scrollY } = useScroll()
  const parallaxY = useTransform(scrollY, [0, 800], [0, 140])

  useEffect(() => {
    void initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setParticlesReady(true)
    })
  }, [])

  useEffect(() => {
    if (!typedElementRef.current) {
      return
    }

    const typed = new Typed(typedElementRef.current, {
      strings: typingRoles,
      typeSpeed: 70,
      backSpeed: 42,
      backDelay: 1500,
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
      {particlesReady ? (
        <Particles
          id="hero-particles"
          className="absolute inset-0 -z-10"
          options={{
            fpsLimit: 120,
            particles: {
              number: { value: 55 },
              color: { value: ['#06b6d4', '#a855f7', '#3b82f6'] },
              opacity: { value: { min: 0.12, max: 0.55 } },
              size: { value: { min: 1, max: 3 } },
              move: { enable: true, speed: 0.7, direction: 'none', outModes: { default: 'out' } },
              links: { enable: true, distance: 130, color: '#64748b', opacity: 0.25, width: 1 },
            },
            detectRetina: true,
            interactivity: {
              events: {
                onHover: { enable: true, mode: 'repulse' },
              },
              modes: {
                repulse: { distance: 85, duration: 0.2 },
              },
            },
            background: { color: 'transparent' },
          }}
        />
      ) : null}

      <motion.div style={{ y: parallaxY }} className="mx-auto flex max-w-7xl flex-col items-center px-4 pb-20 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="relative"
        >
          <div className="animate-float-slow rounded-full bg-gradient-to-tr from-brand-cyan via-brand-purple to-brand-blue p-1 shadow-2xl shadow-brand-cyan/20">
            <img
              src={avatarUrl ?? `https://avatars.githubusercontent.com/${profile.githubUsername}`}
              alt={`${profile.name} profile`}
              loading="lazy"
              className="h-32 w-32 rounded-full border border-white/20 object-cover sm:h-36 sm:w-36"
            />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8 text-4xl font-extrabold leading-tight text-[var(--text-primary)] sm:text-6xl"
        >
          {profile.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.24 }}
          className="mt-3 text-base text-[var(--text-secondary)] sm:text-xl"
        >
          {profile.title}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.31 }}
          className="mt-4 min-h-[2rem] text-lg font-semibold text-brand-cyan sm:text-2xl"
          aria-label="Current role animation"
        >
          <span ref={typedElementRef} />
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.4 }}
          className="mt-5 max-w-3xl text-sm text-[var(--text-secondary)] sm:text-base"
        >
          {profile.summary}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.52 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <RippleButton type="button" variant="primary" onClick={scrollToProjects}>
            View Projects
          </RippleButton>
          <a
            href="/resume.pdf"
            download="A-Preetham-Reddy-Resume.pdf"
            className="focusable inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition hover:border-brand-purple hover:bg-white/15"
          >
            <Download className="h-4 w-4" />
            Download Resume
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.64 }}
          className="mt-8 flex items-center justify-center gap-3"
        >
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn profile"
            className="focusable rounded-full border border-white/15 bg-white/10 p-3 text-[var(--text-primary)] transition hover:scale-105 hover:border-brand-cyan hover:text-brand-cyan hover:shadow-lg hover:shadow-brand-cyan/30"
          >
            <FaLinkedinIn className="h-5 w-5" />
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub profile"
            className="focusable rounded-full border border-white/15 bg-white/10 p-3 text-[var(--text-primary)] transition hover:scale-105 hover:border-brand-purple hover:text-brand-purple hover:shadow-lg hover:shadow-brand-purple/30"
          >
            <FaGithub className="h-5 w-5" />
          </a>
          <a
            href={`mailto:${profile.email}`}
            aria-label="Send email"
            className="focusable rounded-full border border-white/15 bg-white/10 p-3 text-[var(--text-primary)] transition hover:scale-105 hover:border-brand-blue hover:text-brand-blue hover:shadow-lg hover:shadow-brand-blue/30"
          >
            <MdEmail className="h-5 w-5" />
          </a>
        </motion.div>

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
