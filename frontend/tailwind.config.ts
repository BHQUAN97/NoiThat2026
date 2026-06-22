import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // --- Material Design 3 Color Tokens ---
      colors: {
        'primary':                    'rgb(var(--color-primary) / <alpha-value>)',
        'primary-container':          'rgb(var(--color-primary-container) / <alpha-value>)',
        'on-primary':                 'rgb(var(--color-on-primary) / <alpha-value>)',
        'on-primary-container':       'rgb(var(--color-on-primary-container) / <alpha-value>)',

        'secondary':                  '#6B5C52',
        'secondary-container':        '#E9D9CB',
        'on-secondary':               '#FFFFFF',
        'on-secondary-container':     '#736155',

        'tertiary':                   '#2F5555',
        'tertiary-container':         '#496E6A',
        'on-tertiary':                '#FFFFFF',
        'on-tertiary-container':      '#B0D0DB',

        'error':                      '#BA1A1A',
        'error-container':            '#FFDAD6',
        'on-error':                   '#FFFFFF',
        'on-error-container':         '#93000A',

        'surface':                    '#FBF7F0',
        'surface-bright':             '#FFFDF8',
        'surface-dim':                '#E7DDD1',
        'surface-container-lowest':   '#FFFDF8',
        'surface-container-low':      '#F6EFE5',
        'surface-container':          '#EFE5D9',
        'surface-container-high':     '#E7DBCE',
        'surface-container-highest':  '#DED0C2',
        'surface-variant':            '#E8DDD2',
        'surface-tint':               '#8E7058',

        'on-surface':                 '#241E19',
        'on-surface-variant':         '#5F534B',
        'on-background':              '#241E19',

        'outline':                    '#9A887B',
        'outline-variant':            '#DDCEC0',

        'inverse-surface':            '#2A211B',
        'inverse-on-surface':         '#F7EFE6',
        'inverse-primary':            'rgb(var(--color-inverse-primary) / <alpha-value>)',

        'primary-fixed':              'rgb(var(--color-primary-fixed) / <alpha-value>)',
        'primary-fixed-dim':          'rgb(var(--color-primary-fixed-dim) / <alpha-value>)',
        'on-primary-fixed':           'rgb(var(--color-on-primary-fixed) / <alpha-value>)',
        'on-primary-fixed-variant':   'rgb(var(--color-on-primary-fixed-variant) / <alpha-value>)',

        'secondary-fixed':            '#F7DECF',
        'secondary-fixed-dim':        '#DAC2B4',
        'on-secondary-fixed':         '#261910',
        'on-secondary-fixed-variant': '#544339',

        'tertiary-fixed':             '#C8E8F3',
        'tertiary-fixed-dim':         '#ACCCD6',
        'on-tertiary-fixed':          '#001F27',
        'on-tertiary-fixed-variant':  '#2D4B54',

        'background':                 '#FBF7F0',
        'brand':                      'rgb(var(--color-primary) / <alpha-value>)',
        'primary-dark':               'rgb(var(--color-primary-dark) / <alpha-value>)',
        'border':                     '#DDCEC0',
        'danger':                     '#BA1A1A',

        // ── Status Palette (thống nhất admin) ──
        'success':                    '#15803D',
        'success-container':          '#DCFCE7',
        'on-success':                 '#FFFFFF',
        'on-success-container':       '#15803D',

        'warning':                    '#B45309',
        'warning-container':          '#FEF3C7',
        'on-warning':                 '#FFFFFF',
        'on-warning-container':       '#92400E',

        'info':                       '#1D4ED8',
        'info-container':             '#DBEAFE',
        'on-info':                    '#FFFFFF',
        'on-info-container':          '#1E40AF',

        'neutral-status':             '#6B7280',
        'neutral-container':          '#F3F4F6',
        'on-neutral-status':          '#FFFFFF',
        'on-neutral-container':       '#4B5563',
      },

      fontFamily: {
        'headline': ['"Noto Serif"', 'serif'],
        'body':     ['"Manrope"', 'system-ui', 'sans-serif'],
        'label':    ['"Manrope"', 'system-ui', 'sans-serif'],
        'serif':    ['"Noto Serif"', 'serif'],
      },

      fontSize: {
        'display-lg':  ['3.5rem',   { lineHeight: '1.1',  fontWeight: '700', letterSpacing: '0' }],
        'display-md':  ['2.5rem',   { lineHeight: '1.15', fontWeight: '700', letterSpacing: '0' }],
        'display-sm':  ['2.25rem',  { lineHeight: '1.2',  fontWeight: '700', letterSpacing: '0' }],
        'headline-lg': ['2rem',     { lineHeight: '1.25', fontWeight: '700', letterSpacing: '0' }],
        'headline-md': ['1.75rem',  { lineHeight: '1.3',  fontWeight: '700' }],
        'headline-sm': ['1.25rem',  { lineHeight: '1.35',  fontWeight: '700' }],
        'title-lg':    ['1.375rem', { lineHeight: '1.4',  fontWeight: '600' }],
        'title-md':    ['1rem',     { lineHeight: '1.5',  fontWeight: '600' }],
        'body-lg':     ['1.125rem', { lineHeight: '1.6',  fontWeight: '400' }],
        'body-md':     ['1rem',     { lineHeight: '1.5',  fontWeight: '400' }],
        'body-sm':     ['0.875rem', { lineHeight: '1.5',  fontWeight: '400' }],
        'label-lg':    ['0.75rem',  { lineHeight: '1.3',  fontWeight: '700', letterSpacing: '0.08em' }],
        'label-md':    ['0.625rem', { lineHeight: '1.3',  fontWeight: '700', letterSpacing: '0.08em' }],
        'label-sm':    ['0.6rem',   { lineHeight: '1.3',  fontWeight: '700', letterSpacing: '0.08em' }],
      },

      borderRadius: {
        'DEFAULT': '0.125rem',
        'sm':      '0.125rem',
        'md':      '0.25rem',
        'lg':      '0.25rem',
        'xl':      '0.5rem',
        '2xl':     '1rem',
        '3xl':     '1.5rem',
        'full':    '9999px',
      },

      boxShadow: {
        'ambient':       '0 24px 48px rgba(75, 53, 40, 0.06)',
        'ambient-sm':    '0 12px 24px rgba(75, 53, 40, 0.04)',
        'ambient-lg':    '0 32px 64px rgba(75, 53, 40, 0.08)',
        'ambient-up':    '0 -4px 24px rgba(75, 53, 40, 0.06)',
        'hero-cta':      '0 20px 40px rgba(75, 53, 40, 0.20)',
        'testimonial':   '0 24px 48px rgba(75, 53, 40, 0.06)',
        'bottom-nav':    '0 -4px 24px rgba(75, 53, 40, 0.06)',
        'header':        '0 12px 30px rgba(75, 53, 40, 0.08)',
        'cta':           '0 20px 40px rgba(75, 53, 40, 0.18)',
        'cta-hover':     '0 24px 52px rgba(75, 53, 40, 0.24)',
        'card':          '0 24px 48px rgba(75, 53, 40, 0.06)',
        'card-hover':    '0 32px 64px rgba(75, 53, 40, 0.10)',
        'float':         '0 16px 32px rgba(75, 53, 40, 0.16)',
      },

      maxWidth: {
        'content': '80rem',
        'bleed':   '1920px',
      },

      letterSpacing: {
        'label-wide': '0.08em',
        'label-wider': '0.1em',
      },

      transitionDuration: {
        '400': '400ms',
      },

      keyframes: {
        'custom-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%':      { transform: 'scale(1.05)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(24px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        'hero-reveal': {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'line-expand': {
          from: { transform: 'scaleX(0)' },
          to:   { transform: 'scaleX(1)' },
        },
        'subtle-zoom': {
          from: { transform: 'scale(1.08)' },
          to:   { transform: 'scale(1)' },
        },
        'mobile-menu': {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'widget-pulse':    'custom-pulse 3s infinite ease-in-out',
        'float':           'float 6s ease-in-out infinite',
        'fade-in':         'fade-in 0.5s ease forwards',
        'fade-in-up':      'fade-in-up 0.6s cubic-bezier(0.22,1,0.36,1) forwards',
        'slide-in-right':  'slide-in-right 0.5s cubic-bezier(0.22,1,0.36,1) forwards',
        'scale-in':        'scale-in 0.5s cubic-bezier(0.22,1,0.36,1) forwards',
        'hero-reveal':     'hero-reveal 0.9s cubic-bezier(0.22,1,0.36,1) forwards',
        'line-expand':     'line-expand 0.8s cubic-bezier(0.22,1,0.36,1) forwards',
        'subtle-zoom':     'subtle-zoom 1.2s ease forwards',
        'mobile-menu':     'mobile-menu 0.25s ease forwards',
        'slide-up':        'slide-up 0.25s cubic-bezier(0.22,1,0.36,1) forwards',
        'pulse-soft':      'custom-pulse 3s infinite ease-in-out',
      },

      aspectRatio: {
        '4/5': '4 / 5',
        '3/4': '3 / 4',
      },
    },
  },
  plugins: [],
}

export default config
