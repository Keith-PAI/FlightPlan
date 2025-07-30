/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // PAI Consulting Brand Colors
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2b92f9',
          600: '#033668',
          700: '#022447',
          800: '#1e3a8a',
          900: '#011629'
        },
        accent: {
          400: '#4ab8fd',
          500: '#2b92f9'
        },
        secondary: {
          100: '#b0e0fe',
          200: '#dcd9e1',
          300: '#f2f2f2'
        },
        
        // Aviation-specific colors
        aviation: {
          vfr: '#00cc00',
          mvfr: '#0066cc',
          ifr: '#cc6600',
          lifr: '#cc0000',
          critical: '#dc2626',
          high: '#ea580c',
          medium: '#d97706',
          low: '#65a30d'
        },

        // Night vision mode
        night: {
          primary: '#4a0000',
          accent: '#ff4444',
          background: '#1a0000',
          surface: '#2a0000',
          text: '#ff8888',
          'text-secondary': '#cc4444'
        }
      },
      
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Roboto Mono', 'monospace']
      },
      
      spacing: {
        'touch-sm': '40px',
        'touch-md': '48px',
        'touch-lg': '56px',
        'touch-xl': '64px'
      },
      
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 2s linear infinite'
      },

      transitionDuration: {
        'fast': '150ms',
        'normal': '250ms',
        'slow': '350ms'
      },

      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
}