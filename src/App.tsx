import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

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
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Suspense fallback={<AppLoader />}>
        <Routes>
          <Route path="/" element={<PortfolioPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
