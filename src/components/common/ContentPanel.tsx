import type { RefObject } from 'react'
import { ImagePlus, RotateCcw } from 'lucide-react'

import type { SiteContent } from '@/hooks/useSiteContent'

interface ContentPanelProps {
  content: SiteContent
  heroFileRef: RefObject<HTMLInputElement | null>
  error: string | null
  onChange: (patch: Partial<SiteContent>) => void
  onHeroImage: (file: File) => void
  onReset: () => void
}

const inputClass = 'mt-1 w-full rounded border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-brand-cyan'

export function ContentPanel({ content, heroFileRef, error, onChange, onHeroImage, onReset }: ContentPanelProps) {
  const stats = [0, 1, 2].map((i) => content.stats[i] ?? { value: 0, suffix: '', label: '' })

  return (
    <>
      <div>
        <p className="hud-label mb-2">HERO VISUAL IMAGE</p>
        <input ref={heroFileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onHeroImage(e.target.files[0])} />
        <button type="button" onClick={() => heroFileRef.current?.click()} className="button-secondary w-full justify-center">
          <ImagePlus className="h-4 w-4" /> Replace hero visual (max 4MB)
        </button>
        {content.heroImage ? (
          <button type="button" onClick={() => onChange({ heroImage: null })} className="focusable mt-2 text-xs text-white/50 underline hover:text-white">
            Restore default Gen AI visual
          </button>
        ) : null}
      </div>

      <div>
        <label htmlFor="ed-name" className="hud-label block">HERO NAME</label>
        <input id="ed-name" value={content.heroName} onChange={(e) => onChange({ heroName: e.target.value })} placeholder="A Preetham Reddy" className={inputClass} />
      </div>
      <div>
        <label htmlFor="ed-title" className="hud-label block">HERO TITLE</label>
        <input id="ed-title" value={content.heroTitle} onChange={(e) => onChange({ heroTitle: e.target.value })} placeholder="AI / ML Engineer | Generative AI & RAG Developer" className={inputClass} />
      </div>
      <div>
        <label htmlFor="ed-summary" className="hud-label block">HERO SUMMARY</label>
        <textarea id="ed-summary" rows={3} value={content.heroSummary} onChange={(e) => onChange({ heroSummary: e.target.value })} className={inputClass} />
      </div>

      <div>
        <label htmlFor="ed-about" className="hud-label block">ABOUT PARAGRAPHS (one per line)</label>
        <textarea
          id="ed-about"
          rows={5}
          value={content.aboutParagraphs.join('\n')}
          onChange={(e) => onChange({ aboutParagraphs: e.target.value.split('\n').filter((line) => line.trim().length > 0) })}
          className={inputClass}
        />
      </div>

      <div>
        <p className="hud-label mb-2">STAT CARDS (3)</p>
        {stats.map((stat, index) => (
          <div key={index} className="mb-3 rounded border border-white/10 p-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <label htmlFor={`stat-v-${index}`} className="hud-label block">VALUE</label>
                <input
                  id={`stat-v-${index}`}
                  type="number"
                  value={stat.value}
                  onChange={(e) => {
                    const nextStats = [...stats]
                    nextStats[index] = { ...stat, value: Number(e.target.value) }
                    onChange({ stats: nextStats })
                  }}
                  className={inputClass}
                />
              </div>
              <div className="w-20">
                <label htmlFor={`stat-s-${index}`} className="hud-label block">SUFFIX</label>
                <input
                  id={`stat-s-${index}`}
                  value={stat.suffix}
                  onChange={(e) => {
                    const nextStats = [...stats]
                    nextStats[index] = { ...stat, suffix: e.target.value }
                    onChange({ stats: nextStats })
                  }}
                  className={inputClass}
                />
              </div>
            </div>
            <label htmlFor={`stat-l-${index}`} className="hud-label mt-2 block">LABEL</label>
            <input
              id={`stat-l-${index}`}
              value={stat.label}
              onChange={(e) => {
                const nextStats = [...stats]
                nextStats[index] = { ...stat, label: e.target.value }
                onChange({ stats: nextStats })
              }}
              className={inputClass}
            />
          </div>
        ))}
      </div>

      {error ? <p className="text-xs font-semibold text-[#ff2a2a]">{error}</p> : null}

      <button type="button" onClick={onReset} className="button-secondary w-full justify-center">
        <RotateCcw className="h-4 w-4" /> Restore default content
      </button>
    </>
  )
}
