/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          100: "#ffffff",
          200: "#c9d3c4",
          300: "#5ab02d",
          400: "#dceadb",
          500: "#cf4949",
          600: "#f0f0f0",
        },
        txt: {
          100: "#000000",
          200: "#898080",
          300: "#ffffff",
        },
      },
    },
  },
  plugins: [],
};
