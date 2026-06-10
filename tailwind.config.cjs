/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    // Scan every React source file so Tailwind keeps component classes in the build.
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      // Project fonts are defined as CSS variables in src/index.css.
      fontFamily: {
        body: ['var(--font-body)'],
        display: ['var(--font-display)'],
      },
    },
  },
  plugins: [],
};
