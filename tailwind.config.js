/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      thin: "850px",
      medium: "1000px",
      large: "1500px",
    },
  },
  plugins: [],
  darkMode: "class",
};
