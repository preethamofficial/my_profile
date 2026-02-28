import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import emailjs from '@emailjs/browser'
import { Github, Linkedin, Mail, MapPin } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa6'

import { RippleButton } from '@/components/common/RippleButton'
import { Reveal } from '@/components/common/Reveal'
import { SectionHeading } from '@/components/common/SectionHeading'
import { contactSubjects, profile } from '@/data/portfolio'

interface ContactSectionProps {
  onToast: (message: string, type: 'success' | 'error' | 'info') => void
}

interface ContactFormState {
  name: string
  email: string
  subject: string
  message: string
}

const initialFormState: ContactFormState = {
  name: '',
  email: '',
  subject: contactSubjects[0],
  message: '',
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function normalizePhone(phone: string): string {
  return phone.replace(/[^\d]/g, '')
}

function buildWhatsappMessage(form: ContactFormState): string {
  return [
    'New Portfolio Inquiry',
    `Name: ${form.name}`,
    `Email: ${form.email}`,
    `Subject: ${form.subject}`,
    `Message: ${form.message}`,
  ].join('\n')
}

export function ContactSection({ onToast }: ContactSectionProps) {
  const [form, setForm] = useState<ContactFormState>(initialFormState)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const recaptchaEnabled = useMemo(() => Boolean(import.meta.env.VITE_RECAPTCHA_SITE_KEY), [])

  const updateField = (field: keyof ContactFormState, value: string) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }))
  }

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      onToast('Email copied to clipboard.', 'success')
    } catch {
      onToast('Unable to copy email on this browser.', 'error')
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      onToast('Please fill all required fields.', 'error')
      return
    }

    if (!isValidEmail(form.email)) {
      onToast('Please enter a valid email address.', 'error')
      return
    }

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined

    const whatsappNumber = normalizePhone(profile.whatsapp)
    const whatsappText = encodeURIComponent(buildWhatsappMessage(form))
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappText}`

    const whatsappWindow = window.open('', '_blank', 'noopener,noreferrer')
    if (whatsappWindow) {
      whatsappWindow.location.href = whatsappUrl
    } else {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    }

    setIsSubmitting(true)
    try {
      if (!serviceId || !templateId || !publicKey) {
        const mailtoUrl = `mailto:${profile.email}?subject=${encodeURIComponent(`[${form.subject}] New Portfolio Inquiry`)}&body=${encodeURIComponent(buildWhatsappMessage(form))}`
        window.location.href = mailtoUrl
        onToast('WhatsApp opened. Please send the email from your mail app (EmailJS not configured).', 'info')
      } else {
        await emailjs.send(
          serviceId,
          templateId,
          {
            from_name: form.name,
            from_email: form.email,
            reply_to: form.email,
            subject: form.subject,
            message: form.message,
            to_name: profile.name,
            to_email: profile.email,
            whatsapp: profile.whatsapp,
          },
          { publicKey },
        )

        onToast('Details sent to WhatsApp and email successfully. Thank you!', 'success')
      }

      setForm(initialFormState)
    } catch {
      onToast('WhatsApp opened, but email sending failed. Please try again later.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Contact"
        title="Let&apos;s Build Something Useful"
        description="Reach out for project collaboration, internships, or AI engineering opportunities."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <Reveal className="glass-card rounded-2xl p-5 sm:p-6">
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                Name <span className="text-rose-400">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                className="focusable w-full rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-slate-400"
                placeholder="Your full name"
                aria-required="true"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                Email <span className="text-rose-400">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                className="focusable w-full rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-slate-400"
                placeholder="you@example.com"
                aria-required="true"
              />
            </div>

            <div>
              <label htmlFor="subject" className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                value={form.subject}
                onChange={(event) => updateField('subject', event.target.value)}
                className="focusable w-full rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-[var(--text-primary)]"
              >
                {contactSubjects.map((subject) => (
                  <option key={subject} value={subject} className="bg-slate-900 text-slate-100">
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                Message <span className="text-rose-400">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                value={form.message}
                onChange={(event) => updateField('message', event.target.value)}
                className="focusable w-full rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-slate-400"
                placeholder="Tell me what you are building..."
                aria-required="true"
              />
            </div>

            {recaptchaEnabled ? (
              <p className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
                reCAPTCHA key detected. Integrate your widget in this form to enable spam protection.
              </p>
            ) : (
              <p className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-[var(--text-secondary)]">
                Optional: configure reCAPTCHA by setting <code>VITE_RECAPTCHA_SITE_KEY</code>.
              </p>
            )}

            <RippleButton
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isSubmitting}
              aria-label="Send message"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-800 border-t-transparent" />
                  Sending...
                </span>
              ) : (
                'Send Message'
              )}
            </RippleButton>
          </form>
        </Reveal>

        <Reveal className="space-y-4" delay={0.1}>
          <a
            href={`https://wa.me/${normalizePhone(profile.whatsapp)}`}
            target="_blank"
            rel="noreferrer"
            className="focusable glass-card hover-lift flex w-full items-center gap-3 rounded-2xl p-4 text-left"
          >
            <span className="rounded-full border border-white/15 bg-white/10 p-2 text-emerald-400">
              <FaWhatsapp className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-xs uppercase tracking-[0.12em] text-[var(--text-secondary)]">WhatsApp</span>
              <span className="text-sm font-medium text-[var(--text-primary)]">{profile.whatsapp}</span>
            </span>
          </a>

          <button
            type="button"
            onClick={handleCopyEmail}
            className="focusable glass-card hover-lift flex w-full items-center gap-3 rounded-2xl p-4 text-left"
          >
            <span className="rounded-full border border-white/15 bg-white/10 p-2 text-brand-cyan">
              <Mail className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-xs uppercase tracking-[0.12em] text-[var(--text-secondary)]">Email</span>
              <span className="text-sm font-medium text-[var(--text-primary)]">{profile.email}</span>
            </span>
          </button>

          <div className="glass-card hover-lift flex items-center gap-3 rounded-2xl p-4">
            <span className="rounded-full border border-white/15 bg-white/10 p-2 text-brand-purple">
              <MapPin className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-xs uppercase tracking-[0.12em] text-[var(--text-secondary)]">Location</span>
              <span className="text-sm font-medium text-[var(--text-primary)]">{profile.location}</span>
            </span>
          </div>

          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="focusable glass-card hover-lift flex items-center gap-3 rounded-2xl p-4"
          >
            <span className="rounded-full border border-white/15 bg-white/10 p-2 text-brand-cyan">
              <Linkedin className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-xs uppercase tracking-[0.12em] text-[var(--text-secondary)]">LinkedIn</span>
              <span className="text-sm font-medium text-[var(--text-primary)]">Connect professionally</span>
            </span>
          </a>

          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="focusable glass-card hover-lift flex items-center gap-3 rounded-2xl p-4"
          >
            <span className="rounded-full border border-white/15 bg-white/10 p-2 text-brand-blue">
              <Github className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-xs uppercase tracking-[0.12em] text-[var(--text-secondary)]">GitHub</span>
              <span className="text-sm font-medium text-[var(--text-primary)]">View source projects</span>
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  )
}
