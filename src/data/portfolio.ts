import type { ExperienceItem, NavItem, RoadmapPhase, SkillCategory } from '@/types/portfolio'

export const profile = {
  name: 'A Preetham Reddy',
  title: 'AI Engineer in Training | Generative AI Developer',
  role: 'Generative AI Engineer at BEPEC Solutions',
  location: 'Bengaluru, Karnataka, India',
  email: 'preethamofficial336@gmail.com',
  whatsapp: '+916361484070',
  website: 'https://preethamofficial.github.io/my_profile/',
  linkedin: 'https://www.linkedin.com/in/a-preetham-reddy-739b28317/',
  github: 'https://github.com/preethamofficial',
  githubUsername: 'preethamofficial',
  education: 'Brindavan College of Engineering (BCE), Bangalore (Graduating 2026)',
  summary:
    'AI Engineer in Training specializing in Generative AI, LLM applications, RAG pipelines, and prompt engineering. Building practical AI and automation solutions with a focus on production-grade systems.',
}

export const typingRoles = ['Generative AI Developer', 'LLM Application Builder', 'Prompt Systems Designer']

export const navItems: NavItem[] = [
  { label: 'Home', target: 'home' },
  { label: 'Projects', target: 'projects' },
  { label: 'Skills', target: 'skills' },
  { label: 'Experience', target: 'experience' },
  { label: 'Contact', target: 'contact' },
]

export const aboutParagraphs = [
  'My AI journey started with Python automation and hands-on mini projects, then evolved into designing intelligent systems that solve real operational problems.',
  'At BEPEC Solutions, I build enterprise-ready LLM applications with practical retrieval pipelines, robust prompt orchestration, and measurable response quality improvements.',
  'My focus is to ship reliable Generative AI products end-to-end, from experimentation to deployment, with strong guardrails, observability, and performance tuning.',
]

export const aboutStats = [
  { label: 'Years Learning AI', value: 2, suffix: '+' },
  { label: 'Projects Completed', value: 10, suffix: '+' },
  { label: 'Technologies Mastered', value: 15, suffix: '+' },
  { label: 'GitHub Contributions', value: 50, suffix: '+' },
]

export const heroHighlights = [
  { label: 'Current Focus', value: 'LLM apps, RAG, and prompt orchestration' },
  { label: 'Based In', value: 'Bengaluru, India' },
  { label: 'Open To', value: 'Gen AI and AI engineering collaborations' },
]

export const cinematicStats = [
  { value: '02+', label: 'Years in AI' },
  { value: '10+', label: 'Projects shipped' },
  { value: '15+', label: 'Tools in stack' },
]

export const cinematicSkills = [
  { name: 'Python', value: 95, detail: 'Automation, APIs, data tooling' },
  { name: 'AI', value: 92, detail: 'LLM workflows and agent systems' },
  { name: 'Machine Learning', value: 88, detail: 'Model evaluation and deployment' },
  { name: 'Cybersecurity', value: 72, detail: 'Secure design and risk awareness' },
  { name: 'Web Development', value: 84, detail: 'Responsive apps and APIs' },
  { name: 'Django', value: 78, detail: 'Backend architecture and admin flows' },
  { name: 'JavaScript', value: 82, detail: 'Interactive UI and product logic' },
] as const

export const skillRings = [
  { label: 'LLM Systems', value: 90, caption: 'Prompt design, RAG, orchestration' },
  { label: 'Prompt Engineering', value: 84, caption: 'Prompt design, evaluation, and optimization' },
  { label: 'AI Deployment', value: 76, caption: 'APIs, guardrails, and production reliability' },
] as const

export const skillCategories: SkillCategory[] = [
  {
    category: 'Programming',
    items: [
      { name: 'Python', level: 'Expert', percentage: 95 },
      { name: 'SQL', level: 'Advanced', percentage: 82 },
      { name: 'MySQL', level: 'Advanced', percentage: 80 },
      { name: 'JavaScript', level: 'Intermediate', percentage: 72 },
    ],
  },
  {
    category: 'AI / ML',
    items: [
      { name: 'LangChain', level: 'Advanced', percentage: 84 },
      { name: 'LlamaIndex', level: 'Advanced', percentage: 78 },
      { name: 'Transformers', level: 'Advanced', percentage: 80 },
      { name: 'PyTorch', level: 'Intermediate', percentage: 70 },
      { name: 'Scikit-learn', level: 'Advanced', percentage: 79 },
      { name: 'Hugging Face', level: 'Advanced', percentage: 83 },
    ],
  },
  {
    category: 'Generative AI',
    items: [
      { name: 'LLM Applications', level: 'Advanced', percentage: 88 },
      { name: 'Prompt Engineering', level: 'Advanced', percentage: 92 },
      { name: 'RAG Systems', level: 'Advanced', percentage: 86 },
      { name: 'Fine-tuning', level: 'Intermediate', percentage: 68 },
      { name: 'LoRA', level: 'Intermediate', percentage: 64 },
    ],
  },
  {
    category: 'Backend & Cloud',
    items: [
      { name: 'FastAPI', level: 'Advanced', percentage: 84 },
      { name: 'Flask', level: 'Advanced', percentage: 82 },
      { name: 'REST APIs', level: 'Advanced', percentage: 88 },
      { name: 'AWS', level: 'Intermediate', percentage: 67 },
      { name: 'Google Cloud', level: 'Intermediate', percentage: 63 },
      { name: 'Docker', level: 'Intermediate', percentage: 69 },
    ],
  },
  {
    category: 'Databases & Tools',
    items: [
      { name: 'Pinecone', level: 'Advanced', percentage: 77 },
      { name: 'Weaviate', level: 'Intermediate', percentage: 66 },
      { name: 'PostgreSQL', level: 'Advanced', percentage: 76 },
      { name: 'Vector DBs', level: 'Advanced', percentage: 80 },
      { name: 'Git', level: 'Advanced', percentage: 85 },
      { name: 'n8n', level: 'Intermediate', percentage: 61 },
    ],
  },
]

export const techBadges = [
  { name: 'Python', icon: 'python', color: '3776AB' },
  { name: 'FastAPI', icon: 'fastapi', color: '009688' },
  { name: 'LangChain', icon: 'langchain', color: '1C3C3C' },
  { name: 'LlamaIndex', icon: 'llamaindex', color: '7C3AED' },
  { name: 'PyTorch', icon: 'pytorch', color: 'EE4C2C' },
  { name: 'Hugging Face', icon: 'huggingface', color: 'FFD21E' },
  { name: 'Docker', icon: 'docker', color: '2496ED' },
  { name: 'AWS', icon: 'amazonwebservices', color: 'FF9900' },
  { name: 'Google Cloud', icon: 'googlecloud', color: '4285F4' },
  { name: 'PostgreSQL', icon: 'postgresql', color: '4169E1' },
  { name: 'Pinecone', icon: 'pinecone', color: '14B8A6' },
  { name: 'Weaviate', icon: 'weaviate', color: '0EA5E9' },
  { name: 'Git', icon: 'git', color: 'F05032' },
  { name: 'VS Code', icon: 'visualstudiocode', color: '007ACC' },
]

export const projectShowcase = {
  'skin-disease-detection-build-by-using-ml': {
    title: 'Skin Disease Detection',
    eyebrow: 'AI / Computer Vision',
    synopsis: 'A machine learning workflow for identifying skin conditions through image-based classification and practical model evaluation.',
    accent: 'from-[#491111] via-[#241313] to-[#0f0f0f]',
    preview: 'Diagnostic Vision',
    liveUrl: null,
  },
  'inventory-managment': {
    title: 'Inventory Management System',
    eyebrow: 'Python / Operations',
    synopsis: 'A utility-first system built during internship work to automate stock handling and operational tracking with Python.',
    accent: 'from-[#381312] via-[#1a1413] to-[#0f0f0f]',
    preview: 'Ops Control',
    liveUrl: null,
  },
  'python-game': {
    title: 'Python Game Lab',
    eyebrow: 'Interactive Build',
    synopsis: 'A gameplay prototype exploring Python fundamentals, logic design, and interactive state management through a playable mini project.',
    accent: 'from-[#2c0f1f] via-[#181115] to-[#0f0f0f]',
    preview: 'Play Engine',
    liveUrl: null,
  },
  'vaultofcode-python-internship-': {
    title: 'VaultOfCode Internship',
    eyebrow: 'Learning Archive',
    synopsis: 'A collection of internship deliverables, automation scripts, and product experiments documenting steady growth in applied development.',
    accent: 'from-[#35100f] via-[#191212] to-[#0f0f0f]',
    preview: 'Build Journal',
    liveUrl: null,
  },
  preethamofficial: {
    title: 'Developer Presence',
    eyebrow: 'Portfolio / Brand',
    synopsis: 'A personal portfolio that brings together AI engineering identity, selected projects, and a strong Generative AI narrative.',
    accent: 'from-[#511717] via-[#1c1116] to-[#0f0f0f]',
    preview: 'Digital Identity',
    liveUrl: profile.website,
  },
} as const

export const experience: ExperienceItem[] = [
  {
    title: 'Generative AI Engineer',
    company: 'BEPEC Solutions',
    duration: 'Current',
    current: true,
    highlights: [
      'Building production-grade LLM applications for business workflows.',
      'Implementing RAG systems for enterprise clients with vector databases.',
      'Optimizing prompt engineering strategies to improve response quality and consistency.',
    ],
    tech: ['LangChain', 'RAG', 'FastAPI', 'Pinecone', 'Prompt Engineering'],
  },
  {
    title: 'Python Intern',
    company: 'VaultOfCode',
    duration: 'Past Internship',
    current: false,
    highlights: [
      'Developed Python automation scripts for repetitive operations.',
      'Built inventory management systems with practical data workflows.',
      'Created mini-games and technical projects to strengthen development fundamentals.',
    ],
    tech: ['Python', 'Flask', 'SQL', 'Automation'],
  },
]

export const roadmap: RoadmapPhase[] = [
  {
    phase: 'Phase 1',
    title: 'Foundation',
    progress: 100,
    focus: ['LLM Architecture', 'Transformers', 'API Integration'],
  },
  {
    phase: 'Phase 2',
    title: 'Advanced',
    progress: 60,
    focus: ['Prompt Engineering at Scale', 'RAG Implementation', 'Fine-tuning'],
  },
  {
    phase: 'Phase 3',
    title: 'Production',
    progress: 30,
    focus: ['Production Systems', 'Deployment', 'Multi-model Orchestration'],
  },
]

export const learningResources = ['LangChain Documentation', 'Hugging Face Docs', 'OpenAI Guides', 'Papers with Code']

export const contactSubjects = ['Project Inquiry', 'Job Opportunity', 'Collaboration', 'Other']

export const featuredProjectNames = [
  'skin-disease-detection-build-by-using-ml',
  'inventory-managment',
  'python-game',
  'vaultofcode-python-internship-',
  'preethamofficial',
]

export const projectFilters = ['All', 'AI/ML', 'Python', 'Web', 'Tools']
