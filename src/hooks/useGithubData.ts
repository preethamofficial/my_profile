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

  return {
    overview,
    repos: overview?.repos ?? [],
    isLoading,
    error,
    refresh,
  }
}
