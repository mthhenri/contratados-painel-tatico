import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';

export default {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        red: {
          DEFAULT: '#c0392b',
          hover:   '#a93226',
          light:   '#f9ecea',
          border:  '#e8b4ae',
          muted:   '#7d2a22',
        },
        gray: {
          base:           '#f5f4f2',
          surface:        '#ffffff',
          'surface-2':    '#f0efed',
          border:         '#e2e0dc',
          'border-strong':'#c8c5bf',
        },
        black: {
          DEFAULT: '#111111',
          '2':     '#1a1a1a',
          '3':     '#1e1e1e',
          border:  '#2a2a2a',
        },
        text: {
          primary:   '#1a1a1a',
          secondary: '#5a5855',
          muted:     '#9a9794',
          light:     '#f0f0f0',
        },
        hp: {
          ok:  '#2ecc71',
          low: '#c0392b',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem',  { lineHeight: '1.25' }],  // 10px
        xs:    ['0.6875rem', { lineHeight: '1.25' }],  // 11px
        sm:    ['0.75rem',   { lineHeight: '1.5'  }],  // 12px
        md:    ['0.8125rem', { lineHeight: '1.5'  }],  // 13px
        base:  ['0.875rem',  { lineHeight: '1.5'  }],  // 14px
        lg:    ['1.25rem',   { lineHeight: '1.5'  }],  // 20px
      },
      fontWeight: {
        normal:   '400',
        medium:   '500',
        semibold: '600',
        // bold (700+) excluído intencionalmente
      },
      spacing: {
        xs:    '0.25rem',  //  4px
        sm:    '0.5rem',   //  8px
        md:    '1rem',     // 16px
        lg:    '1.5rem',   // 24px
        xl:    '2rem',     // 32px
        '2xl': '3rem',     // 48px
      },
      borderRadius: {
        sm:   '3px',
        DEFAULT: '4px',
        md:   '4px',
        lg:   '6px',
        xl:   '8px',
        // Sem valores acima de 8px
      },
      borderColor: {
        DEFAULT:       '#e2e0dc',
        strong:        '#c8c5bf',
        dark:          '#2a2a2a',
        'dark-2':      '#333333',
      },
      screens: {
        sm: '480px',
        md: '768px',
        lg: '1024px',
      },
      boxShadow: {
        none: 'none',
      },
    },
  },
  plugins: [forms],
} satisfies Config;
