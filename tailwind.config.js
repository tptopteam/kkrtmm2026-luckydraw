/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0B0F19',
          card: '#151C2C',
          border: '#232D42',
          primary: '#10B981', // emerald green for running vibe
          gold: '#F59E0B',
          accent: '#06B6D4',
        }
      },
      fontFamily: {
        sans: ['Prompt', 'Kanit', 'sans-serif'],
        mono: ['Outfit', 'monospace']
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite',
        'bounce-short': 'bounceShort 0.5s ease-in-out',
        'reel-spin': 'reelSpin 0.1s linear infinite'
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(16, 185, 129, 0.8)' }
        },
        bounceShort: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.08)' }
        }
      }
    },
  },
  plugins: [],
}
