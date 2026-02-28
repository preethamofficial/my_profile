import { useMemo, useState } from 'react'
import type { ComponentType } from 'react'
import { BrainCircuit, Braces, Cloud, Cpu, Network, TreePine } from 'lucide-react'

interface TechLogoProps {
  name: string
  icon: string
  color: string
  className?: string
}

const fallbackIconMap: Record<string, ComponentType<{ className?: string }>> = {
  LlamaIndex: BrainCircuit,
  AWS: Cloud,
  'VS Code': Braces,
  Weaviate: Network,
  Pinecone: TreePine,
}

function normalizeHex(color: string): string {
  return color.startsWith('#') ? color : `#${color}`
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleanedHex = normalizeHex(hex).replace('#', '')
  const expandedHex =
    cleanedHex.length === 3
      ? cleanedHex
          .split('')
          .map((channel) => `${channel}${channel}`)
          .join('')
      : cleanedHex

  const value = Number.parseInt(expandedHex, 16)
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  }
}

function withAlpha(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function TechLogo({ name, icon, color, className = '' }: TechLogoProps) {
  const [hasError, setHasError] = useState(false)
  const baseColor = useMemo(() => normalizeHex(color), [color])
  const FallbackIcon = fallbackIconMap[name] ?? Cpu

  if (!hasError) {
    return (
      <img
        src={`https://cdn.simpleicons.org/${icon}/${color}`}
        alt={`${name} logo`}
        loading="lazy"
        className={className}
        onError={() => setHasError(true)}
      />
    )
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-md border ${className}`}
      style={{
        color: baseColor,
        borderColor: withAlpha(baseColor, 0.55),
        backgroundColor: withAlpha(baseColor, 0.16),
      }}
      aria-label={`${name} symbol`}
      title={name}
    >
      <FallbackIcon className="h-[70%] w-[70%]" />
    </span>
  )
}

