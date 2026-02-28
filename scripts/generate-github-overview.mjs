import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const GITHUB_API = 'https://api.github.com'
const username = process.env.GITHUB_USERNAME || 'preethamofficial'
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || ''

const fallbackRepoSeed = [
  {
    name: 'skin-disease-detection-build-by-using-ml',
    description: 'Machine learning project for skin disease detection using Python-based classification workflows.',
    language: 'Python',
    topics: ['ai', 'ml', 'healthcare', 'classification'],
  },
  {
    name: 'inventory-managment',
    description: 'Inventory management application developed during internship with practical Python automation.',
    language: 'Python',
    topics: ['python', 'inventory', 'automation'],
  },
  {
    name: 'python-game',
    description: 'Game development mini-project built with Python fundamentals and interactive logic.',
    language: 'Python',
    topics: ['python', 'game', 'project'],
  },
  {
    name: 'vaultofcode-python-internship-',
    description: 'Internship repository containing Python scripts, mini-projects, and learning outcomes.',
    language: 'Python',
    topics: ['python', 'internship', 'projects'],
  },
  {
    name: 'preethamofficial',
    description: 'Profile repository and developer overview with portfolio and activity context.',
    language: 'Markdown',
    topics: ['profile', 'readme'],
  },
]

function normalizeLanguage(language) {
  if (!language) return 'Unknown'
  return language
}

function buildLanguageBreakdown(repos) {
  const counts = repos.reduce((accumulator, repo) => {
    const key = normalizeLanguage(repo.language)
    accumulator[key] = (accumulator[key] ?? 0) + 1
    return accumulator
  }, {})

  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)
}

function extractCommitStats(events) {
  const currentYear = new Date().getFullYear()
  let totalCommitsThisYear = 0
  const recentCommits = []

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

function getLatestRepoUpdate(repos) {
  if (!repos.length) {
    return new Date().toISOString()
  }

  return repos.reduce((latest, repo) => (repo.updated_at > latest ? repo.updated_at : latest), repos[0].updated_at)
}

function buildFallbackRepos() {
  const now = Date.now()

  return fallbackRepoSeed.map((repo, index) => {
    const timestamp = new Date(now - index * 1000 * 60 * 60 * 24).toISOString()
    return {
      id: 900000 + index,
      name: repo.name,
      full_name: `${username}/${repo.name}`,
      description: repo.description,
      html_url: `https://github.com/${username}/${repo.name}`,
      homepage: null,
      stargazers_count: 0,
      forks_count: 0,
      language: repo.language,
      topics: [...repo.topics],
      updated_at: timestamp,
      pushed_at: timestamp,
      fork: false,
      archived: false,
    }
  })
}

function buildFallbackOverview() {
  const fallbackRepos = buildFallbackRepos()
  const totalStars = fallbackRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0)
  const totalForks = fallbackRepos.reduce((sum, repo) => sum + repo.forks_count, 0)

  return {
    user: {
      login: username,
      avatar_url: `https://avatars.githubusercontent.com/${username}`,
      public_repos: fallbackRepos.length,
      followers: 0,
      following: 0,
    },
    repos: fallbackRepos,
    totalStars,
    totalForks,
    totalCommitsThisYear: 0,
    languageBreakdown: buildLanguageBreakdown(fallbackRepos),
    recentCommits: [],
    lastUpdated: getLatestRepoUpdate(fallbackRepos),
  }
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'portfolio-snapshot-generator',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

async function generateOverview() {
  const [user, repos, events] = await Promise.all([
    fetchJson(`${GITHUB_API}/users/${username}`),
    fetchJson(`${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated&type=owner`),
    fetchJson(`${GITHUB_API}/users/${username}/events/public?per_page=100`),
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

async function main() {
  let overview
  try {
    overview = await generateOverview()
    console.log(`Generated GitHub overview for ${username} with ${overview.repos.length} repos.`)
  } catch (error) {
    console.warn('Failed to generate live GitHub overview, using fallback snapshot.', error)
    overview = buildFallbackOverview()
  }

  const outputPath = path.resolve(process.cwd(), 'public', 'github-overview.json')
  await mkdir(path.dirname(outputPath), { recursive: true })
  await writeFile(outputPath, `${JSON.stringify(overview, null, 2)}\n`, 'utf8')
  console.log(`Snapshot written to ${outputPath}`)
}

void main()

