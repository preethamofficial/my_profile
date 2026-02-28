import { Fragment } from 'react'
import { BrainCircuit, Database, Sparkles, UserRound, Wrench } from 'lucide-react'
import { motion } from 'framer-motion'

import { Reveal } from '@/components/common/Reveal'
import { SectionHeading } from '@/components/common/SectionHeading'

const architectureFlow = [
  {
    label: 'User Input',
    detail: 'Intent + context capture',
    icon: UserRound,
    accent: 'text-brand-cyan',
  },
  {
    label: 'LLM Reasoning',
    detail: 'Prompt orchestration',
    icon: BrainCircuit,
    accent: 'text-brand-purple',
  },
  {
    label: 'Vector DB',
    detail: 'RAG retrieval layer',
    icon: Database,
    accent: 'text-brand-blue',
  },
  {
    label: 'Tool Execution',
    detail: 'Function/tool calling',
    icon: Wrench,
    accent: 'text-emerald-300',
  },
  {
    label: 'Output',
    detail: 'Validated response',
    icon: Sparkles,
    accent: 'text-cyan-200',
  },
]

export function AIArchitectureSection() {
  return (
    <section id="architecture" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="AI Architecture"
        title="Production LLM Flow Design"
        description="A command-center representation of how requests move through retrieval, reasoning, tool execution, and final response delivery."
      />

      <Reveal className="ai-border-card mt-10 rounded-3xl">
        <div className="glass-card-strong rounded-3xl p-5 sm:p-7">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="command-pill rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]">
              System Flow
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
              Agentic Pipeline
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
              Low-Latency Retrieval
            </span>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            {architectureFlow.map((node, index) => {
              const Icon = node.icon
              return (
                <Fragment key={node.label}>
                  <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                    className="neural-shell ai-border-card flex-1 rounded-2xl p-4"
                  >
                    <span className={`inline-flex rounded-xl border border-white/15 bg-white/10 p-2 ${node.accent}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-3 text-sm font-semibold text-[var(--text-primary)]">{node.label}</h3>
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">{node.detail}</p>
                  </motion.article>

                  {index < architectureFlow.length - 1 ? (
                    <div className="relative h-[2px] w-14 flex-none overflow-hidden rounded-full bg-white/20">
                      <motion.span
                        className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-brand-cyan shadow-[0_0_16px_1px_rgba(6,182,212,0.8)]"
                        animate={{ x: ['0%', '100%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: index * 0.2 }}
                      />
                    </div>
                  ) : null}
                </Fragment>
              )
            })}
          </div>

          <div className="space-y-3 lg:hidden">
            {architectureFlow.map((node, index) => {
              const Icon = node.icon
              const isLast = index === architectureFlow.length - 1
              return (
                <div key={`mobile-${node.label}`} className="relative">
                  <article className="neural-shell ai-border-card rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <span className={`inline-flex rounded-xl border border-white/15 bg-white/10 p-2 ${node.accent}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="text-sm font-semibold text-[var(--text-primary)]">{node.label}</h3>
                        <p className="mt-1 text-xs text-[var(--text-secondary)]">{node.detail}</p>
                      </div>
                    </div>
                  </article>
                  {!isLast ? (
                    <div className="ml-5 mt-1 h-5 w-[2px] overflow-hidden rounded-full bg-white/20">
                      <motion.span
                        className="block h-2 w-2 rounded-full bg-brand-cyan"
                        animate={{ y: ['0%', '130%'] }}
                        transition={{ duration: 1.3, repeat: Infinity, ease: 'linear' }}
                      />
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>

          <div className="mt-6 grid gap-3 text-xs text-[var(--text-secondary)] sm:grid-cols-3">
            <p className="rounded-xl border border-white/15 bg-white/5 px-3 py-2">Prompt templates tuned for controllable output style.</p>
            <p className="rounded-xl border border-white/15 bg-white/5 px-3 py-2">Retrieval scoring and filtering to reduce hallucinations.</p>
            <p className="rounded-xl border border-white/15 bg-white/5 px-3 py-2">Tool-call validation before response finalization.</p>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

