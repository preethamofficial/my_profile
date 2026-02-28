const RESUME_FILE_NAME = 'A-Preetham-Reddy-Resume.pdf'
const RESUME_VERSION = '20260228'

function buildPrimaryResumeUrl(): string {
  return `${import.meta.env.BASE_URL}resume.pdf?v=${RESUME_VERSION}`
}

function buildFallbackResumeUrl(): string {
  return `https://preethamofficial.github.io/my_profile/resume.pdf?v=${RESUME_VERSION}`
}

function hasPdfSignature(buffer: ArrayBuffer): boolean {
  const signatureBytes = new Uint8Array(buffer.slice(0, 5))
  const signature = new TextDecoder().decode(signatureBytes)
  return signature === '%PDF-'
}

function triggerDownloadFromBlob(blob: Blob) {
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = RESUME_FILE_NAME
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(objectUrl)
}

function openInNewTab(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')
}

export async function downloadResumePdf() {
  const urls = Array.from(new Set([buildPrimaryResumeUrl(), buildFallbackResumeUrl()]))

  for (const url of urls) {
    try {
      const response = await fetch(url, { cache: 'no-store' })
      if (!response.ok) {
        continue
      }

      const rawBlob = await response.blob()
      const rawBuffer = await rawBlob.arrayBuffer()
      if (!hasPdfSignature(rawBuffer)) {
        continue
      }

      const pdfBlob = rawBlob.type === 'application/pdf' ? rawBlob : new Blob([rawBuffer], { type: 'application/pdf' })
      triggerDownloadFromBlob(pdfBlob)
      return
    } catch {
      // Try the next URL candidate.
    }
  }

  openInNewTab(buildFallbackResumeUrl())
}
