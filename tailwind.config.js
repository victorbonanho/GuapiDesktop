/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      colors: {
        purple: "#7557E9",
        red: "#DC3545",
        lightBackground: "#F2F5F3",
        lightBoxBackground: "#FFFFFF",
        darkBackground: "#1E1E1E",
        darkBoxBackground: "#232323",
      },
    },
  },
  plugins: [],
};
