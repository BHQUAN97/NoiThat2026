import type { Config } from 'tailwindcss'

// NoiThat2026 — "Craft & Trust" theme cho Nội Thất Duy Mạnh
const config: Config = {
  content: [
    './frontend/src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Brand Primary: Warm Amber (thủ công, tin cậy) ──────────
        brand: {
          50:  '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',   // primary CTA
          800: '#9A3412',
          900: '#7C2D12',
          DEFAULT: '#B45309', // amber-700 — main brand
        },

        // ── Neutral: Charcoal Stone (cao cấp) ──────────────────────
        stone: {
          50:  '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917', // charcoal — text, dark backgrounds
          950: '#0C0A09',
          DEFAULT: '#1C1917',
        },

        // ── Accent: Warm Cream (nền nhẹ, luxury feel) ──────────────
        cream: {
          50:  '#FEFCE8',
          100: '#FEF9C3',
          200: '#FEF08A',
          300: '#FDE047',
          DEFAULT: '#FBF5EB', // cream background
        },

        // ── Success / Error (form states) ──────────────────────────
        success: '#15803D',
        danger:  '#DC2626',

        // ── Semantic aliases ────────────────────────────────────────
        primary: '#B45309',
        'primary-dark': '#92400E',
        'primary-light': '#FBBF24',
        background: '#FAFAF9',
        surface: '#FFFFFF',
        'on-surface': '#1C1917',
        muted: '#78716C',
        border: '#E7E5E4',
      },

      fontFamily: {
        // Heading: Merriweather — gợi cảm thủ công truyền thống
        'heading': ['"Merriweather"', 'Georgia', 'serif'],
        // Body: Inter — dễ đọc, hiện đại
        'body':    ['"Inter"', 'system-ui', 'sans-serif'],
        'sans':    ['"Inter"', 'system-ui', 'sans-serif'],
        'serif':   ['"Merriweather"', 'Georgia', 'serif'],
      },

      fontSize: {
        'display':     ['3.5rem',  { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.02em' }],
        'h1':          ['2.5rem',  { lineHeight: '1.2', fontWeight: '700' }],
        'h2':          ['2rem',    { lineHeight: '1.25', fontWeight: '700' }],
        'h3':          ['1.5rem',  { lineHeight: '1.3', fontWeight: '600' }],
        'h4':          ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg':     ['1.125rem',{ lineHeight: '1.6', fontWeight: '400' }],
        'body-md':     ['1rem',    { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm':     ['0.875rem',{ lineHeight: '1.5', fontWeight: '400' }],
        'label':       ['0.75rem', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '0.08em' }],
        'label-sm':    ['0.625rem',{ lineHeight: '1.3', fontWeight: '600', letterSpacing: '0.12em' }],
      },

      borderRadius: {
        DEFAULT: '0.25rem',
        sm:      '0.125rem',
        md:      '0.375rem',
        lg:      '0.5rem',
        xl:      '0.75rem',
        '2xl':   '1rem',
        full:    '9999px',
      },

      boxShadow: {
        card:    '0 2px 12px rgba(28, 25, 23, 0.08)',
        'card-hover': '0 8px 24px rgba(28, 25, 23, 0.14)',
        cta:     '0 4px 16px rgba(180, 83, 9, 0.35)',
        'cta-hover': '0 6px 24px rgba(180, 83, 9, 0.5)',
        float:   '0 4px 20px rgba(28, 25, 23, 0.2)',
        header:  '0 2px 16px rgba(28, 25, 23, 0.1)',
      },

      maxWidth: {
        content: '80rem',
        wide:    '96rem',
      },

      transitionDuration: {
        '250': '250ms',
        '400': '400ms',
      },

      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%':      { transform: 'scale(1.04)' },
        },
      },
      animation: {
        'fade-up':    'fade-up 0.5s ease forwards',
        'pulse-soft': 'pulse-soft 2.5s infinite ease-in-out',
      },

      aspectRatio: {
        '4/3':  '4 / 3',
        '16/9': '16 / 9',
        '3/2':  '3 / 2',
        '1/1':  '1 / 1',
      },
    },
  },
  plugins: [],
}

export default config
