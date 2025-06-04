/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // adjust if your folders differ
  ],
  theme: {
    extend: {
      colors: {
        // You can add custom named colors here if needed
      },
      borderRadius: {
        sm: 'calc(var(--radius) - 4px)',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 4px)',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), // you are using tw-animate-css
  ],
};
