// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Keep content paths
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Remove theme extensions for font
  theme: {
    extend: {},
  },
  plugins: [],
};
