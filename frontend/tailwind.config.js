/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fff1f2',
          100: '#ffe0e2',
          200: '#ffc5c8',
          300: '#ff9ba0',
          400: '#ff6169',
          500: '#C8102E',
          600: '#b00d27',
          700: '#940a21',
          800: '#7a0b1e',
          900: '#65101e',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          150: '#edf1f7',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          850: '#172033',
          900: '#0f172a',
          950: '#080e1a',
        },
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: 0, transform: 'translateX(-12px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.4s ease both',
        slideIn: 'slideIn 0.3s ease both',
        scaleIn: 'scaleIn 0.25s ease both',
      },
    },
  },
  plugins: [],
};
