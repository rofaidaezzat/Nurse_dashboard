/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sky: {
          50: '#E6F4FA',
          100: '#CCE9F5',
          200: '#99D3EB',
          300: '#66BCE1',
          400: '#33A6D7',
          500: '#0093D3',
          600: '#007CBE',
          700: '#00659B',
          800: '#004E78',
          900: '#003754',
          950: '#00263D',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
