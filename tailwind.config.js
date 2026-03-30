/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './lib/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'cv-primary': '#2563EB',
        'cv-secondary': '#3B82F6',
        'cv-accent': '#1D4ED8',
        'cv-tint': '#EFF6FF',
        'cv-tint-border': '#BFDBFE',
      },
    },
  },
  plugins: [],
}
