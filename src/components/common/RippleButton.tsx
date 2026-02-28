import type { ButtonHTMLAttributes, MouseEvent } from 'react'

type RippleButtonVariant = 'primary' | 'secondary' | 'ghost'

interface RippleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: RippleButtonVariant
  magnetic?: boolean
  magneticStrength?: number
}

const baseClassName =
  'focusable ripple-button inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 will-change-transform'

const variants: Record<RippleButtonVariant, string> = {
  primary:
    'border border-brand-cyan/20 bg-brand-cyan text-slate-950 hover:-translate-y-0.5 hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/40',
  secondary:
    'border border-white/20 bg-white/10 text-[var(--text-primary)] hover:-translate-y-0.5 hover:bg-white/20 hover:shadow-lg hover:shadow-brand-purple/30',
  ghost:
    'border border-white/20 bg-transparent text-[var(--text-primary)] hover:-translate-y-0.5 hover:border-brand-cyan hover:text-brand-cyan',
}

export function RippleButton({
  className = '',
  variant = 'primary',
  magnetic = true,
  magneticStrength = 0.24,
  onClick,
  onMouseMove,
  onMouseLeave,
  ...props
}: RippleButtonProps) {
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

  const handleMouseMove = (event: MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget
    if (magnetic && !button.disabled) {
      const rect = button.getBoundingClientRect()
      const relativeX = event.clientX - rect.left - rect.width / 2
      const relativeY = event.clientY - rect.top - rect.height / 2
      button.style.transform = `translate3d(${relativeX * magneticStrength}px, ${relativeY * magneticStrength}px, 0)`
    }

    if (onMouseMove) onMouseMove(event)
  }

  const handleMouseLeave = (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.style.transform = 'translate3d(0, 0, 0)'
    if (onMouseLeave) onMouseLeave(event)
  }

  return (
    <button className={buttonClassName} onClick={handleClick} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} {...props} />
  )
}
