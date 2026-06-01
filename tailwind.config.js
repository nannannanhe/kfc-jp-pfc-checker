/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4793d1',
          hover: '#3a7ab8',
        },
      },
    },
  },
  plugins: [],
};
