import { Moon, Sun } from 'lucide-react'

interface ThemeToggleProps {
  theme: 'dark' | 'light'
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="focusable inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/15 bg-white/10 p-2 text-[var(--text-primary)] transition hover:border-brand-cyan hover:text-brand-cyan"
      onClick={onToggle}
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  )
}
