import { lazy, Suspense, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { CapsuleIntro } from '@/components/intro/CapsuleIntro'
import { profile } from '@/data/portfolio'

const PortfolioPage = lazy(async () => import('@/pages/PortfolioPage'))

function AppLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="glass-card rounded-2xl px-6 py-4">
        <p className="text-sm font-medium text-[var(--text-secondary)]">Loading portfolio...</p>
      </div>
    </div>
  )
}

export default function App() {
  const [hasEnteredExperience, setHasEnteredExperience] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return params.has('tour') || params.has('skipIntro')
  })

  useEffect(() => {
    document.body.classList.toggle('intro-active', !hasEnteredExperience)

    return () => {
      document.body.classList.remove('intro-active')
    }
  }, [hasEnteredExperience])

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AnimatePresence mode="wait">
        {!hasEnteredExperience ? (
          <CapsuleIntro
            key="capsule-intro"
            brandName={profile.name}
            tagline="Gen AI & AI Engineer"
            destinationLabel="Tap to Enter"
            accentHex="#3b82f6"
            onEnter={() => {
              setHasEnteredExperience(true)
            }}
          />
        ) : (
          <motion.div
            key="portfolio-app"
            initial={{ opacity: 0, scale: 0.985, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
          >
            <Suspense fallback={<AppLoader />}>
              <Routes>
                <Route path="/" element={<PortfolioPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </BrowserRouter>
  )
}
