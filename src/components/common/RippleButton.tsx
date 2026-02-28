import type { ButtonHTMLAttributes, MouseEvent } from 'react'

type RippleButtonVariant = 'primary' | 'secondary' | 'ghost'

interface RippleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: RippleButtonVariant
}

const baseClassName =
  'focusable ripple-button inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300'

const variants: Record<RippleButtonVariant, string> = {
  primary: 'bg-brand-cyan text-slate-950 hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/40',
  secondary: 'bg-white/10 text-slate-100 hover:bg-white/20 hover:shadow-lg hover:shadow-brand-purple/30',
  ghost: 'border border-white/20 bg-transparent text-slate-100 hover:border-brand-cyan hover:text-brand-cyan',
}

export function RippleButton({ className = '', variant = 'primary', onClick, ...props }: RippleButtonProps) {
  const buttonClassName = `${baseClassName} ${variants[variant]} ${className}`.trim()

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget
    const circle = document.createElement('span')
    const diameter = Math.max(button.clientWidth, button.clientHeight)
    const radius = diameter / 2
    const rect = button.getBoundingClientRect()

    circle.style.width = `${diameter}px`
    circle.style.height = `${diameter}px`
    circle.style.left = `${event.clientX - rect.left - radius}px`
    circle.style.top = `${event.clientY - rect.top - radius}px`
    circle.classList.add('ripple')

    const existingRipple = button.getElementsByClassName('ripple')[0]
    if (existingRipple) {
      existingRipple.remove()
    }

    button.appendChild(circle)
    if (onClick) onClick(event)
  }

  return <button className={buttonClassName} onClick={handleClick} {...props} />
}
