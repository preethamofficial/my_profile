import {
  loadBackgroundSettings,
  saveBackgroundSettings,
  getBackgroundUpdatedAt,
  setBackgroundUpdatedAt,
  type BackgroundSettings,
} from '@/hooks/useBackgroundSettings'
import { loadSiteContent, saveSiteContent, getContentUpdatedAt, setContentUpdatedAt, type SiteContent } from '@/hooks/useSiteContent'

export interface PublishedSettings {
  /** Epoch ms of the publish that produced this payload — used to resolve local vs cloud. */
  updatedAt?: number
  background?: BackgroundSettings
  content?: SiteContent
}

const REPO = 'preethamofficial/my_profile'
const BRANCH = 'main'
const SETTINGS_PATH = 'public/site-settings.json'
const TOKEN_KEY = 'bg-editor-token'

/** Read straight from the branch so other devices sync instantly (no Pages deploy wait). */
const RAW_URL = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${SETTINGS_PATH}`
const PAGES_URL = `${import.meta.env.BASE_URL}site-settings.json`
const POLL_MS = 45_000

let cache: PublishedSettings | null = null
let cacheAt = 0
let inflight: Promise<PublishedSettings> | null = null
let started = false

export function getSyncToken(): string {
  return localStorage.getItem(TOKEN_KEY) ?? ''
}

export function setSyncToken(token: string) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

/** Bucket the cache-buster so polls bypass CDN caches without hammering GitHub. */
function cacheBuster(): number {
  return Math.floor(Date.now() / 15_000)
}

async function readSettings(url: string): Promise<PublishedSettings | null> {
  try {
    const response = await fetch(`${url}?sync=${cacheBuster()}`, { cache: 'no-store' })
    if (!response.ok) return null
    return (await response.json()) as PublishedSettings
  } catch {
    return null
  }
}

export async function fetchPublishedSettings(force = false): Promise<PublishedSettings> {
  if (!force && cache && Date.now() - cacheAt < POLL_MS) return cache
  if (inflight) return inflight

  inflight = (async () => {
    const next = (await readSettings(RAW_URL)) ?? (await readSettings(PAGES_URL))
    if (next) {
      cache = next
      cacheAt = Date.now()
    }
    inflight = null
    return cache ?? {}
  })()

  return inflight
}

/**
 * Pull cloud settings onto this device when the cloud copy is newer than the
 * local copy. This is what makes "edit on phone → PC updates by itself" work.
 */
export async function applyPublishedSettings(force = false): Promise<boolean> {
  const published = await fetchPublishedSettings(force)
  const remoteAt = published.updatedAt ?? 0
  if (!remoteAt || (!published.background && !published.content)) return false

  const localAt = Math.max(getBackgroundUpdatedAt(), getContentUpdatedAt())
  if (!force && remoteAt <= localAt) return false

  if (published.background) {
    saveBackgroundSettings(published.background)
    setBackgroundUpdatedAt(remoteAt)
    window.dispatchEvent(new Event('bg-settings-changed'))
  }
  if (published.content) {
    saveSiteContent(published.content)
    setContentUpdatedAt(remoteAt)
    window.dispatchEvent(new Event('site-content-changed'))
    if (published.content.heroName) {
      // keep document title in step with pulled content
      const background = published.background ?? loadBackgroundSettings()
      if (!background.title) document.title = `${published.content.heroName} | AI Engineer: Generative AI, RAG, LangChain`
    }
  }

  window.dispatchEvent(new Event('site-settings-pulled'))
  return true
}

/** Poll the cloud so an open tab picks up edits made on another device. */
export function startSettingsSync() {
  if (started || typeof window === 'undefined') return
  started = true

  void applyPublishedSettings()

  window.setInterval(() => {
    if (!document.hidden) void applyPublishedSettings()
  }, POLL_MS)

  window.addEventListener('focus', () => void applyPublishedSettings())
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) void applyPublishedSettings()
  })
  window.addEventListener('online', () => void applyPublishedSettings())
}

function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary)
}

export async function publishSiteSettings(): Promise<{ ok: boolean; message: string }> {
  const token = getSyncToken()
  if (!token) return { ok: false, message: 'No GitHub token saved. Paste one in the CLOUD SYNC box first.' }

  const payload: PublishedSettings = {
    updatedAt: Date.now(),
    background: loadBackgroundSettings(),
    content: loadSiteContent(),
  }
  const body = `${JSON.stringify(payload, null, 2)}\n`
  if (body.length > 900_000) {
    return { ok: false, message: 'Payload too large (GitHub caps this at ~1 MB). Replace the custom image with a smaller one.' }
  }
  const encoded = encodeBase64(body)

  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
  const apiUrl = `https://api.github.com/repos/${REPO}/contents/${SETTINGS_PATH}`

  try {
    // The snapshot bot also commits to this branch, so retry once on a SHA conflict.
    for (let attempt = 0; attempt < 2; attempt += 1) {
      let sha: string | undefined
      const existing = await fetch(`${apiUrl}?ref=${BRANCH}`, { headers })
      if (existing.ok) {
        sha = ((await existing.json()) as { sha?: string }).sha
      }

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          message: 'Update live site settings (background + content)',
          content: encoded,
          branch: BRANCH,
          ...(sha ? { sha } : {}),
        }),
      })

      if (response.ok) {
        // Adopt the published timestamp locally so this device stops looking "newer".
        setBackgroundUpdatedAt(payload.updatedAt ?? Date.now())
        setContentUpdatedAt(payload.updatedAt ?? Date.now())
        cache = payload
        cacheAt = Date.now()
        return { ok: true, message: 'Live! Open tabs pick this up within ~1 min.' }
      }

      const conflicting = response.status === 409 || response.status === 422
      if (!conflicting || attempt === 1) {
        if (response.status === 401) return { ok: false, message: 'Token rejected — check it has Contents: read+write.' }
        if (response.status === 404) return { ok: false, message: 'Token lacks access to this repository.' }
        return { ok: false, message: `GitHub API error ${response.status}.` }
      }
    }

    return { ok: false, message: 'Publish failed after retry.' }
  } catch {
    return { ok: false, message: 'Network error while publishing.' }
  }
}

