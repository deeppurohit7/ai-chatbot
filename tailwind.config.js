/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#0a0a0b',
          surface: '#121216',
          card: '#16161c',
          cardHover: '#1c1c24',
          subtle: '#22222c',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(255, 255, 255, 0.16)',
        },
        ink: {
          primary: '#ededed',
          secondary: '#a1a1aa',
          tertiary: '#71717a',
          quaternary: '#52525b',
        },
        vermilion: {
          DEFAULT: '#ff331f',
          hover: '#e52c1a',
          glow: 'rgba(255, 51, 31, 0.45)',
          dim: 'rgba(255, 51, 31, 0.12)',
          subtle: 'rgba(255, 51, 31, 0.06)',
        }
      },
      boxShadow: {
        'ember-idle': '0 4px 20px rgba(255, 51, 31, 0.35)',
        'ember-hover': '0 8px 32px rgba(255, 51, 31, 0.6)',
        'obsidian-inner': 'inset 0 1px 1px rgba(255, 255, 255, 0.12), inset 0 -1px 1px rgba(0, 0, 0, 0.6)',
        'obsidian-hover': 'inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 10px 25px rgba(0, 0, 0, 0.5)',
        'orb-ambient': '0 4px 12px rgba(0, 0, 0, 0.4)',
        'orb-hover': '0 0 16px rgba(255, 51, 31, 0.35)',
        'lvl1': '0 2px 8px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.04)',
        'lvl2': '0 16px 36px -8px rgba(0, 0, 0, 0.75), 0 0 24px rgba(255, 51, 31, 0.12)',
        'lvl3': '0 25px 60px -15px rgba(0, 0, 0, 0.95), 0 0 1px 1px rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      animation: {
        'specular-sweep': 'specularSweep 3s cubic-bezier(0.16, 1, 0.3, 1) infinite',
        'subtle-pulse': 'subtlePulse 2s ease-in-out infinite',
      },
      keyframes: {
        specularSweep: {
          '0%': { transform: 'translateX(-150%) skewX(-12deg)' },
          '35%, 100%': { transform: 'translateX(250%) skewX(-12deg)' },
        },
        subtlePulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        }
      }
    },
  },
  plugins: [],
};