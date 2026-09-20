# A Preetham Reddy - Portfolio Website

Production-ready portfolio built with React + TypeScript + Vite, with live GitHub API data, EmailJS contact integration, rich animations, and GitHub Pages deployment automation.

## Live Website

- Short URL: `https://tinyurl.com/2xmp2kvf`
- Direct URL: `https://preethamofficial.github.io/my_profile/`

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
```

The contact form uses EmailJS and a hidden honeypot field for basic spam filtering, with no visible captcha.

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

## Live editor + cross-device sync

The site has an in-browser editor behind the **Edit Site** button (bottom-right).

- Username: `Preetham` — Password: `Punny@1331`
- Tabs: **Background** (wallpaper / custom image / brightness / blur / overlay / tab title), **Content** (hero name, title, summary, hero image, about, stat cards), **Experience** (add, edit, delete timeline entries).

### Making edits appear on every device

Edits publish to `public/site-settings.json` through the GitHub API:

1. Create a **fine-grained token**: `github.com/settings/personal-access-tokens/new`
   - Repository access: only `my_profile`
   - Permissions: **Contents → Read and write**
2. In the editor, paste the token into **CLOUD SYNC** (stored only on that device).
3. **PUSH TO LIVE** publishes immediately; leave **AUTO** on and every edit publishes ~8s after you stop typing.

Other devices pick changes up automatically: the site checks `raw.githubusercontent.com` (not the Pages copy) every 45s, on tab focus, and on reconnect — so no rebuild is required for sync. Cloud settings win whenever they are newer than the local copy; the device you edit on keeps its own changes.

Uploaded images are downscaled and re-encoded to WebP in the browser before publishing to keep the settings file small.

## Notes

- Resume file path used by buttons: `public/resume.pdf`
- Latest resume is uploaded and live from `public/resume.pdf`.
- GitHub data is fetched from `preethamofficial`.
- GitHub repository snapshot is auto-generated hourly for reliable project feed updates.
- `public/site-settings.json` holds the published editor state (`updatedAt: 0` means nothing has been published yet).
