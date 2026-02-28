import { useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import emailjs from '@emailjs/browser'
import { CheckCircle2, Github, Globe, Linkedin, Mail, MapPin } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa6'
import ReCAPTCHA from 'react-google-recaptcha'

import { RippleButton } from '@/components/common/RippleButton'
import { Reveal } from '@/components/common/Reveal'
import { SectionHeading } from '@/components/common/SectionHeading'
import { contactSubjects, profile } from '@/data/portfolio'
import { verifyRecaptchaToken } from '@/services/recaptcha'

interface ContactSectionProps {
  onToast: (message: string, type: 'success' | 'error' | 'info') => void
}

interface ContactFormState {
  name: string
  email: string
  subject: string
  message: string
}

interface ContactSubmission extends ContactFormState {
  submittedAt: string
}

interface DeliveryState {
  delivered: boolean
  channel: 'EmailJS' | 'FormSubmit' | 'None'
  note: string
}

const RECAPTCHA_TEST_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'

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

function formatWebsiteLabel(url: string): string {
  try {
    const parsedUrl = new URL(url)
    const cleanPath = parsedUrl.pathname === '/' ? '' : parsedUrl.pathname.replace(/\/$/, '')
    return `${parsedUrl.hostname}${cleanPath}`
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
  }
}

function buildSubmission(form: ContactFormState): ContactSubmission {
  return {
    name: form.name.trim(),
    email: form.email.trim(),
    subject: (form.subject || contactSubjects[0]).trim(),
    message: form.message.trim(),
    submittedAt: new Date().toISOString(),
  }
}

function buildEmailDetails(submission: ContactSubmission): string {
  return [
    'New Portfolio Contact Submission',
    '',
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    `Subject: ${submission.subject}`,
    `Submitted At: ${new Date(submission.submittedAt).toLocaleString()}`,
    '',
    'Message:',
    submission.message,
  ].join('\n')
}

async function sendViaFormSubmit(submission: ContactSubmission): Promise<DeliveryState> {
  const fullDetails = buildEmailDetails(submission)

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${profile.email}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: submission.name,
        email: submission.email,
        subject: submission.subject,
        message: fullDetails,
        original_message: submission.message,
        submitted_at: submission.submittedAt,
        sender_email: submission.email,
        sender_name: submission.name,
        _subject: `[Portfolio Contact] ${submission.subject}`,
        _template: 'table',
        _captcha: 'false',
      }),
    })

    const payload = (await response.json().catch(() => ({}))) as { success?: boolean | string; message?: string }
    const success = payload.success === true || payload.success === 'true'

    if (!response.ok || !success) {
      return {
        delivered: false,
        channel: 'None',
        note: payload.message ?? 'FormSubmit delivery failed.',
      }
    }

    return {
      delivered: true,
      channel: 'FormSubmit',
      note: payload.message ?? 'Notification sent via FormSubmit.',
    }
  } catch {
    return {
      delivered: false,
      channel: 'None',
      note: 'FormSubmit request failed.',
    }
  }
}

export function ContactSection({ onToast }: ContactSectionProps) {
  const [form, setForm] = useState<ContactFormState>(initialFormState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const [lastSubmission, setLastSubmission] = useState<ContactSubmission | null>(null)
  const [lastDelivery, setLastDelivery] = useState<DeliveryState | null>(null)

  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const recaptchaEnvSiteKey = useMemo(
    () => (import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined)?.trim() ?? '',
    [],
  )
  const recaptchaSiteKey = useMemo(
    () => (recaptchaEnvSiteKey ? recaptchaEnvSiteKey : RECAPTCHA_TEST_SITE_KEY),
    [recaptchaEnvSiteKey],
  )
  const recaptchaVerifyEndpoint = useMemo(
    () => (import.meta.env.VITE_RECAPTCHA_VERIFY_ENDPOINT as string | undefined)?.trim(),
    [],
  )
  const recaptchaEnabled = Boolean(recaptchaSiteKey)

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

    const submission = buildSubmission(form)

    if (!submission.name || !submission.email || !submission.message) {
      onToast('Please fill all required fields.', 'error')
      return
    }

    if (!isValidEmail(submission.email)) {
      onToast('Please enter a valid email address.', 'error')
      return
    }

    if (recaptchaEnabled && !recaptchaToken) {
      onToast('Please complete reCAPTCHA verification.', 'error')
      return
    }

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined

    setIsSubmitting(true)
    try {
      if (recaptchaEnabled && recaptchaVerifyEndpoint && recaptchaToken) {
        const verification = await verifyRecaptchaToken(recaptchaToken, recaptchaVerifyEndpoint)
        if (!verification.success) {
          recaptchaRef.current?.reset()
          setRecaptchaToken(null)
          onToast('reCAPTCHA verification failed. Please try again.', 'error')
          return
        }
      }

      let delivery: DeliveryState = { delivered: false, channel: 'None', note: 'No delivery channel succeeded.' }
      if (!serviceId || !templateId || !publicKey) {
        delivery = await sendViaFormSubmit(submission)
      } else {
        try {
          const fullDetails = buildEmailDetails(submission)
          await emailjs.send(
            serviceId,
            templateId,
            {
              name: submission.name,
              email: submission.email,
              subject: submission.subject,
              message: fullDetails,
              full_details: fullDetails,
              original_message: submission.message,
              submitted_at: submission.submittedAt,
              submitted_at_formatted: new Date(submission.submittedAt).toLocaleString(),
              from_name: submission.name,
              from_email: submission.email,
              reply_to: submission.email,
              to_name: profile.name,
              to_email: profile.email,
              whatsapp: profile.whatsapp,
              recaptcha_token: recaptchaToken ?? '',
            },
            { publicKey },
          )
          delivery = {
            delivered: true,
            channel: 'EmailJS',
            note: 'Notification sent to your email using EmailJS.',
          }
        } catch {
          delivery = await sendViaFormSubmit(submission)
        }
      }

      setLastSubmission(submission)
      setLastDelivery(delivery)

      if (delivery.delivered) {
        onToast(`Details submitted and sent to you via ${delivery.channel}.`, 'success')
      } else {
        onToast('Details submitted, but notification delivery failed. Check setup/activation.', 'error')
      }

      setForm(initialFormState)
      recaptchaRef.current?.reset()
      setRecaptchaToken(null)
    } catch {
      onToast('Submission failed. Please try again.', 'error')
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

            {recaptchaEnabled && recaptchaSiteKey ? (
              <div className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-3">
                <p className="mb-2 text-xs text-emerald-100">Complete verification before submitting.</p>
                <div className="overflow-x-auto">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={recaptchaSiteKey}
                    onChange={(token) => setRecaptchaToken(token)}
                    onExpired={() => setRecaptchaToken(null)}
                    onErrored={() => {
                      setRecaptchaToken(null)
                      onToast('reCAPTCHA error occurred. Please retry.', 'error')
                    }}
                    theme="dark"
                  />
                </div>
              </div>
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

          {lastSubmission ? (
            <div className="mt-5 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-200">
                <CheckCircle2 className="h-4 w-4" />
                Details submitted successfully
              </p>
              <div className="mt-3 grid gap-2 text-xs text-emerald-100 sm:grid-cols-2">
                <p>
                  <span className="font-semibold">Name:</span> {lastSubmission.name}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {lastSubmission.email}
                </p>
                <p>
                  <span className="font-semibold">Subject:</span> {lastSubmission.subject}
                </p>
                <p>
                  <span className="font-semibold">Submitted:</span>{' '}
                  {new Date(lastSubmission.submittedAt).toLocaleString()}
                </p>
              </div>
              <p className="mt-2 text-xs text-emerald-100">
                <span className="font-semibold">Message:</span> {lastSubmission.message}
              </p>
              {lastDelivery ? (
                <p className="mt-2 text-xs text-emerald-100">
                  <span className="font-semibold">Delivery:</span>{' '}
                  {lastDelivery.delivered
                    ? `${lastDelivery.channel} - ${lastDelivery.note}`
                    : `Failed - ${lastDelivery.note}`}
                </p>
              ) : null}
            </div>
          ) : null}
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

          <a
            href={profile.website}
            target="_blank"
            rel="noreferrer"
            className="focusable glass-card hover-lift flex items-center gap-3 rounded-2xl p-4"
          >
            <span className="rounded-full border border-white/15 bg-white/10 p-2 text-emerald-300">
              <Globe className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-xs uppercase tracking-[0.12em] text-[var(--text-secondary)]">Website</span>
              <span className="text-sm font-medium text-[var(--text-primary)]">{formatWebsiteLabel(profile.website)}</span>
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  )
}
