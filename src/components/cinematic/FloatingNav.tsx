import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useState } from 'react'

import { navItems, profile } from '@/data/portfolio'

interface FloatingNavProps {
  activeSection: string
  onNavigate: (target: string) => void
}

export function FloatingNav({ activeSection, onNavigate }: FloatingNavProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleNavigate = (target: string) => {
    onNavigate(target)
    setMenuOpen(false)
  }

  return (
    <header className="fixed inset-x-4 top-4 z-50">
      <div className="mx-auto max-w-6xl rounded-[28px] border border-white/10 bg-black/35 px-3 py-3 shadow-[0_22px_70px_-45px_rgba(0,0,0,0.9)] backdrop-blur-2xl sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => handleNavigate('home')}
            className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-left transition hover:border-white/20 hover:bg-white/[0.08]"
            data-cursor="interactive"
            aria-label="Go to home section"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#ff2a2a] text-sm font-bold text-white">AP</span>
            <span className="hidden sm:block">
              <span className="block font-heading text-sm font-semibold tracking-[0.18em] text-white">PREETHAM</span>
              <span className="block text-[10px] uppercase tracking-[0.28em] text-white/45">Gen AI Systems</span>
            </span>
          </button>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
            {navItems.map((item) => {
              const isActive = activeSection === item.target
              return (
                <button
                  key={item.target}
                  type="button"
                  onClick={() => handleNavigate(item.target)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-white text-black' : 'text-white/68 hover:bg-white/[0.06] hover:text-white'
                  }`}
                  data-cursor="interactive"
                >
                  {item.label}
                </button>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`mailto:${profile.email}`}
              className="hidden rounded-full border border-[#ff2a2a]/30 bg-[#ff2a2a]/10 px-4 py-2 text-sm font-medium text-white transition hover:border-[#ff2a2a]/60 hover:bg-[#ff2a2a]/20 sm:inline-flex"
              data-cursor="interactive"
            >
              Contact
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-white transition hover:border-white/20 hover:bg-white/[0.08] lg:hidden"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              data-cursor="interactive"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="mx-auto mt-3 max-w-6xl rounded-[28px] border border-white/10 bg-black/70 p-3 backdrop-blur-2xl lg:hidden"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = activeSection === item.target
                return (
                  <button
                    key={item.target}
                    type="button"
                    onClick={() => handleNavigate(item.target)}
                    className={`rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                      isActive ? 'bg-white text-black' : 'bg-white/[0.03] text-white/70 hover:bg-white/[0.08] hover:text-white'
                    }`}
                    data-cursor="interactive"
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
