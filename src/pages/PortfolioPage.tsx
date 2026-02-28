import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Element } from 'react-scroll'

import { Toast } from '@/components/common/Toast'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { AboutSection } from '@/components/sections/AboutSection'
import { ContactSection } from '@/components/sections/ContactSection'
import { ExperienceSection } from '@/components/sections/ExperienceSection'
import { HeroSection } from '@/components/sections/HeroSection'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { RoadmapSection } from '@/components/sections/RoadmapSection'
import { SkillsSection } from '@/components/sections/SkillsSection'
import { profile } from '@/data/portfolio'
import { useGithubData } from '@/hooks/useGithubData'
import { useTheme } from '@/hooks/useTheme'

type ToastType = 'success' | 'error' | 'info'

export default function PortfolioPage() {
  const { theme, toggleTheme } = useTheme()
  const { overview, repos, isLoading, error } = useGithubData(profile.githubUsername)
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: ToastType }>({
    visible: false,
    message: '',
    type: 'info',
  })

  useEffect(() => {
    document.title = `${profile.name} | Portfolio`
  }, [])

  const pushToast = (message: string, type: ToastType) => {
    setToast({ visible: true, message, type })
    window.setTimeout(() => {
      setToast((current) => ({ ...current, visible: false }))
    }, 2600)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      <main>
        <Element name="hero">
          <HeroSection avatarUrl={overview?.user?.avatar_url} />
        </Element>
        <Element name="about">
          <AboutSection />
        </Element>
        <Element name="skills">
          <SkillsSection />
        </Element>
        <Element name="projects">
          <ProjectsSection repos={repos} isLoading={isLoading} error={error} />
        </Element>
        <Element name="experience">
          <ExperienceSection />
        </Element>
        <Element name="roadmap">
          <RoadmapSection />
        </Element>
        <Element name="contact">
          <ContactSection onToast={pushToast} />
        </Element>
      </main>

      <Footer lastUpdated={overview?.lastUpdated ?? new Date().toISOString()} />
      <Toast visible={toast.visible} message={toast.message} type={toast.type} />
    </motion.div>
  )
}
