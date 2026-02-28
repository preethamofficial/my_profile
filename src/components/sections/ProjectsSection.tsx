import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, GitFork, Star, Code2 } from 'lucide-react'

import { Reveal } from '@/components/common/Reveal'
import { SectionHeading } from '@/components/common/SectionHeading'
import { SkeletonCards } from '@/components/common/SkeletonCards'
import { featuredProjectNames, projectFilters } from '@/data/portfolio'
import { categorizeProject, getLanguageColor } from '@/services/github'
import type { GitHubRepo } from '@/types/github'

interface ProjectsSectionProps {
  repos: GitHubRepo[]
  isLoading: boolean
  error: string | null
}

function getDemoUrl(repo: GitHubRepo): string | null {
  if (repo.homepage && repo.homepage.trim()) {
    return repo.homepage
  }

  return null
}

export function ProjectsSection({ repos, isLoading, error }: ProjectsSectionProps) {
  const [activeFilter, setActiveFilter] = useState('All')

  const projects = useMemo(() => {
    const ownedRepos = repos.filter((repo) => !repo.fork)

    return ownedRepos
      .slice()
      .sort((a, b) => {
        const aIsFeatured = featuredProjectNames.includes(a.name)
        const bIsFeatured = featuredProjectNames.includes(b.name)
        if (aIsFeatured && !bIsFeatured) return -1
        if (!aIsFeatured && bIsFeatured) return 1
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      })
  }, [repos])

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') {
      return projects
    }

    return projects.filter((repo) => categorizeProject(repo) === activeFilter)
  }, [activeFilter, projects])

  return (
    <section id="projects" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Projects"
        title="Project Gallery from GitHub"
        description="Repositories are fetched automatically from GitHub and grouped by practical categories."
      />

      <Reveal className="mt-8 flex flex-wrap gap-2">
        {projectFilters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`focusable min-h-[44px] rounded-full border px-4 py-2 text-sm font-semibold transition ${
              activeFilter === filter
                ? 'border-brand-cyan bg-brand-cyan/15 text-brand-cyan'
                : 'border-white/20 bg-white/5 text-[var(--text-secondary)] hover:border-brand-purple hover:text-brand-purple'
            }`}
          >
            {filter}
          </button>
        ))}
      </Reveal>

      <div className="mt-8">
        {isLoading ? <SkeletonCards count={6} /> : null}
        {!isLoading && error ? (
          <p className="glass-card rounded-xl px-4 py-3 text-sm text-rose-300">
            Unable to load repositories right now. {error}
          </p>
        ) : null}
        {!isLoading && !error ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((repo, index) => {
              const projectCategory = categorizeProject(repo)
              const isFeatured = featuredProjectNames.includes(repo.name)
              const demoUrl = getDemoUrl(repo)

              return (
                <Reveal key={repo.id} delay={Math.min(index * 0.03, 0.3)}>
                  <motion.article
                    whileHover={{ y: -8, scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    className={`glass-card group h-full rounded-2xl p-5 ${isFeatured ? 'ring-1 ring-brand-cyan/50' : ''}`}
                  >
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      {isFeatured ? (
                        <span className="rounded-full border border-brand-cyan/40 bg-brand-cyan/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-brand-cyan">
                          Featured
                        </span>
                      ) : null}
                      <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--text-secondary)]">
                        {projectCategory}
                      </span>
                    </div>

                    <h3 className="line-clamp-2 text-lg font-semibold text-[var(--text-primary)]">{repo.name}</h3>
                    <p className="mt-3 line-clamp-3 text-sm text-[var(--text-secondary)]">
                      {repo.description || 'No description provided in repository.'}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="rounded-full px-2 py-1 text-xs font-semibold text-slate-50" style={{ backgroundColor: getLanguageColor(repo.language) }}>
                        {repo.language ?? 'Unknown'}
                      </span>
                      <span className="rounded-full border border-white/20 bg-white/10 px-2 py-1 text-xs font-semibold text-[var(--text-secondary)]">
                        Updated {new Date(repo.updated_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="mt-5 flex items-center gap-4 text-xs text-[var(--text-secondary)]">
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-4 w-4" aria-hidden />
                        {repo.stargazers_count}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <GitFork className="h-4 w-4" aria-hidden />
                        {repo.forks_count}
                      </span>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="focusable inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-[var(--text-primary)] transition hover:border-brand-cyan hover:text-brand-cyan"
                      >
                        <Code2 className="h-4 w-4" />
                        View Code
                      </a>
                      {demoUrl ? (
                        <a
                          href={demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="focusable inline-flex min-h-[44px] items-center gap-2 rounded-full border border-brand-purple/40 bg-brand-purple/15 px-4 py-2 text-xs font-semibold text-brand-purple transition hover:bg-brand-purple/25"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Live Demo
                        </a>
                      ) : (
                        <span className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-[var(--text-secondary)]">
                          <ExternalLink className="h-4 w-4" />
                          Demo N/A
                        </span>
                      )}
                    </div>
                  </motion.article>
                </Reveal>
              )
            })}
          </div>
        ) : null}
      </div>
    </section>
  )
}
