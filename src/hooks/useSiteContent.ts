import { useEffect, useState } from 'react'

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

export function useSiteContent(): SiteContent {
  const [content, setContent] = useState(loadSiteContent)

  useEffect(() => {
    const onChange = () => setContent(loadSiteContent())
    window.addEventListener('site-content-changed', onChange)
    return () => window.removeEventListener('site-content-changed', onChange)
  }, [])

  return content
}
