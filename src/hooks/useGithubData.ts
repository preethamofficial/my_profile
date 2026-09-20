import { useCallback, useEffect, useState } from 'react'

import { getGithubOverview } from '@/services/github'
import type { GithubOverview } from '@/types/github'

export function useGithubData(username: string) {
  const [overview, setOverview] = useState<GithubOverview | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getGithubOverview(username)
      setOverview(data)
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
