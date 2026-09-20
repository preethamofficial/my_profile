import { Plus, Trash2 } from 'lucide-react'

import type { SiteContent } from '@/hooks/useSiteContent'

type ExperienceItem = SiteContent['experience'][number]

interface ExperiencePanelProps {
  items: ExperienceItem[]
  error: string | null
  onChange: (items: ExperienceItem[]) => void
}

const inputClass = 'mt-1 w-full rounded border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-brand-cyan'

export function ExperiencePanel({ items, error, onChange }: ExperiencePanelProps) {
  const update = (index: number, patch: Partial<ExperienceItem>) => {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  return (
    <>
      <p className="hud-label">MISSION CHECKPOINTS // {items.length}</p>

      {items.map((item, index) => (
        <div key={index} className="rounded border border-white/10 p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="hud-label">ENTRY {String(index + 1).padStart(2, '0')}</p>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              className="focusable rounded p-1 text-white/50 hover:text-[#ff2a2a]"
              aria-label={`Delete experience entry ${index + 1}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label htmlFor={`exp-t-${index}`} className="hud-label block">ROLE / TITLE</label>
              <input id={`exp-t-${index}`} value={item.title} onChange={(e) => update(index, { title: e.target.value })} className={inputClass} />
            </div>
            <div className="flex-1">
              <label htmlFor={`exp-c-${index}`} className="hud-label block">COMPANY</label>
              <input id={`exp-c-${index}`} value={item.company} onChange={(e) => update(index, { company: e.target.value })} className={inputClass} />
            </div>
          </div>

          <div className="mt-2 flex items-end gap-2">
            <div className="flex-1">
              <label htmlFor={`exp-d-${index}`} className="hud-label block">PERIOD</label>
              <input id={`exp-d-${index}`} value={item.duration} onChange={(e) => update(index, { duration: e.target.value })} className={inputClass} />
            </div>
            <label className="focusable mb-2 flex cursor-pointer items-center gap-2 text-xs text-white/70">
              <input
                type="checkbox"
                checked={item.current}
                onChange={(e) => update(index, { current: e.target.checked })}
                className="accent-cyan-400"
              />
              CURRENT
            </label>
          </div>

          <label htmlFor={`exp-h-${index}`} className="hud-label mt-2 block">RESPONSIBILITIES (one per line)</label>
          <textarea
            id={`exp-h-${index}`}
            rows={3}
            value={item.highlights.join('\n')}
            onChange={(e) => update(index, { highlights: e.target.value.split('\n').filter((line) => line.trim().length > 0) })}
            className={inputClass}
          />

          <label htmlFor={`exp-tech-${index}`} className="hud-label mt-2 block">TECH (comma separated)</label>
          <input
            id={`exp-tech-${index}`}
            value={item.tech.join(', ')}
            onChange={(e) => update(index, { tech: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
            className={inputClass}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          onChange([...items, { title: 'New Role', company: 'Company', duration: '2026 – Present', current: true, highlights: ['Describe what you did.'], tech: ['Python'] }])
        }
        className="button-secondary w-full justify-center"
      >
        <Plus className="h-4 w-4" /> Add experience entry
      </button>

      {error ? <p className="text-xs font-semibold text-[#ff2a2a]">{error}</p> : null}
    </>
  )
}
