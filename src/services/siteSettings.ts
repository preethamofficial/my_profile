import { loadBackgroundSettings, type BackgroundSettings } from '@/hooks/useBackgroundSettings'
import { loadSiteContent, type SiteContent } from '@/hooks/useSiteContent'

export interface PublishedSettings {
  background?: BackgroundSettings
  content?: SiteContent
}

const REPO = 'preethamofficial/my_profile'
const SETTINGS_PATH = 'public/site-settings.json'
const TOKEN_KEY = 'bg-editor-token'

let cache: PublishedSettings | null = null

export function getSyncToken(): string {
  return localStorage.getItem(TOKEN_KEY) ?? ''
}

export function setSyncToken(token: string) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export async function fetchPublishedSettings(): Promise<PublishedSettings> {
  if (cache) return cache
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}site-settings.json`, { cache: 'no-store' })
    if (response.ok) {
      cache = (await response.json()) as PublishedSettings
    }
  } catch {
    // not published yet
  }
  return cache ?? {}
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
  if (!token) return { ok: false, message: 'No GitHub token saved. Add one in SYNC settings.' }

  const payload = {
    background: loadBackgroundSettings(),
    content: loadSiteContent(),
  }
  const body = `${JSON.stringify(payload, null, 2)}\n`

  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
  const apiUrl = `https://api.github.com/repos/${REPO}/contents/${SETTINGS_PATH}`

  try {
    let sha: string | undefined
    const existing = await fetch(apiUrl, { headers })
    if (existing.ok) {
      sha = ((await existing.json()) as { sha?: string }).sha
    }

    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: 'Update live site settings (background + content)',
        content: encodeBase64(body),
        ...(sha ? { sha } : {}),
      }),
    })

    if (!response.ok) {
      const detail = response.status === 401 ? 'Invalid or expired token.' : `GitHub API error ${response.status}.`
      return { ok: false, message: detail }
    }

    cache = payload
    return { ok: true, message: 'Published! All devices see it after the auto-deploy (~2 min).' }
  } catch {
    return { ok: false, message: 'Network error while publishing.' }
  }
}
