/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          cyan: '#06b6d4',
          purple: '#a855f7',
          blue: '#3b82f6',
          ember: '#ff2a2a',
          emberSoft: '#ff7878',
        },
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        ember: '0 24px 60px -24px rgba(255, 42, 42, 0.55), 0 0 0 1px rgba(255, 42, 42, 0.22)',
        'ember-lg': '0 30px 90px -30px rgba(255, 42, 42, 0.7), 0 0 44px -10px rgba(255, 42, 42, 0.35)',
        deep: '0 40px 110px -40px rgba(0, 0, 0, 0.95), 0 20px 50px -30px rgba(255, 42, 42, 0.25)',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(6, 182, 212, 0.55)' },
          '70%': { boxShadow: '0 0 0 14px rgba(6, 182, 212, 0)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        emberBreathe: {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.06)' },
        },
        shadowDrift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(3%, -4%, 0) scale(1.08)' },
        },
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.2s infinite',
        'float-slow': 'floatSlow 4.5s ease-in-out infinite',
        'ember-breathe': 'emberBreathe 5s ease-in-out infinite',
        'shadow-drift': 'shadowDrift 16s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
