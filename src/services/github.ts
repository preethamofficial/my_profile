import type { GitHubEvent, GitHubRepo, GitHubUser, GithubOverview, RecentCommit } from '@/types/github'

const GITHUB_API = 'https://api.github.com'

const languageColors: Record<string, string> = {
  Python: '#3776AB',
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  HTML: '#E34F26',
  CSS: '#1572B6',
  Jupyter: '#F37626',
  'Jupyter Notebook': '#F37626',
  Shell: '#89E051',
  SQL: '#336791',
  PHP: '#777BB4',
}

const projectKeywords = {
  aiMl: ['ai', 'ml', 'llm', 'rag', 'transformer', 'prompt', 'neural', 'model', 'disease'],
  web: ['web', 'react', 'frontend', 'backend', 'api', 'vite', 'site'],
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}`)
  }

  return (await response.json()) as T
}

function normalizeLanguage(language: string | null): string {
  if (!language) return 'Unknown'
  return language
}

function buildLanguageBreakdown(repos: GitHubRepo[]) {
  const counts = repos.reduce<Record<string, number>>((accumulator, repo) => {
    const key = normalizeLanguage(repo.language)
    accumulator[key] = (accumulator[key] ?? 0) + 1
    return accumulator
  }, {})

  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)
}

function extractCommitStats(events: GitHubEvent[]) {
  const currentYear = new Date().getFullYear()
  let totalCommitsThisYear = 0
  const recentCommits: RecentCommit[] = []

  for (const event of events) {
    if (event.type !== 'PushEvent') {
      continue
    }

    const commits = event.payload?.commits ?? []
    const eventYear = new Date(event.created_at).getFullYear()
    if (eventYear === currentYear) {
      totalCommitsThisYear += commits.length
    }

    for (const commit of commits) {
      if (recentCommits.length >= 5) {
        break
      }

      recentCommits.push({
        id: `${event.id}-${commit.sha}`,
        repoName: event.repo.name,
        message: commit.message.split('\n')[0],
        url: `https://github.com/${event.repo.name}/commit/${commit.sha}`,
        date: event.created_at,
      })
    }
  }

  return { totalCommitsThisYear, recentCommits }
}

function getLatestRepoUpdate(repos: GitHubRepo[]): string {
  if (!repos.length) {
    return new Date().toISOString()
  }

  return repos.reduce((latest, repo) => (repo.updated_at > latest ? repo.updated_at : latest), repos[0].updated_at)
}

export async function getGithubOverview(username: string): Promise<GithubOverview> {
  const [user, repos, events] = await Promise.all([
    fetchJson<GitHubUser>(`${GITHUB_API}/users/${username}`),
    fetchJson<GitHubRepo[]>(`${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated&type=owner`),
    fetchJson<GitHubEvent[]>(`${GITHUB_API}/users/${username}/events/public?per_page=100`),
  ])

  const publicRepos = repos.filter((repo) => !repo.archived)
  const totalStars = publicRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0)
  const totalForks = publicRepos.reduce((sum, repo) => sum + repo.forks_count, 0)
  const languageBreakdown = buildLanguageBreakdown(publicRepos)
  const { totalCommitsThisYear, recentCommits } = extractCommitStats(events)
  const lastUpdated = getLatestRepoUpdate(publicRepos)

  return {
    user,
    repos: publicRepos,
    totalStars,
    totalForks,
    totalCommitsThisYear,
    languageBreakdown,
    recentCommits,
    lastUpdated,
  }
}

export function categorizeProject(repo: GitHubRepo): 'AI/ML' | 'Python' | 'Web' | 'Tools' {
  const searchText = `${repo.name} ${repo.description ?? ''} ${(repo.topics ?? []).join(' ')}`.toLowerCase()

  if (projectKeywords.aiMl.some((keyword) => searchText.includes(keyword))) {
    return 'AI/ML'
  }

  if (normalizeLanguage(repo.language).toLowerCase() === 'python') {
    return 'Python'
  }

  if (
    projectKeywords.web.some((keyword) => searchText.includes(keyword)) ||
    ['javascript', 'typescript', 'html', 'css'].includes(normalizeLanguage(repo.language).toLowerCase())
  ) {
    return 'Web'
  }

  return 'Tools'
}

export function getLanguageColor(language: string | null): string {
  if (!language) return '#64748B'
  return languageColors[language] ?? '#64748B'
}
