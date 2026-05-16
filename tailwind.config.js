/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './apps/*/src/**/*.{html,ts,scss}',
    './libs/*/src/**/*.{html,ts,scss}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};