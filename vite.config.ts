import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? ''
const isGithubPagesBuild = process.env.GITHUB_ACTIONS === 'true'
const isUserOrOrgSite = repoName.endsWith('.github.io')
const base = isGithubPagesBuild && repoName && !isUserOrOrgSite ? `/${repoName}/` : '/'

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ['framer-motion'],
          particles: ['@tsparticles/react', '@tsparticles/slim'],
          charts: ['recharts'],
          icons: ['lucide-react', 'react-icons'],
        },
      },
    },
  },
})
