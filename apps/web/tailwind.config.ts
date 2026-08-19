import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9f6',
          100: '#dbf0e8',
          500: '#0f9d68',
          600: '#0c7f54',
          700: '#0a6644',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
