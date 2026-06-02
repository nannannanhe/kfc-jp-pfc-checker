/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a6bbc',
          hover: '#155a9e',
        },
      },
    },
  },
  plugins: [],
};
