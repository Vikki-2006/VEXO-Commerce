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
        ivory: 'var(--canvas-bg)',
        warm: 'var(--warm-bg)',
        card: 'var(--surface-bg)',
        ink: 'var(--text-primary)',
        stone: 'var(--text-secondary)',
        muted: 'var(--text-muted)',
        sand: 'var(--border-color)',
        gold: {
          DEFAULT: 'var(--accent-gold)',
          hover: 'var(--accent-gold-hover)',
          light: 'var(--accent-gold-light)',
        },
        titanium: 'var(--titanium)',
        danger: '#D93838',
        success: '#1B7A4B',
      },
      borderRadius: {
        'xs': '4px',
        'sm': '6px',
        'md': '10px',
        'lg': '14px',
        'xl': '20px',
        '2xl': '28px',
      },
      boxShadow: {
        'subtle': 'var(--shadow-subtle)',
        'card': 'var(--shadow-card)',
        'modal': 'var(--shadow-modal)',
        'gold-glow': '0 0 20px rgba(197, 160, 89, 0.25)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['Cabinet Grotesk', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      screens: {
        'xs': '375px',
        '2xl': '1536px',
        '3xl': '1920px',
        '4k': '2560px',
      },
    },
  },
  plugins: [],
}
