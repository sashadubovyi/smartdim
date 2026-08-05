/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Fresh water-blue accent palette.
        brand: {
          50: '#eef7fd',
          100: '#d5ebfb',
          200: '#aed7f6',
          300: '#7cbdee',
          400: '#4a9fe2',
          500: '#2686d4',
          600: '#1f6fbb',
          700: '#1b5a97',
          800: '#184a7c',
          900: '#163f68',
          DEFAULT: '#2686d4',
        },
        // Very light blue page tints + soft blue decorations.
        mint: {
          50: '#f2f9ff',
          100: '#e6f3ff',
          200: '#cbe6fc',
          300: '#a9d5f7',
        },
        sage: {
          200: '#cddffb',
          300: '#aeccf3',
          400: '#8fb6e6',
        },
        ink: {
          DEFAULT: '#182a3e',
          soft: '#48586b',
          muted: '#8fa0b3',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.75rem',
      },
      boxShadow: {
        soft: '0 18px 40px -24px rgba(24, 42, 62, 0.32)',
        card: '0 24px 60px -30px rgba(24, 42, 62, 0.42)',
        float: '0 12px 30px -8px rgba(31, 111, 187, 0.5)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};
