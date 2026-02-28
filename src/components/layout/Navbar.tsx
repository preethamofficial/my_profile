import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link as ScrollLink } from 'react-scroll'

import { navItems, profile } from '@/data/portfolio'
import { ThemeToggle } from '@/components/common/ThemeToggle'

interface NavbarProps {
  theme: 'dark' | 'light'
  onToggleTheme: () => void
}

export function Navbar({ theme, onToggleTheme }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[var(--surface-strong)]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <a href="#top" className="focusable rounded-md">
          <span className="block text-lg font-bold tracking-tight gradient-text">{profile.name}</span>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">Gen AI | AI Engineer</span>
        </a>

        <nav className="hidden items-center gap-4 lg:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <ScrollLink
              key={item.target}
              to={item.target}
              spy
              smooth
              duration={500}
              offset={-82}
              activeClass="text-brand-cyan"
              className="focusable cursor-pointer rounded-md px-2 py-1 text-sm font-medium text-[var(--text-secondary)] transition hover:text-brand-cyan"
            >
              {item.label}
            </ScrollLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            type="button"
            className="focusable inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/15 bg-white/10 p-2 text-[var(--text-primary)] transition hover:border-brand-purple hover:text-brand-purple lg:hidden"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setIsOpen((state) => !state)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen ? (
        <nav className="glass-card-strong border-t border-white/10 px-4 py-3 lg:hidden" aria-label="Mobile navigation">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.target}>
                <ScrollLink
                  to={item.target}
                  spy
                  smooth
                  duration={500}
                  offset={-76}
                  className="focusable block cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-white/10 hover:text-brand-cyan"
                  onClick={closeMenu}
                >
                  {item.label}
                </ScrollLink>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  )
}
