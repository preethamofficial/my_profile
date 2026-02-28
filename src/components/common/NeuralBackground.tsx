import { useEffect, useMemo, useState } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

interface NeuralBackgroundProps {
  theme: 'dark' | 'light'
}

export function NeuralBackground({ theme }: NeuralBackgroundProps) {
  const [particlesReady, setParticlesReady] = useState(false)

  useEffect(() => {
    let isMounted = true

    void initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      if (isMounted) {
        setParticlesReady(true)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  const colors = useMemo(
    () =>
      theme === 'dark'
        ? {
            particle: ['#06b6d4', '#a855f7', '#3b82f6'],
            links: '#5f7da6',
          }
        : {
            particle: ['#0ea5e9', '#2563eb', '#4f46e5'],
            links: '#7f9ac2',
          },
    [theme],
  )

  if (!particlesReady) {
    return <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden />
  }

  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
      <Particles
        id="neural-grid"
        className="h-full w-full"
        options={{
          fpsLimit: 60,
          fullScreen: { enable: false },
          detectRetina: true,
          particles: {
            number: { value: 28, density: { enable: true } },
            color: { value: colors.particle },
            shape: { type: 'circle' },
            opacity: { value: { min: 0.08, max: 0.28 } },
            size: { value: { min: 1, max: 2.8 } },
            links: {
              enable: true,
              distance: 170,
              color: colors.links,
              opacity: 0.2,
              width: 1,
            },
            move: {
              enable: true,
              speed: 0.35,
              direction: 'none',
              random: false,
              straight: false,
              outModes: { default: 'out' },
            },
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: 'grab' },
              resize: { enable: true },
            },
            modes: {
              grab: {
                distance: 160,
                links: { opacity: 0.42 },
              },
            },
          },
          background: { color: 'transparent' },
        }}
      />
    </div>
  )
}
