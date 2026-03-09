import { useEffect, useMemo, useState } from 'react'
import { motion, useMotionTemplate, useReducedMotion, useScroll, useSpring, useTransform, type Variants } from 'framer-motion'
import {
  Activity,
  ArrowUpRight,
  BrainCircuit,
  BriefcaseBusiness,
  ChevronsDown,
  Code2,
  Download,
  FileCode2,
  FolderGit2,
  GitCommitHorizontal,
  Github,
  Globe,
  Layers3,
  Linkedin,
  Mail,
  MapPin,
  MoveRight,
  Server,
  ShieldCheck,
  Sparkles,
  Star,
  type LucideIcon,
} from 'lucide-react'

import { AmbientBackground } from '@/components/cinematic/AmbientBackground'
import { CinematicCursor } from '@/components/cinematic/CinematicCursor'
import { FloatingNav } from '@/components/cinematic/FloatingNav'
import { SectionHeader } from '@/components/cinematic/SectionHeader'
import {
  cinematicSkills,
  cinematicStats,
  experience,
  featuredProjectNames,
  heroHighlights,
  navItems,
  profile,
  projectShowcase,
  skillRings,
} from '@/data/portfolio'
import { useGithubData } from '@/hooks/useGithubData'
import { categorizeProject, getLanguageColor } from '@/services/github'
import type { GitHubRepo } from '@/types/github'
import { downloadResumePdf } from '@/utils/resume'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}

const skillIconMap: Record<(typeof cinematicSkills)[number]['name'], LucideIcon> = {
  Python: Code2,
  AI: BrainCircuit,
  'Machine Learning': Activity,
  Cybersecurity: ShieldCheck,
  'Web Development': Globe,
  Django: Server,
  JavaScript: FileCode2,
}

const ringAccents = ['#ff2a2a', '#ffffff', '#ff7878'] as const

function scrollToSection(target: string) {
  document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function formatMonthYear(dateValue: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(dateValue))
}

function getProjectMeta(repo: GitHubRepo) {
  const knownProject = projectShowcase[repo.name as keyof typeof projectShowcase]

  if (knownProject) {
    return knownProject
  }

  return {
    title: repo.name.replace(/-/g, ' '),
    eyebrow: categorizeProject(repo),
    synopsis: repo.description ?? 'A practical build focused on clean execution and iterative learning.',
    accent: 'from-[#321010] via-[#171212] to-[#0f0f0f]',
    preview: 'Featured Build',
    liveUrl: repo.homepage,
  }
}

function SkillBar({ skill, index }: { skill: (typeof cinematicSkills)[number]; index: number }) {
  const Icon = skillIconMap[skill.name]

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="glass-panel rounded-[28px] p-5"
    >
      <div className="flex items-start gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-[#ff2a2a]">
          <Icon className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="font-heading text-lg font-semibold text-white">{skill.name}</h3>
            <span className="text-xs uppercase tracking-[0.22em] text-white/38">{skill.value}%</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-white/58">{skill.detail}</p>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.07]">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, delay: 0.1 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: '0% 50%' }}
              className="h-full rounded-full bg-gradient-to-r from-[#ff2a2a] via-[#ff6b6b] to-white"
            >
              <div className="h-full w-full bg-[radial-gradient(circle_at_right,rgba(255,255,255,0.7),transparent_35%)]" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function SkillRing({ ring, index }: { ring: (typeof skillRings)[number]; index: number }) {
  const accent = ringAccents[index % ringAccents.length]

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="glass-panel flex items-center gap-5 rounded-[28px] p-5"
    >
      <div
        className="grid h-24 w-24 shrink-0 place-items-center rounded-full p-[1px]"
        style={{ background: `conic-gradient(${accent} ${ring.value * 3.6}deg, rgba(255,255,255,0.08) 0deg)` }}
      >
        <div className="grid h-full w-full place-items-center rounded-full bg-[#111111] text-center">
          <span className="font-heading text-xl font-bold text-white">{ring.value}%</span>
        </div>
      </div>
      <div>
        <h3 className="font-heading text-lg font-semibold text-white">{ring.label}</h3>
        <p className="mt-2 text-sm leading-6 text-white/58">{ring.caption}</p>
      </div>
    </motion.div>
  )
}

function ProjectCard({ repo, index }: { repo: GitHubRepo; index: number }) {
  const meta = getProjectMeta(repo)
  const category = categorizeProject(repo)
  const tagList = Array.from(new Set([repo.language ?? 'Stack', ...repo.topics])).filter(Boolean).slice(0, 4)

  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -10 }}
      className="group overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] shadow-[0_28px_70px_-40px_rgba(0,0,0,0.9)]"
    >
      <div className={`relative h-64 overflow-hidden bg-gradient-to-br ${meta.accent} p-6`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(255,42,42,0.18),transparent_35%)] opacity-80 transition duration-500 group-hover:scale-105" />
        <div className="absolute -right-12 top-8 h-40 w-40 rounded-full border border-white/10" />
        <div className="absolute left-6 top-6 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/72">
          {meta.eyebrow}
        </div>
        <div className="relative flex h-full flex-col justify-end">
          <p className="text-xs uppercase tracking-[0.35em] text-white/42">Preview</p>
          <div className="mt-3 flex items-end justify-between gap-4">
            <div>
              <h3 className="font-heading text-3xl font-bold tracking-[-0.05em] text-white sm:text-4xl">{meta.preview}</h3>
              <p className="mt-2 text-sm text-white/58">{formatMonthYear(repo.updated_at)}</p>
            </div>
            <span
              className="rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ borderColor: `${getLanguageColor(repo.language)}55`, color: getLanguageColor(repo.language) }}
            >
              {repo.language ?? category}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-heading text-2xl font-semibold tracking-[-0.04em] text-white">{meta.title}</h3>
            <p className="mt-4 text-sm leading-7 text-white/60">{meta.synopsis}</p>
          </div>
          <span className="hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/48 sm:inline-flex">
            {category}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {tagList.map((tag) => (
            <span key={tag} className="glass-chip rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a href={repo.html_url} target="_blank" rel="noreferrer" className="button-secondary" data-cursor="interactive">
            GitHub
            <Github className="h-4 w-4" />
          </a>
          {meta.liveUrl ? (
            <a href={meta.liveUrl} target="_blank" rel="noreferrer" className="button-primary" data-cursor="interactive">
              Live Demo
              <ArrowUpRight className="h-4 w-4" />
            </a>
          ) : (
            <span className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white/35">
              Preview Soon
            </span>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export default function PortfolioPage() {
  const { overview, repos } = useGithubData(profile.githubUsername)
  const { scrollY, scrollYProgress } = useScroll()
  const shouldReduceMotion = useReducedMotion()
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 })
  const heroTextOffsetY = useTransform(scrollY, [0, 1600], [0, 1120])
  const heroTextY = useSpring(heroTextOffsetY, { stiffness: 52, damping: 22, mass: 0.9 })
  const heroTextOffsetX = useTransform(scrollY, [0, 1600], [0, 24])
  const heroTextX = useSpring(heroTextOffsetX, { stiffness: 58, damping: 24, mass: 0.88 })
  const heroTextBlur = useTransform(scrollY, [0, 320, 1400], [0, 1.2, 3.5])
  const heroTextOpacity = useTransform(scrollY, [0, 240, 1300], [0.045, 0.07, 0.02])
  const heroTextFilter = useMotionTemplate`blur(${heroTextBlur}px)`
  const heroCardY = useTransform(scrollY, [0, 900], [0, -70])
  const heroVisualY = useTransform(scrollY, [0, 900], [0, 90])
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    document.title = 'Preetham | Cinematic AI Portfolio'
  }, [])

  useEffect(() => {
    const sectionElements = navItems
      .map((item) => document.getElementById(item.target))
      .filter((section): section is HTMLElement => Boolean(section))

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((entryA, entryB) => entryB.intersectionRatio - entryA.intersectionRatio)

        if (visibleEntries[0]) {
          setActiveSection(visibleEntries[0].target.id)
        }
      },
      {
        threshold: [0.2, 0.45, 0.7],
        rootMargin: '-25% 0px -45% 0px',
      },
    )

    sectionElements.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  const featuredProjects = useMemo(() => {
    const order = new Map(featuredProjectNames.map((name, index) => [name, index]))
    const prioritized = [...repos]
      .filter((repo) => order.has(repo.name))
      .sort((repoA, repoB) => (order.get(repoA.name) ?? Number.MAX_SAFE_INTEGER) - (order.get(repoB.name) ?? Number.MAX_SAFE_INTEGER))

    return (prioritized.length > 0 ? prioritized : repos).slice(0, 5)
  }, [repos])

  const projectCount = overview?.user?.public_repos ?? featuredProjects.length
  const totalCommits = overview?.totalCommitsThisYear ?? 0
  const totalStars = overview?.totalStars ?? 0

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#0b0b0b] text-white">
      <AmbientBackground />
      <CinematicCursor />
      <motion.div
        style={{ scaleX: smoothProgress }}
        className="fixed inset-x-0 top-0 z-[80] h-[3px] origin-left bg-gradient-to-r from-[#ff2a2a] via-white to-[#ff2a2a]"
      />
      <FloatingNav activeSection={activeSection} onNavigate={scrollToSection} />

      <main className="relative z-10 pb-20">
        <section id="home" className="relative flex min-h-screen items-center pt-28 sm:pt-32">
          <motion.div
            aria-hidden
            style={
              shouldReduceMotion
                ? { opacity: 0.05 }
                : {
                    x: heroTextX,
                    y: heroTextY,
                    opacity: heroTextOpacity,
                    filter: heroTextFilter,
                  }
            }
            className="hero-wordmark pointer-events-none absolute inset-x-0 top-[14vh] text-center font-heading text-[24vw] font-bold uppercase tracking-[-0.14em] text-white sm:text-[20vw] lg:text-[15vw]"
          >
            PREETHAM
          </motion.div>

          <div className="section-shell grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div
              style={{ y: heroCardY }}
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="relative"
            >
              <motion.span
                variants={fadeUp}
                className="glass-chip inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70"
              >
                Generative AI Developer Portfolio
              </motion.span>

              <motion.div variants={fadeUp} className="mt-8 max-w-2xl">
                <p className="text-sm uppercase tracking-[0.42em] text-white/42">Generative AI Developer</p>
                <h1 className="mt-4 font-heading text-4xl font-bold leading-[0.92] tracking-[-0.06em] text-white sm:text-5xl lg:text-[5.5rem]">
                  Building Generative AI systems with LLM workflows, RAG pipelines, and prompt engineering.
                </h1>
              </motion.div>

              <motion.div variants={fadeUp} className="glass-panel mt-8 max-w-2xl rounded-[34px] p-6 sm:p-8 lg:p-10">
                <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/46">
                  <span>{profile.role}</span>
                  <span className="h-1 w-1 rounded-full bg-[#ff2a2a]" />
                  <span>{profile.education}</span>
                </div>

                <p className="mt-6 max-w-xl text-base leading-8 text-white/66 sm:text-lg">{profile.summary}</p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {heroHighlights.map((item) => (
                    <div key={item.label} className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-[10px] uppercase tracking-[0.28em] text-white/38">{item.label}</p>
                      <p className="mt-2 text-sm font-medium leading-6 text-white/72">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => scrollToSection('projects')}
                    className="button-primary"
                    data-cursor="interactive"
                  >
                    View Projects
                    <MoveRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      void downloadResumePdf()
                    }}
                    className="button-secondary"
                    data-cursor="interactive"
                  >
                    Resume
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
                {cinematicStats.map((stat) => (
                  <div key={stat.label} className="metric-card rounded-[24px] p-4">
                    <p className="font-heading text-3xl font-bold tracking-[-0.05em] text-white">{stat.value}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.28em] text-white/42">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              style={{ y: heroVisualY }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto w-full max-w-[32rem]"
            >
              <div className="absolute inset-0 rounded-full bg-[#ff2a2a]/20 blur-[120px]" />
              <div className="absolute left-1/2 top-10 h-[72%] w-[72%] -translate-x-1/2 rounded-full border border-white/10" />
              <motion.div
                whileHover={{ y: -10, rotateX: 4, rotateY: -4 }}
                transition={{ duration: 0.3 }}
                className="glass-panel relative overflow-hidden rounded-[40px] p-3 shadow-[0_40px_90px_-50px_rgba(255,42,42,0.55)]"
              >
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.03))]" />
                <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#141414]">
                  <div className="pointer-events-none absolute left-6 top-6 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/68">
                    Generative AI Visual
                  </div>
                  <img
                    src={`${import.meta.env.BASE_URL}gen-ai-hero.svg`}
                    alt="Generative AI neural systems illustration"
                    className="h-[30rem] w-full object-cover object-center sm:h-[36rem]"
                  />
                  <div className="absolute inset-x-4 bottom-4 rounded-[24px] border border-white/10 bg-black/35 p-4 backdrop-blur-xl">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-heading text-xl font-semibold tracking-[-0.03em] text-white">Gen AI Engineering</p>
                        <p className="mt-1 text-sm text-white/54">LLM Applications, RAG Systems, Prompt Engineering</p>
                      </div>
                      <span className="rounded-full border border-[#ff2a2a]/40 bg-[#ff2a2a]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                        AI Systems
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.55 }}
                className="absolute -right-2 top-10 rounded-[24px] border border-white/10 bg-black/55 px-4 py-3 backdrop-blur-xl sm:right-[-2.5rem]"
              >
                <p className="text-[10px] uppercase tracking-[0.28em] text-white/42">Selected builds</p>
                <p className="mt-2 flex items-center gap-2 text-sm font-medium text-white/74">
                  <Sparkles className="h-4 w-4 text-[#ff2a2a]" />
                  {projectCount} AI-focused projects
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.55 }}
                className="absolute -left-2 bottom-12 rounded-[24px] border border-white/10 bg-black/55 px-4 py-3 backdrop-blur-xl sm:left-[-2.5rem]"
              >
                <p className="text-[10px] uppercase tracking-[0.28em] text-white/42">Core stack</p>
                <p className="mt-2 flex items-center gap-2 text-sm font-medium text-white/74">
                  <Layers3 className="h-4 w-4 text-[#ff2a2a]" />
                  LangChain, FastAPI, Prompting
                </p>
              </motion.div>
            </motion.div>
          </div>

          <button
            type="button"
            onClick={() => scrollToSection('projects')}
            className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/48 transition hover:text-white"
            data-cursor="interactive"
            aria-label="Scroll to projects section"
          >
            <span className="text-[10px] uppercase tracking-[0.35em]">Scroll</span>
            <span className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/[0.04] animate-[scrollCue_1.8s_ease-in-out_infinite]">
              <ChevronsDown className="h-4 w-4" />
            </span>
          </button>
        </section>

        <section className="section-shell mt-10">
          <div className="glass-panel flex flex-wrap items-center justify-between gap-4 rounded-[30px] px-5 py-4 sm:px-7">
            <div className="flex items-center gap-3 text-sm text-white/60">
              <FolderGit2 className="h-4 w-4 text-[#ff2a2a]" />
              Selected work, Gen AI case studies, and AI engineering signals built into one portfolio narrative.
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.22em] text-white/46">
              <span className="glass-chip rounded-full px-3 py-1">LLM Apps</span>
              <span className="glass-chip rounded-full px-3 py-1">RAG Systems</span>
              <span className="glass-chip rounded-full px-3 py-1">Prompt Engineering</span>
              <span className="glass-chip rounded-full px-3 py-1">FastAPI</span>
            </div>
          </div>
        </section>

        <section id="projects" className="section-shell pt-28">
          <SectionHeader
            eyebrow="Projects"
            title="Cinematic cards for the work that defines the portfolio."
            description="Each project is framed like a landing page moment: layered gradients, clear hierarchy, tech context, and direct paths to code or live demos where available."
          />

          <div className="mt-10 grid gap-6 xl:grid-cols-2">
            {featuredProjects.map((repo, index) => (
              <ProjectCard key={repo.id} repo={repo} index={index} />
            ))}
          </div>
        </section>

        <section id="skills" className="section-shell pt-28">
          <SectionHeader
            eyebrow="Skills"
            title="Technical depth visualized through motion, clarity, and rhythm."
            description="The stack blends Python, machine learning, LLM tooling, and secure engineering habits. The section combines classic progress bars with circular indicators to keep the data expressive without feeling corporate."
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="grid gap-4">
              {cinematicSkills.map((skill, index) => (
                <SkillBar key={skill.name} skill={skill} index={index} />
              ))}
            </div>

            <div className="space-y-4">
              {skillRings.map((ring, index) => (
                <SkillRing key={ring.label} ring={ring} index={index} />
              ))}

              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.5, delay: 0.18 }}
                className="glass-panel rounded-[30px] p-6"
              >
                <p className="text-xs uppercase tracking-[0.32em] text-white/42">Capability Stack</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {['LangChain', 'RAG', 'FastAPI', 'Prompt Design', 'LlamaIndex', 'Transformers', 'Vector DBs', 'Pinecone'].map((item) => (
                    <span key={item} className="glass-chip rounded-full px-3 py-2 text-xs font-medium text-white/72">
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="experience" className="section-shell pt-28">
          <SectionHeader
            eyebrow="Experience"
            title="A focused timeline from internship execution to production AI systems."
            description="The work history is presented as a clean cinematic timeline with enough signal to show ownership, delivery context, and the technologies driving each stage."
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <motion.aside
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              className="glass-panel rounded-[32px] p-6 sm:p-8 lg:sticky lg:top-28 lg:h-fit"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-white/42">Live signal</p>
              <h3 className="mt-4 font-heading text-3xl font-bold tracking-[-0.05em] text-white">Shipping with AI discipline and production-focused engineering.</h3>
              <p className="mt-4 text-sm leading-7 text-white/60">
                The portfolio now mirrors that approach: clear narrative hierarchy, measurable proof points, and a presentation centered on Generative AI delivery.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <div className="metric-card rounded-[24px] p-4">
                  <p className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-white/42">
                    <BriefcaseBusiness className="h-4 w-4 text-[#ff2a2a]" />
                    Experience
                  </p>
                  <p className="mt-3 font-heading text-3xl font-bold text-white">{experience.length}</p>
                  <p className="mt-1 text-sm text-white/58">Core roles captured</p>
                </div>
                <div className="metric-card rounded-[24px] p-4">
                  <p className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-white/42">
                    <GitCommitHorizontal className="h-4 w-4 text-[#ff2a2a]" />
                    2026 commits
                  </p>
                  <p className="mt-3 font-heading text-3xl font-bold text-white">{String(totalCommits).padStart(2, '0')}</p>
                  <p className="mt-1 text-sm text-white/58">GitHub activity snapshot</p>
                </div>
                <div className="metric-card rounded-[24px] p-4">
                  <p className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-white/42">
                    <Star className="h-4 w-4 text-[#ff2a2a]" />
                    Stars
                  </p>
                  <p className="mt-3 font-heading text-3xl font-bold text-white">{String(totalStars).padStart(2, '0')}</p>
                  <p className="mt-1 text-sm text-white/58">Across public repos</p>
                </div>
              </div>
            </motion.aside>

            <div className="space-y-5">
              {experience.map((item, index) => (
                <motion.article
                  key={`${item.company}-${item.title}`}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] p-6 sm:p-8"
                >
                  <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-[#ff2a2a] via-white/70 to-transparent" />
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-white/38">{item.company}</p>
                      <h3 className="mt-3 font-heading text-2xl font-semibold tracking-[-0.04em] text-white">{item.title}</h3>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${item.current ? 'border border-[#ff2a2a]/40 bg-[#ff2a2a]/10 text-white' : 'border border-white/10 bg-white/[0.04] text-white/54'}`}>
                      {item.duration}
                    </span>
                  </div>

                  <div className="mt-6 grid gap-3">
                    {item.highlights.map((highlight) => (
                      <div key={highlight} className="flex gap-3 text-sm leading-7 text-white/64">
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#ff2a2a]" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {item.tech.map((tech) => (
                      <span key={tech} className="glass-chip rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="section-shell pt-28">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
            className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 shadow-[0_35px_90px_-55px_rgba(255,42,42,0.45)] backdrop-blur-2xl sm:p-8 lg:p-12"
          >
            <div className="absolute right-[-6rem] top-[-4rem] h-64 w-64 rounded-full bg-[#ff2a2a]/18 blur-[110px]" />
            <div className="absolute left-[-4rem] bottom-[-6rem] h-64 w-64 rounded-full bg-white/[0.08] blur-[120px]" />

            <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
              <div>
                <span className="glass-chip inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
                  Contact
                </span>
                <h2 className="mt-5 max-w-3xl font-heading text-4xl font-bold leading-[0.96] tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl">
                  Ready to build AI products that feel as sharp as they function.
                </h2>
                <p className="mt-6 max-w-2xl text-base leading-8 text-white/66">
                  If you need a Generative AI workflow, LLM application, RAG implementation, or AI engineering support, reach out. I am open to internships, freelance builds, and collaborative product work.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a href={`mailto:${profile.email}`} className="button-primary" data-cursor="interactive">
                    Email Me
                    <Mail className="h-4 w-4" />
                  </a>
                  <a href={profile.linkedin} target="_blank" rel="noreferrer" className="button-secondary" data-cursor="interactive">
                    LinkedIn
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a href={profile.github} target="_blank" rel="noreferrer" className="button-secondary" data-cursor="interactive">
                    GitHub
                    <Github className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="glass-panel rounded-[28px] p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/42">Primary email</p>
                  <a
                    href={`mailto:${profile.email}`}
                    className="mt-3 flex items-center justify-between gap-4 text-lg font-medium text-white transition hover:text-[#ffb2b2]"
                    data-cursor="interactive"
                  >
                    {profile.email}
                    <ArrowUpRight className="h-5 w-5 text-[#ff2a2a]" />
                  </a>
                </div>
                <div className="glass-panel rounded-[28px] p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/42">Location</p>
                  <p className="mt-3 flex items-center gap-3 text-lg font-medium text-white">
                    <MapPin className="h-5 w-5 text-[#ff2a2a]" />
                    {profile.location}
                  </p>
                </div>
                <div className="glass-panel rounded-[28px] p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/42">Current role</p>
                  <p className="mt-3 text-lg font-medium text-white">{profile.role}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="section-shell relative z-10 border-t border-white/8 py-8">
        <div className="flex flex-col gap-3 text-sm text-white/42 sm:flex-row sm:items-center sm:justify-between">
          <p>Designed as a cinematic portfolio with glassmorphism, layered typography, and motion-driven storytelling.</p>
          <p>
            {profile.name} - {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  )
}

