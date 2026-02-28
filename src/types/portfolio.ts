export interface SkillItem {
  name: string
  level: 'Expert' | 'Advanced' | 'Intermediate'
  percentage: number
}

export interface SkillCategory {
  category: string
  items: SkillItem[]
}

export interface ExperienceItem {
  title: string
  company: string
  duration: string
  current: boolean
  highlights: string[]
  tech: string[]
}

export interface RoadmapPhase {
  phase: string
  title: string
  progress: number
  focus: string[]
}

export interface NavItem {
  label: string
  target: string
}
