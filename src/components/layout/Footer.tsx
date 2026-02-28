import { useEffect, useState } from 'react'
import { ArrowUp, Heart } from 'lucide-react'
import { FaGithub, FaLinkedinIn } from 'react-icons/fa6'
import { MdEmail } from 'react-icons/md'
import { Link as ScrollLink, animateScroll } from 'react-scroll'

import { profile } from '@/data/portfolio'

interface FooterProps {
  lastUpdated: string
}

function formatLastUpdated(dateString: string): string {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) {
    return 'Unavailable'
  }

  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export function Footer({ lastUpdated }: FooterProps) {
  const [showTopButton, setShowTopButton] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setShowTopButton(window.scrollY > 420)
    }

    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const updatedText = formatLastUpdated(lastUpdated)

  return (
    <footer className="relative mt-20 border-t border-white/10 bg-black/25 py-10">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="space-y-3">
          <p className="text-base font-semibold text-[var(--text-primary)]">{profile.name} © 2026</p>
          <p className="text-sm text-[var(--text-secondary)]">Built with React + TypeScript</p>
          <p className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)]">
            Made with
            <Heart className="h-4 w-4 text-rose-400" fill="currentColor" aria-hidden />
            in Bangalore, India
          </p>
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)]">
            Last updated: {updatedText}
          </p>
        </div>

        <div className="space-y-4 lg:justify-self-end lg:text-right">
          <div className="flex flex-wrap gap-3 text-sm lg:justify-end">
            <ScrollLink
              to="about"
              smooth
              duration={500}
              offset={-78}
              className="focusable cursor-pointer rounded-md px-2 py-1 text-[var(--text-secondary)] transition hover:text-brand-cyan"
            >
              About
            </ScrollLink>
            <ScrollLink
              to="projects"
              smooth
              duration={500}
              offset={-78}
              className="focusable cursor-pointer rounded-md px-2 py-1 text-[var(--text-secondary)] transition hover:text-brand-cyan"
            >
              Projects
            </ScrollLink>
            <ScrollLink
              to="contact"
              smooth
              duration={500}
              offset={-78}
              className="focusable cursor-pointer rounded-md px-2 py-1 text-[var(--text-secondary)] transition hover:text-brand-cyan"
            >
              Contact
            </ScrollLink>
          </div>
          <div className="flex items-center gap-3 lg:justify-end">
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn profile"
              className="focusable rounded-full border border-white/15 bg-white/10 p-2 text-[var(--text-primary)] transition hover:border-brand-cyan hover:text-brand-cyan"
            >
              <FaLinkedinIn className="h-4 w-4" />
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile"
              className="focusable rounded-full border border-white/15 bg-white/10 p-2 text-[var(--text-primary)] transition hover:border-brand-purple hover:text-brand-purple"
            >
              <FaGithub className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${profile.email}`}
              aria-label="Email"
              className="focusable rounded-full border border-white/15 bg-white/10 p-2 text-[var(--text-primary)] transition hover:border-brand-blue hover:text-brand-blue"
            >
              <MdEmail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {showTopButton ? (
        <button
          type="button"
          className="focusable fixed bottom-6 left-6 z-40 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-brand-cyan/50 bg-black/50 p-3 text-brand-cyan transition hover:scale-105 hover:bg-brand-cyan/10"
          aria-label="Back to top"
          onClick={() => animateScroll.scrollToTop({ duration: 600 })}
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      ) : null}
    </footer>
  )
}
