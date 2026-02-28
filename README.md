# A Preetham Reddy - Portfolio Website

Production-ready portfolio built with React + TypeScript + Vite, with live GitHub API data, EmailJS contact integration, rich animations, and GitHub Pages deployment automation.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS 3
- Framer Motion
- React Router
- React Scroll
- Typed.js
- tsParticles
- Lucide React + React Icons
- Recharts
- EmailJS
- GitHub Actions + GitHub Pages

## Run Locally

```bash
npm install
npm run dev
```

Build production bundle:

```bash
npm run build
```

## Environment Variables

Create `.env.local`:

```bash
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_RECAPTCHA_SITE_KEY=your_google_recaptcha_site_key
VITE_RECAPTCHA_VERIFY_ENDPOINT=https://your-worker-domain/verify
```

`VITE_RECAPTCHA_VERIFY_ENDPOINT` enables strict server-side token verification.

## reCAPTCHA Verification Endpoint (Free)

Use Cloudflare Workers (free tier) for backend token verification:

1. Deploy [workers/recaptcha-verify-worker.js](./workers/recaptcha-verify-worker.js).
2. Set worker secrets/vars:
   - `RECAPTCHA_SECRET_KEY` = your Google reCAPTCHA secret key
   - `ALLOWED_ORIGIN` = `https://preethamofficial.github.io`
3. Set frontend `.env.local`:
   - `VITE_RECAPTCHA_VERIFY_ENDPOINT=https://<your-worker-url>`

## Deployment (Free) - GitHub Pages

1. Push this project to GitHub (branch: `main`).
2. In repository settings, enable:
   - `Settings -> Pages -> Build and deployment -> Source: GitHub Actions`
3. The workflow at `.github/workflows/deploy.yml` deploys automatically on every push to `main`.

### Custom Domain (Optional)

1. Add repository variable:
   - `Settings -> Secrets and variables -> Actions -> Variables -> New repository variable`
   - Name: `CUSTOM_DOMAIN`
   - Value: your domain (example: `preethamreddy.dev`)
2. Configure DNS records with your domain provider.
3. On next deployment, workflow writes `CNAME` to `dist/` automatically.

## Notes

- Resume file path used by buttons: `public/resume.pdf`
- Latest resume is uploaded and live from `public/resume.pdf`.
- GitHub data is fetched from `preethamofficial`.
