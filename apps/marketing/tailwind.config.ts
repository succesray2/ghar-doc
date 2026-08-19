import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      colors: {
        bg: {
          DEFAULT: '#F8FAFC',
          soft: '#F1F5F7',
        },
        navy: {
          600: '#1D4A79',
          700: '#16375E',
          900: '#0B2340',
        },
        teal: {
          100: '#E3F1EF',
          500: '#56A39D',
          600: '#3F8E88',
        },
        sage: {
          100: '#E8F3E9',
          600: '#5F9F6B',
        },
        ink: {
          400: '#7C8896',
          600: '#435160',
          900: '#14202B',
        },
        line: '#E4E9EE',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(11, 35, 64, 0.04), 0 8px 24px rgba(11, 35, 64, 0.06)',
      },
    },
  },
  plugins: [],
} satisfies Config;
