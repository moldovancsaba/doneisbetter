/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'scale-up': 'scaleUp 0.2s ease-out',
        'scale-down': 'scaleDown 0.2s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'bounce-sm': 'bounceSm 1s infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleDown: {
          '0%': { transform: 'scale(1.05)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceSm: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      fontFamily: {
        sans: ['Inter var', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    function ({ addUtilities }) {
      addUtilities({
        '.text-shadow-sm': {
          'text-shadow': '0 1px 2px rgba(0, 0, 0, 0.05)',
        },
        '.text-shadow': {
          'text-shadow': '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow-lg': {
          'text-shadow': '0 4px 8px rgba(0, 0, 0, 0.15)',
        },
      });
    },
  ],
}
