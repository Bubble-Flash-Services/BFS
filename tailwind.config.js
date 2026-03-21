/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1F3C88',
          blue: '#2952A3',
          gold: '#FFB400',
          'navy-light': '#EEF2FF',
          'gold-light': '#FFF8E1',
        },
      },
    },
  },
  plugins: [],
};