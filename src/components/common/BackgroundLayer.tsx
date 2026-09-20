import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { DEFAULT_BACKGROUND_SETTINGS, loadBackgroundSettings, type BackgroundSettings } from '@/hooks/useBackgroundSettings'

export function BackgroundLayer() {
  const [settings, setSettings] = useState<BackgroundSettings>(DEFAULT_BACKGROUND_SETTINGS)

  useEffect(() => {
    setSettings(loadBackgroundSettings())
    const onStorage = () => setSettings(loadBackgroundSettings())
    window.addEventListener('bg-settings-changed', onStorage)
    return () => window.removeEventListener('bg-settings-changed', onStorage)
  }, [])

  const hasCustom = Boolean(settings.image) || settings.wallpaper !== 'none'
  if (!hasCustom) return null

  return (
    <div className="bg-layer" aria-hidden>
      {settings.image ? (
        <img
          src={settings.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: `brightness(${settings.brightness}) blur(${settings.blur}px)`, transform: 'scale(1.06)' }}
        />
      ) : null}

      {!settings.image && settings.wallpaper !== 'none' ? (
        <div className={`absolute inset-0 wallpaper wallpaper--${settings.wallpaper}`} style={{ filter: `brightness(${settings.brightness})` }} />
      ) : null}

      <div className="absolute inset-0 bg-black" style={{ opacity: settings.overlay }} />
      <motion.div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}
