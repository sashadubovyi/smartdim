/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep sage-teal accent from the design reference.
        brand: {
          50: '#eef4f1',
          100: '#d6e4dd',
          200: '#aecabd',
          300: '#82ab9a',
          400: '#5c8a77',
          500: '#457566',
          600: '#3a6154',
          700: '#2f4d44',
          800: '#273f38',
          900: '#1f322d',
          DEFAULT: '#3a6154',
        },
        // Light mint page background + soft sage decorations.
        mint: {
          50: '#f4faf1',
          100: '#e7f4e2',
          200: '#cfe9c6',
          300: '#b6dca9',
        },
        sage: {
          200: '#cddccb',
          300: '#b3c9af',
          400: '#9bb896',
        },
        ink: {
          DEFAULT: '#1f2a26',
          soft: '#4a5a53',
          muted: '#98a69f',
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
        soft: '0 18px 40px -24px rgba(31, 50, 45, 0.35)',
        card: '0 24px 60px -30px rgba(31, 50, 45, 0.45)',
        float: '0 12px 30px -8px rgba(47, 77, 68, 0.55)',
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
