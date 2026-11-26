/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ine: {
          navy: '#0F2C59',
          cyan: '#00A8E8',
          bg: '#F8FAFC',
        }
      },
      fontFamily: {
        sans: ['"Ubuntu Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
