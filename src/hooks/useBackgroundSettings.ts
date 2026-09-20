export interface BackgroundSettings {
  image: string | null
  brightness: number
  blur: number
  overlay: number
  wallpaper: 'none' | 'aurora' | 'waves' | 'stars'
  title: string
}

const STORAGE_KEY = 'portfolio-bg-settings'
const UPDATED_KEY = 'portfolio-bg-updated-at'

export const DEFAULT_BACKGROUND_SETTINGS: BackgroundSettings = {
  image: null,
  brightness: 1,
  blur: 0,
  overlay: 0.45,
  wallpaper: 'none',
  title: '',
}

export function loadBackgroundSettings(): BackgroundSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_BACKGROUND_SETTINGS }
    return { ...DEFAULT_BACKGROUND_SETTINGS, ...(JSON.parse(raw) as Partial<BackgroundSettings>) }
  } catch {
    return { ...DEFAULT_BACKGROUND_SETTINGS }
  }
}

export function saveBackgroundSettings(settings: BackgroundSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // storage full (large image) — ignore
  }
}

/** Timestamp of the last local background edit (0 = never edited on this device). */
export function getBackgroundUpdatedAt(): number {
  const raw = localStorage.getItem(UPDATED_KEY)
  return raw ? Number(raw) || 0 : 0
}

export function setBackgroundUpdatedAt(timestamp: number) {
  try {
    localStorage.setItem(UPDATED_KEY, String(timestamp))
  } catch {
    // ignore
  }
}
