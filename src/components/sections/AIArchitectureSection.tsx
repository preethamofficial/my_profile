import { useState } from 'react'
import { BrainCircuit, Database, Sparkles, UserRound, Wrench } from 'lucide-react'
import { motion } from 'framer-motion'

import { Reveal } from '@/components/common/Reveal'
import { SectionHeading } from '@/components/common/SectionHeading'

const architectureFlow = [
  {
    label: 'User Input',
    hud: 'QUERY',
    detail: 'Intent + context capture',
    icon: UserRound,
    accent: 'text-brand-cyan',
    explanation: 'The user question arrives with conversation context. The system normalizes it before any AI processing begins.',
  },
  {
    label: 'Prompt Engine',
    hud: 'PROMPT_ENGINE',
    detail: 'Prompt orchestration',
    icon: BrainCircuit,
    accent: 'text-brand-purple',
    explanation: 'System instructions, few-shot examples, and output contracts are assembled into a structured prompt.',
  },
  {
    label: 'Vector DB',
    hud: 'RAG_ENGINE',
    detail: 'RAG retrieval layer',
    icon: Database,
    accent: 'text-brand-blue',
    explanation: 'Embedding → Similarity Search → Context Retrieval. Relevant documents are fetched from the vector store.',
  },
  {
    label: 'LLM',
    hud: 'AI_CORE',
    detail: 'Reasoning + generation',
    icon: Sparkles,
    accent: 'text-cyan-200',
    explanation: 'Prompt + retrieved context → generated response, grounded in the retrieved knowledge.',
  },
  {
    label: 'Structured Output',
    hud: 'OUTPUT',
    detail: 'Validated response',
    icon: Wrench,
    accent: 'text-emerald-300',
    explanation: 'The response is validated against the output schema before being returned to the user.',
  },
]

const terminalLines = [
  '> Initializing prompt pipeline...',
  '> Context retrieved',
  '> Model processing',
  '> Response generated',
]

export function AIArchitectureSection() {
  const [selected, setSelected] = useState(2)
  const active = architectureFlow[selected]

  return (
    <section id="architecture" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="05 // AI LAB"
        title="Interactive AI Pipeline"
        description="Click any component to see how it works — the same architecture used to build production RAG and agent systems."
      />

      <Reveal className="ai-border-card mt-10 rounded-3xl">
        <div className="glass-card-strong rounded-3xl p-5 sm:p-7">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="command-pill rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]">
              AI_CORE: ACTIVE
            </span>
            <span className="hud-label rounded border border-white/15 px-2 py-1">MODE: GENERATIVE</span>
            <span className="hud-label rounded border border-white/15 px-2 py-1">RAG_ENGINE: READY</span>
            <span className="hud-label rounded border border-white/15 px-2 py-1">人工知能 // AI SYSTEM</span>
          </div>

          <p className="hud-label mb-3">SELECT A COMPONENT ▾</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {architectureFlow.map((node, index) => {
              const Icon = node.icon
              const isActive = index === selected
              return (
                <button
                  key={node.label}
                  type="button"
                  onClick={() => setSelected(index)}
                  aria-pressed={isActive}
                  className={`focusable rounded-2xl border p-4 text-left transition ${
                    isActive
                      ? 'border-brand-cyan/70 bg-brand-cyan/10 shadow-[0_0_28px_-6px_rgba(34,211,238,0.5)]'
                      : 'border-white/10 bg-white/[0.03] hover:border-brand-cyan/40'
                  }`}
                >
                  <span className={`inline-flex rounded-xl border border-white/15 bg-white/10 p-2 ${node.accent}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="hud-label mt-3">{node.hud}</p>
                  <h3 className="mt-1 text-sm font-semibold text-[var(--text-primary)]">{node.label}</h3>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">{node.detail}</p>
                </button>
              )
            })}
          </div>

          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-5 rounded-2xl border border-brand-cyan/25 bg-brand-cyan/[0.06] p-4 sm:p-5"
          >
            <p className="hud-label">{active.hud} // PROTOCOL</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-primary)]">{active.explanation}</p>
          </motion.div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-black/45" role="img" aria-label="Illustrative terminal showing a prompt pipeline run">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="hud-label ml-2">PROMPT_ENGINE // ONLINE</span>
            </div>
            <div className="space-y-1.5 p-4 font-mono text-xs sm:text-sm">
              {terminalLines.map((line, index) => (
                <motion.p
                  key={line}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ delay: 0.3 + index * 0.45, duration: 0.3 }}
                  className="text-brand-cyan"
                >
                  {line}
                </motion.p>
              ))}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ delay: 2.2, duration: 0.3 }}
                className="text-emerald-300"
              >
                ✓ Structured output delivered <span className="text-white/40">// illustrative demo — no live API call</span>
              </motion.p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}


