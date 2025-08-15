/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'atlan-blue': {
          DEFAULT: '#2960d4',
          hover: '#1e4ba8',
          light: '#e0ecfe',
          50: '#e8f0ff',
          100: '#c5dafe',
          200: '#a0c2fd',
          300: '#79a9fc',
          400: '#5690fb',
          500: '#3377fa',
          600: '#2960d4',
          700: '#1e4ba8',
          800: '#14367c',
          900: '#0a2150',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}