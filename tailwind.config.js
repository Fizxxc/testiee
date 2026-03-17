/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        red: { brand: '#FF2D20' },
        purple: { brand: '#9333EA' },
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        pulse2: {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '.4' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        spin3d: {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-up':  'fadeUp 0.55s ease forwards',
        'fade-in':  'fadeIn 0.4s ease forwards',
        'float':    'float 4s ease-in-out infinite',
        'pulse2':   'pulse2 2s ease-in-out infinite',
        'shimmer':  'shimmer 1.6s linear infinite',
        'spin3d':   'spin3d 8s linear infinite',
      },
    },
  },
  plugins: [],
}
