import { useEffect, useRef, useState } from 'react'
import { ImagePlus, Lock, LogOut, RefreshCw, Settings2, Sparkles, X } from 'lucide-react'

import { DEFAULT_BACKGROUND_SETTINGS, loadBackgroundSettings, saveBackgroundSettings, type BackgroundSettings } from '@/hooks/useBackgroundSettings'

const ADMIN_USER = 'preetham'
const ADMIN_PASS = 'Punnu@1331'
const WALLPAPERS: Array<{ id: BackgroundSettings['wallpaper']; label: string }> = [
  { id: 'none', label: 'Default' },
  { id: 'aurora', label: 'Aurora Live' },
  { id: 'waves', label: 'Neon Waves' },
  { id: 'stars', label: 'Starfield' },
]

function commit(settings: BackgroundSettings) {
  saveBackgroundSettings(settings)
  window.dispatchEvent(new Event('bg-settings-changed'))
}

export function BackgroundEditor() {
  const [open, setOpen] = useState(false)
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('bg-editor-auth') === '1')
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [settings, setSettings] = useState<BackgroundSettings>(DEFAULT_BACKGROUND_SETTINGS)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) setSettings(loadBackgroundSettings())
  }, [open])

  useEffect(() => {
    if (settings.title) document.title = settings.title
  }, [settings.title])

  const update = (patch: Partial<BackgroundSettings>) => {
    const next = { ...settings, ...patch }
    setSettings(next)
    commit(next)
  }

  const handleLogin = () => {
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem('bg-editor-auth', '1')
      setAuthed(true)
      setError(null)
      setPass('')
    } else {
      setError('ACCESS DENIED // invalid credentials')
    }
  }

  const handleImage = (file: File) => {
    if (file.size > 4 * 1024 * 1024) {
      setError('Image too large (max 4MB)')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      update({ image: String(reader.result), wallpaper: 'none' })
      setError(null)
    }
    reader.readAsDataURL(file)
  }

  const logout = () => {
    sessionStorage.removeItem('bg-editor-auth')
    setAuthed(false)
    setOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="focusable fixed bottom-4 right-4 z-[90] inline-flex items-center gap-2 rounded border border-white/15 bg-black/55 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60 backdrop-blur transition hover:border-brand-cyan/60 hover:text-brand-cyan"
        aria-label="Edit background (admin only)"
      >
        <Settings2 className="h-3.5 w-3.5" />
        Edit Background
      </button>

      {open ? (
        <div className="fixed inset-0 z-[95] grid place-items-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Background editor">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-brand-cyan/30 bg-[#0a0f16]/95 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
              <p className="font-mono text-sm font-bold text-brand-cyan">BG_EDITOR // {authed ? 'ONLINE' : 'LOCKED'}</p>
              <button type="button" onClick={() => setOpen(false)} className="focusable rounded p-1 text-white/60 hover:text-white" aria-label="Close editor">
                <X className="h-4 w-4" />
              </button>
            </div>

            {!authed ? (
              <div className="space-y-4 p-5">
                <div>
                  <label htmlFor="bg-user" className="hud-label block">USERNAME</label>
                  <input id="bg-user" value={user} onChange={(e) => setUser(e.target.value)} autoComplete="username" className="mt-1 w-full rounded border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-brand-cyan" />
                </div>
                <div>
                  <label htmlFor="bg-pass" className="hud-label block">PASSWORD</label>
                  <input id="bg-pass" type="password" value={pass} onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} autoComplete="current-password" className="mt-1 w-full rounded border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-brand-cyan" />
                </div>
                {error ? <p className="text-xs font-semibold text-[#ff2a2a]">{error}</p> : null}
                <button type="button" onClick={handleLogin} className="button-primary w-full justify-center">
                  <Lock className="h-4 w-4" /> AUTHENTICATE
                </button>
              </div>
            ) : (
              <div className="max-h-[70vh] space-y-5 overflow-y-auto p-5">
                <div>
                  <p className="hud-label mb-2">LIVE WALLPAPER</p>
                  <div className="grid grid-cols-2 gap-2">
                    {WALLPAPERS.map((w) => (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => update({ wallpaper: w.id, image: w.id === 'none' ? settings.image : null })}
                        className={`focusable flex items-center justify-center gap-2 rounded border px-3 py-2 text-xs font-semibold transition ${
                          settings.wallpaper === w.id && !settings.image
                            ? 'border-brand-cyan bg-brand-cyan/15 text-brand-cyan'
                            : 'border-white/15 text-white/70 hover:border-brand-cyan/50'
                        }`}
                      >
                        <Sparkles className="h-3.5 w-3.5" /> {w.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="hud-label mb-2">CUSTOM BACKGROUND IMAGE</p>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])} />
                  <button type="button" onClick={() => fileRef.current?.click()} className="button-secondary w-full justify-center">
                    <ImagePlus className="h-4 w-4" /> Upload image (max 4MB)
                  </button>
                  {settings.image ? (
                    <button type="button" onClick={() => update({ image: null })} className="focusable mt-2 text-xs text-white/50 underline hover:text-white">
                      Remove custom image
                    </button>
                  ) : null}
                </div>

                <div>
                  <div className="flex justify-between"><label htmlFor="bg-bright" className="hud-label">BRIGHTNESS</label><span className="hud-label">{settings.brightness.toFixed(2)}x</span></div>
                  <input id="bg-bright" type="range" min="0.2" max="1.6" step="0.05" value={settings.brightness} onChange={(e) => update({ brightness: Number(e.target.value) })} className="w-full accent-cyan-400" />
                </div>
                <div>
                  <div className="flex justify-between"><label htmlFor="bg-blur" className="hud-label">BLUR</label><span className="hud-label">{settings.blur}px</span></div>
                  <input id="bg-blur" type="range" min="0" max="20" step="1" value={settings.blur} onChange={(e) => update({ blur: Number(e.target.value) })} className="w-full accent-cyan-400" />
                </div>
                <div>
                  <div className="flex justify-between"><label htmlFor="bg-dark" className="hud-label">DARK OVERLAY</label><span className="hud-label">{Math.round(settings.overlay * 100)}%</span></div>
                  <input id="bg-dark" type="range" min="0" max="0.9" step="0.05" value={settings.overlay} onChange={(e) => update({ overlay: Number(e.target.value) })} className="w-full accent-cyan-400" />
                </div>

                <div>
                  <label htmlFor="bg-title" className="hud-label block">BROWSER TAB TITLE</label>
                  <input id="bg-title" value={settings.title} onChange={(e) => update({ title: e.target.value })} placeholder="Leave empty for default" className="mt-1 w-full rounded border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-brand-cyan" />
                </div>

                {error ? <p className="text-xs font-semibold text-[#ff2a2a]">{error}</p> : null}

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSettings(DEFAULT_BACKGROUND_SETTINGS)
                      commit(DEFAULT_BACKGROUND_SETTINGS)
                      document.title = 'A Preetham Reddy | AI Engineer: Generative AI, RAG, LangChain'
                      setError(null)
                    }}
                    className="button-secondary flex-1 justify-center"
                  >
                    <RefreshCw className="h-4 w-4" /> Reset
                  </button>
                  <button type="button" onClick={logout} className="button-secondary flex-1 justify-center">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}
