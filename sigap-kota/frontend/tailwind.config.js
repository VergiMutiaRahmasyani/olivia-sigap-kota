/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A6B4A',
          50:  '#F0FAF5',
          100: '#D6F0E4',
          200: '#A8DDCA',
          300: '#6DC4A5',
          400: '#3DAB83',
          500: '#1A6B4A',
          600: '#155A3E',
          700: '#0F4530',
          800: '#0A2E20',
          900: '#051810',
        },
        cream: {
          DEFAULT: '#F5F0E8',
          50:  '#FDFCF9',
          100: '#F5F0E8',
          200: '#EBE3D2',
          300: '#D9CFBA',
        },
        danger: '#DC2626',
        warning: '#D97706',
        info: '#0369A1',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}