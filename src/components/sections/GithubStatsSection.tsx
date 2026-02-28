import { Activity, GitBranchPlus, GitCommitVertical, Star, Users } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

import { Reveal } from '@/components/common/Reveal'
import type { GithubOverview } from '@/types/github'

interface GithubStatsSectionProps {
  overview: GithubOverview | null
  isLoading: boolean
  error: string | null
  username: string
}

const chartColors = ['#06b6d4', '#a855f7', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444']

const defaultLanguageBreakdown = [
  { name: 'No Data', value: 1 },
]

export function GithubStatsSection({ overview, isLoading, error, username }: GithubStatsSectionProps) {
  const reposCount = overview?.user?.public_repos ?? overview?.repos.length ?? 0
  const stars = overview?.totalStars ?? 0
  const commits = overview?.totalCommitsThisYear ?? 0
  const followers = overview?.user?.followers ?? 0
  const following = overview?.user?.following ?? 0
  const languageData = overview?.languageBreakdown.length ? overview.languageBreakdown : defaultLanguageBreakdown

  return (
    <section id="github" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      {error ? (
        <p className="glass-card rounded-xl px-4 py-3 text-sm text-rose-300">GitHub data load issue: {error}</p>
      ) : null}

      <Reveal className="glass-card overflow-hidden rounded-2xl p-4 sm:p-6">
        <h3 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">Contribution Graph</h3>
        <img
          src={`https://ghchart.rshah.org/06b6d4/${username}`}
          alt={`${username} GitHub contribution graph`}
          loading="lazy"
          className="w-full rounded-xl border border-white/10"
        />
      </Reveal>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Repositories', value: reposCount, icon: <GitBranchPlus className="h-5 w-5" /> },
          { label: 'Total Stars', value: stars, icon: <Star className="h-5 w-5" /> },
          { label: 'Total Commits (This Year)', value: commits, icon: <GitCommitVertical className="h-5 w-5" /> },
          { label: 'Followers / Following', value: `${followers} / ${following}`, icon: <Users className="h-5 w-5" /> },
        ].map((item) => (
          <Reveal key={item.label} className="glass-card rounded-2xl p-5">
            <div className="inline-flex rounded-xl border border-white/10 bg-white/10 p-2 text-brand-cyan">{item.icon}</div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)]">{item.label}</p>
            <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">{isLoading ? '...' : item.value}</p>
          </Reveal>
        ))}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <Reveal className="glass-card rounded-2xl p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Most Used Languages</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languageData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                  stroke="transparent"
                >
                  {languageData.map((entry, index) => (
                    <Cell key={`language-${entry.name}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: '0.65rem',
                    color: '#f8fafc',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Reveal>

        <Reveal className="glass-card rounded-2xl p-5 sm:p-6">
          <h3 className="inline-flex items-center gap-2 text-lg font-semibold text-[var(--text-primary)]">
            <Activity className="h-5 w-5 text-brand-cyan" />
            Recent Activity
          </h3>
          <div className="mt-4 space-y-3">
            {isLoading ? (
              <p className="text-sm text-[var(--text-secondary)]">Loading activity...</p>
            ) : overview?.recentCommits.length ? (
              overview.recentCommits.map((commit) => (
                <a
                  key={commit.id}
                  href={commit.url}
                  target="_blank"
                  rel="noreferrer"
                  className="focusable block rounded-xl border border-white/10 bg-white/5 p-3 text-sm transition hover:border-brand-cyan hover:bg-brand-cyan/5"
                >
                  <p className="line-clamp-1 font-medium text-[var(--text-primary)]">{commit.message}</p>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    {commit.repoName} • {new Date(commit.date).toLocaleDateString()}
                  </p>
                </a>
              ))
            ) : (
              <p className="text-sm text-[var(--text-secondary)]">No recent commit activity available.</p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
