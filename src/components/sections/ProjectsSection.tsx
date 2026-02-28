import { useMemo, useState } from 'react'
import type { MouseEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Code2, ExternalLink, GitFork, Sparkles, Star } from 'lucide-react'

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

interface ProjectCardProps {
  repo: GitHubRepo
  index: number
}

function getDemoUrl(repo: GitHubRepo): string | null {
  if (repo.homepage && repo.homepage.trim()) {
    return repo.homepage
  }

  return null
}

function ProjectCard({ repo, index }: ProjectCardProps) {
  const projectCategory = categorizeProject(repo)
  const isFeatured = featuredProjectNames.includes(repo.name)
  const demoUrl = getDemoUrl(repo)
  const techTags = [repo.language ?? 'Unknown', ...(repo.topics ?? []).slice(0, 3)].filter(Boolean)

  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [9, -9]), { stiffness: 200, damping: 18 })
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-9, 9]), { stiffness: 200, damping: 18 })
  const scale = useSpring(1, { stiffness: 180, damping: 16 })

  const handlePointerMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const normalizedX = (event.clientX - rect.left) / rect.width - 0.5
    const normalizedY = (event.clientY - rect.top) / rect.height - 0.5
    pointerX.set(normalizedX)
    pointerY.set(normalizedY)
    scale.set(1.02)
  }

  const handlePointerLeave = () => {
    pointerX.set(0)
    pointerY.set(0)
    scale.set(1)
  }

  return (
    <Reveal delay={Math.min(index * 0.03, 0.25)} className="h-full">
      <motion.article
        onMouseMove={handlePointerMove}
        onMouseLeave={handlePointerLeave}
        style={{ rotateX, rotateY, scale, transformStyle: 'preserve-3d' }}
        className={`ai-border-card glass-card-strong group relative h-full overflow-hidden rounded-2xl p-5 ${
          isFeatured ? 'ring-1 ring-brand-cyan/45' : ''
        }`}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-cyan/0 via-brand-purple/0 to-brand-blue/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        <div className="relative z-10">
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
            {techTags.map((tag, tagIndex) => (
              <span
                key={`${repo.id}-${tag}-${tagIndex}`}
                className={`rounded-full px-2 py-1 text-xs font-semibold ${
                  tagIndex === 0
                    ? 'text-slate-50'
                    : 'border border-white/20 bg-white/10 text-[var(--text-secondary)]'
                }`}
                style={tagIndex === 0 ? { backgroundColor: getLanguageColor(repo.language) } : undefined}
              >
                {tag}
              </span>
            ))}
            <span className="rounded-full border border-white/20 bg-white/10 px-2 py-1 text-xs font-semibold text-[var(--text-secondary)]">
              Updated {new Date(repo.updated_at).toLocaleDateString()}
            </span>
          </div>

          <div className="mt-5 flex items-center gap-4 text-xs text-[var(--text-secondary)]">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1">
              <Star className="h-4 w-4" aria-hidden />
              {repo.stargazers_count}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1">
              <GitFork className="h-4 w-4" aria-hidden />
              {repo.forks_count}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="focusable inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-[var(--text-primary)] transition hover:-translate-y-0.5 hover:border-brand-cyan hover:text-brand-cyan"
            >
              <Code2 className="h-4 w-4" />
              View Code
            </a>
            {demoUrl ? (
              <a
                href={demoUrl}
                target="_blank"
                rel="noreferrer"
                className="focusable inline-flex min-h-[44px] items-center gap-2 rounded-full border border-brand-purple/40 bg-brand-purple/15 px-4 py-2 text-xs font-semibold text-brand-purple transition hover:-translate-y-0.5 hover:bg-brand-purple/25"
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
        </div>
      </motion.article>
    </Reveal>
  )
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
        title="Live Engineering Repository Feed"
        description="Production-oriented repositories with adaptive UI cards, interaction depth, and direct code access."
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
          <>
            {!filteredProjects.length ? (
              <div className="glass-card rounded-2xl p-6 text-sm text-[var(--text-secondary)]">
                No repositories found for this filter right now.
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((repo, index) => (
                <ProjectCard key={repo.id} repo={repo} index={index} />
              ))}
            </div>

            <Reveal className="mt-6 rounded-2xl border border-white/15 bg-white/5 px-4 py-3">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
                <Sparkles className="h-4 w-4 text-brand-cyan" />
                Hover cards to inspect interaction depth and architecture tags.
              </p>
            </Reveal>
          </>
        ) : null}
      </div>
    </section>
  )
}
