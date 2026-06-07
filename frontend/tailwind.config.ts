import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';

export default {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        // Fundos e superfícies
        gray: {
          base:     '#0d0d0d',
          surface:  '#1a1a1a',
          elevated: '#242424',
          subtle:   '#2e2e2e',
        },
        // Vermelhos táticos — ação, perigo, destaque
        red: {
          strong: '#c0392b',
          mid:    '#e74c3c',
          muted:  '#7d2a22',
          subtle: '#3d1a17',
        },
        // Status vitais
        status: {
          hp:          '#4caf79',
          'hp-low':    '#f59e0b',
          'hp-critical': 'var(--color-red-strong)',
          energy:      '#60a5fa',
          condition:   '#9b7fd4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        xs:   ['0.75rem',  { lineHeight: '1.25' }],  // 12px
        sm:   ['0.875rem', { lineHeight: '1.5'  }],  // 14px
        base: ['1rem',     { lineHeight: '1.5'  }],  // 16px
        lg:   ['1.25rem',  { lineHeight: '1.5'  }],  // 20px
        xl:   ['1.5rem',   { lineHeight: '1.25' }],  // 24px
      },
      fontWeight: {
        normal:   '400',
        medium:   '500',
        semibold: '600',
        // bold (700+) excluído intencionalmente
      },
      spacing: {
        xs:  '0.25rem',  //  4px
        sm:  '0.5rem',   //  8px
        md:  '1rem',     // 16px
        lg:  '1.5rem',   // 24px
        xl:  '2rem',     // 32px
        '2xl': '3rem',   // 48px
      },
      borderRadius: {
        DEFAULT: '0.25rem',  //  4px — padrão global
        md:      '0.5rem',   //  8px — cards
        full:    '9999px',   // pílulas
      },
      borderColor: {
        DEFAULT: '#2e2e2e',
        strong:  '#444444',
      },
      boxShadow: {
        // Sombras desabilitadas — separação visual via bordas e cor de fundo
        none: 'none',
      },
    },
  },
  plugins: [forms],
} satisfies Config;