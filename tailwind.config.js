/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './apps/*/src/**/*.{html,ts,scss}',
    './libs/*/src/**/*.{html,ts,scss}',
    './libs/shared/ui/src/**/*.{html,ts,scss}',
    './libs/shared/i18n/src/**/*.{html,ts,scss}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};