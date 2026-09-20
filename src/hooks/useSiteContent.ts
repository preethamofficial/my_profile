import { useEffect, useState } from 'react'

import { fetchPublishedSettings } from '@/services/siteSettings'

export interface SiteContent {
  heroName: string
  heroTitle: string
  heroSummary: string
  heroImage: string | null
  aboutParagraphs: string[]
  stats: Array<{ value: number; suffix: string; label: string }>
  experience: Array<{
    title: string
    company: string
    duration: string
    current: boolean
    highlights: string[]
    tech: string[]
  }>
}

const STORAGE_KEY = 'portfolio-site-content'
const UPDATED_KEY = 'portfolio-site-content-updated-at'

export const EMPTY_SITE_CONTENT: SiteContent = {
  heroName: '',
  heroTitle: '',
  heroSummary: '',
  heroImage: null,
  aboutParagraphs: [],
  stats: [],
  experience: [],
}

export function loadSiteContent(): SiteContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...EMPTY_SITE_CONTENT }
    const parsed = JSON.parse(raw) as Partial<SiteContent>
    return { ...EMPTY_SITE_CONTENT, ...parsed }
  } catch {
    return { ...EMPTY_SITE_CONTENT }
  }
}

export function saveSiteContent(content: SiteContent) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content))
    window.dispatchEvent(new Event('site-content-changed'))
  } catch {
    // storage full — ignore
  }
}

export function clearSiteContent() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new Event('site-content-changed'))
  } catch {
    // ignore
  }
}

/** Timestamp of the last local content edit (0 = never edited on this device). */
export function getContentUpdatedAt(): number {
  const raw = localStorage.getItem(UPDATED_KEY)
  return raw ? Number(raw) || 0 : 0
}

export function setContentUpdatedAt(timestamp: number) {
  try {
    localStorage.setItem(UPDATED_KEY, String(timestamp))
  } catch {
    // ignore
  }
}

export function useSiteContent(): SiteContent {
  const [content, setContent] = useState<SiteContent>({ ...EMPTY_SITE_CONTENT })

  useEffect(() => {
    let cancelled = false

    const merge = async () => {
      const local = loadSiteContent()
      const localChanged = JSON.stringify(local) !== JSON.stringify(EMPTY_SITE_CONTENT)
      const published = await fetchPublishedSettings()
      const merged: SiteContent = { ...EMPTY_SITE_CONTENT, ...(published.content ?? {}), ...(localChanged ? local : {}) }
      if (!cancelled) setContent(merged)
    }

    void merge()

    const onChange = () => void merge()
    window.addEventListener('site-content-changed', onChange)
    window.addEventListener('site-settings-published', onChange)
    window.addEventListener('site-settings-pulled', onChange)
    return () => {
      cancelled = true
      window.removeEventListener('site-content-changed', onChange)
      window.removeEventListener('site-settings-published', onChange)
      window.removeEventListener('site-settings-pulled', onChange)
    }
  }, [])

  return content
}
