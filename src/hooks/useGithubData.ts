import { useCallback, useEffect, useState } from 'react'

import { getGithubOverview } from '@/services/github'
import type { GithubOverview, GitHubRepo } from '@/types/github'

// Private client project that has no public GitHub repository.
// Injected so it still appears as a project card on the site.
const CLIENT_ONLY_PROJECTS: GitHubRepo[] = [
  {
    id: -1,
    name: 'DataWise AI',
    full_name: 'preethamofficial/DataWise-AI (private)',
    description: 'AI-automated data cleaning, validation, and exploratory analysis on user-uploaded datasets. Client project — code not public.',
    html_url: '',
    homepage: null,
    stargazers_count: 0,
    forks_count: 0,
    language: 'Python',
    topics: ['ai', 'data-cleaning', 'automation', 'full-stack'],
    updated_at: '2026-05-01T00:00:00Z',
    pushed_at: '2026-05-01T00:00:00Z',
    fork: false,
    archived: false,
  },
]

function withClientProjects(overview: GithubOverview | null): GithubOverview | null {
  if (!overview) return null
  const existing = new Set(overview.repos.map((repo) => repo.name.toLowerCase()))
  const missing = CLIENT_ONLY_PROJECTS.filter((repo) => !existing.has(repo.name.toLowerCase()))
  if (!missing.length) return overview
  return { ...overview, repos: [...overview.repos, ...missing] }
}

export function useGithubData(username: string) {
  const [overview, setOverview] = useState<GithubOverview | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getGithubOverview(username)
      setOverview(withClientProjects(data))
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Unable to load GitHub data right now.')
    } finally {
      setIsLoading(false)
    }
  }, [username])

  useEffect(() => {
    void refresh()
  }, [refresh])

  // Auto-sync: re-fetch GitHub data periodically and whenever the tab becomes visible again,
  // so newly created/updated repositories show up without a page rebuild.
  useEffect(() => {
    const REFRESH_INTERVAL_MS = 5 * 60 * 1000

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        void refresh()
      }
    }, REFRESH_INTERVAL_MS)

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void refresh()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [refresh])

  return {
    overview,
    repos: overview?.repos ?? [],
    isLoading,
    error,
    refresh,
  }
}
