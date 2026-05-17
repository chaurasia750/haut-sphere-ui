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
    extend: {
      colors: {
          brand: {
           50: '#FFF7CC',
           100: '#FFEF99',
           200: '#FFE766',
           300: '#FFDF33',
           400: '#FFD700',
           500: '#FFD000',
           600: '#F0C000',
           700: '#D4A800',
           800: '#B89000',
           900: '#9C7800',
         },
      },
    },
  },
  plugins: [],
};