export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  topics: string[]
  updated_at: string
  pushed_at: string
  fork: boolean
  archived: boolean
}

export interface GitHubUser {
  login: string
  avatar_url: string
  public_repos: number
  followers: number
  following: number
}

export interface GitHubCommitPayload {
  sha: string
  message: string
  url: string
}

export interface GitHubEvent {
  id: string
  type: string
  created_at: string
  repo: {
    name: string
  }
  payload?: {
    commits?: GitHubCommitPayload[]
  }
}

export interface RecentCommit {
  id: string
  repoName: string
  message: string
  url: string
  date: string
}

export interface GithubOverview {
  user: GitHubUser | null
  repos: GitHubRepo[]
  totalStars: number
  totalForks: number
  totalCommitsThisYear: number
  languageBreakdown: Array<{ name: string; value: number }>
  recentCommits: RecentCommit[]
  lastUpdated: string
}
