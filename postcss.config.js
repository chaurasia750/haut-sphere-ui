module.exports = {
  plugins: {
    '@tailwindcss/postcss': {
      content: [
        'apps/**/src/**/*.{html,ts,jsx,tsx}',
        'libs/**/src/**/*.{html,ts,jsx,tsx}',
      ],
    },
  },
};
