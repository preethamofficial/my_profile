import type { ExperienceItem, NavItem, RoadmapPhase, SkillCategory } from '@/types/portfolio'

export const profile = {
  name: 'A Preetham Reddy',
  title: 'AI / ML Engineer | Generative AI & RAG Developer',
  role: 'Software Trainee – AI at KenAI Technologies',
  location: 'Bengaluru, Karnataka, India',
  email: 'preethamofficial336@gmail.com',
  whatsapp: '+916361484070',
  website: 'https://preethamofficial.github.io/my_profile/',
  linkedin: 'https://www.linkedin.com/in/a-preetham-reddy-739b28317/',
  github: 'https://github.com/preethamofficial',
  githubUsername: 'preethamofficial',
  education: 'Brindavan College of Engineering, Bengaluru — B.E. Information Science and Engineering (2022–2026)',
  summary:
    'AI Engineer specializing in Generative AI and RAG, building production RAG pipelines at KenAI Technologies while directing AI coding agents to architect full-stack applications end-to-end. Hands-on across the LLM ecosystem — LangChain, LangGraph, Hugging Face, Gemini, Groq, Cohere, and local models via Ollama — with 1+ year of freelance GenAI delivery and multiple deployed AI projects.',
}

export const typingRoles = ['Generative AI Engineer', 'RAG Pipeline Builder', 'LangChain & LangGraph Developer']

export const navItems: NavItem[] = [
  { label: 'Home', target: 'home' },
  { label: 'Projects', target: 'projects' },
  { label: 'Skills', target: 'skills' },
  { label: 'Experience', target: 'experience' },
  { label: 'Contact', target: 'contact' },
]

export const aboutParagraphs = [
  'My AI journey started with Python automation and hands-on mini projects, then evolved into architecting full-stack AI applications — with AI coding agents (Copilot, Cline, Codex) directed end-to-end.',
  'At KenAI Technologies, I am building an AI Meeting Assistant — a RAG-based meeting-automation platform — and the backend for Moritz, a multi-role elder-care companion app, migrating Node.js/Express to Python/FastAPI.',
  'Previously at BEPEC Solutions, I delivered GenAI solutions for 3+ client-facing websites spanning document analysis, data extraction, summarization, classification, and multimodal AI — engineering 50-60 production prompts with RAG evaluation to improve retrieval accuracy.',
  'I own the full stack: data pipelines, backend logic, prompt engineering, RAG evaluation, and Docker/Railway deployment.',
]

export const aboutStats = [
  { label: 'Years in AI', value: 3, suffix: '+' },
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
      { name: 'LangChain', level: 'Advanced', percentage: 88 },
      { name: 'LangGraph', level: 'Advanced', percentage: 82 },
      { name: 'RAG & Evaluation', level: 'Advanced', percentage: 90 },
      { name: 'Sentence Transformers', level: 'Advanced', percentage: 80 },
      { name: 'EfficientNet (CNN)', level: 'Advanced', percentage: 78 },
      { name: 'Hugging Face', level: 'Advanced', percentage: 85 },
    ],
  },
  {
    category: 'Generative AI',
    items: [
      { name: 'LLM Applications', level: 'Advanced', percentage: 90 },
      { name: 'Prompt Engineering', level: 'Expert', percentage: 94 },
      { name: 'RAG Systems', level: 'Expert', percentage: 92 },
      { name: 'RAG Evaluation', level: 'Advanced', percentage: 80 },
      { name: 'Fine-tuning', level: 'Intermediate', percentage: 72 },
    ],
  },
  {
    category: 'Backend & Cloud',
    items: [
      { name: 'FastAPI', level: 'Advanced', percentage: 86 },
      { name: 'REST APIs', level: 'Advanced', percentage: 88 },
      { name: 'Docker', level: 'Intermediate', percentage: 75 },
      { name: 'Railway', level: 'Advanced', percentage: 78 },
      { name: 'MySQL', level: 'Advanced', percentage: 82 },
      { name: 'PostgreSQL', level: 'Advanced', percentage: 80 },
    ],
  },
  {
    category: 'Databases & Tools',
    items: [
      { name: 'ChromaDB', level: 'Advanced', percentage: 80 },
      { name: 'Vector Databases', level: 'Advanced', percentage: 84 },
      { name: 'Supabase (pgvector)', level: 'Advanced', percentage: 76 },
      { name: 'Gemini / Groq / Ollama', level: 'Advanced', percentage: 85 },
      { name: 'Git & GitHub', level: 'Advanced', percentage: 88 },
      { name: 'n8n / CrewAI', level: 'Intermediate', percentage: 68 },
    ],
  },
]

export const techBadges = [
  { name: 'Python', icon: 'python', color: '3776AB' },
  { name: 'FastAPI', icon: 'fastapi', color: '009688' },
  { name: 'LangChain', icon: 'langchain', color: '1C3C3C' },
  { name: 'Hugging Face', icon: 'huggingface', color: 'FFD21E' },
  { name: 'Docker', icon: 'docker', color: '2496ED' },
  { name: 'MySQL', icon: 'mysql', color: '4479A1' },
  { name: 'PostgreSQL', icon: 'postgresql', color: '4169E1' },
  { name: 'Git', icon: 'git', color: 'F05032' },
  { name: 'VS Code', icon: 'visualstudiocode', color: '007ACC' },
]

export const projectShowcase = {
  'ai-doubt-resolution-agent': {
    title: 'AI Doubt Resolution Agent',
    eyebrow: 'RAG Q&A Platform',
    synopsis: 'An AI-powered doubt-resolution system built with LangChain/LangGraph and a custom multi-step RAG pipeline — with a normalized MySQL schema, ChromaDB, and Supabase (pgvector) for semantic search. Live as a Telegram bot: @AI_Doubt_Solver336_bot.',
    accent: 'from-[#4a1111] via-[#1d1213] to-[#0f0f0f]',
    preview: 'Doubt Solver',
    liveUrl: 'https://t.me/AI_Doubt_Solver336_bot',
  },
  'Ai-Meeting-Assistant': {
    title: 'AI Meeting Assistant',
    eyebrow: 'Python / RAG Automation',
    synopsis: 'An internal meeting-automation platform with RAG-based summarization and retrieval using Python — currently in production build at KenAI Technologies.',
    accent: 'from-[#3d1418] via-[#1a1214] to-[#0f0f0f]',
    preview: 'Meeting AI',
    liveUrl: null,
  },
  'skin-disease-detection-build-by-using-ml': {
    title: 'Skin Disease Detection',
    eyebrow: 'Deep Learning / Computer Vision',
    synopsis: 'A fine-tuned CNN (EfficientNetB1) classifying skin lesions across 7 categories on the 10,015-image HAM10000 dataset — improving validation accuracy from a low-80s baseline to 87%.',
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
    title: 'Software Trainee – AI',
    company: 'KenAI Technologies Private Ltd.',
    duration: 'July 2026 – Present',
    current: true,
    highlights: [
      'Building the AI Meeting Assistant, an internal meeting-automation platform with RAG-based summarization and retrieval using Python.',
      'Developing the backend for Moritz, a multi-role elder-care companion app — migrating Node.js/Express to Python/FastAPI with asyncpg, auth, and role-based endpoints for Admin, Caretaker, Individual, and Family.',
    ],
    tech: ['Python', 'FastAPI', 'RAG', 'asyncpg', 'Node.js/Express Migration'],
  },
  {
    title: 'Generative AI Freelancer',
    company: 'BEPEC Solutions',
    duration: 'June 2025 – June 2026 · Remote',
    current: false,
    highlights: [
      'Delivered GenAI solutions for 3+ client-facing websites spanning document analysis, data extraction, summarization, classification, customer support, information retrieval, code/content generation, and multimodal AI.',
      'Engineered 50-60 production prompts across these use cases; worked with vector databases and RAG pipelines, including RAG evaluation and fine-tuning, to improve retrieval accuracy.',
      'Contributed to UI design for client-facing AI applications.',
    ],
    tech: ['LangChain', 'RAG', 'Prompt Engineering', 'Vector Databases', 'n8n'],
  },
  {
    title: 'Generative AI Intern',
    company: 'VTU | Learners Byte ExpertPedia.ai',
    duration: 'Jan 2026 – May 2026',
    current: false,
    highlights: [
      'Built a RAG-based semantic search module using Sentence Transformers and vector embeddings for document Q&A, applying prompt engineering and NLP techniques.',
      'Wrote pytest unit tests for functional correctness.',
      'Worked in an Agile team (stand-ups, sprint retrospectives) on Linux (Ubuntu), using Git/GitHub with feature branching and peer code review.',
    ],
    tech: ['Sentence Transformers', 'RAG', 'pytest', 'Git/GitHub', 'Linux'],
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
  'ai-doubt-resolution-agent',
  'Ai-Meeting-Assistant',
  'skin-disease-detection-build-by-using-ml',
  'inventory-managment',
  'preethamofficial',
]

export const projectFilters = ['All', 'AI/ML', 'Python', 'Web', 'Tools']
