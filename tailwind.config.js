/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit", // Just-in-Time mode to make the build time much faster
  darkMode: "media", // or remove this line if darkMode is not used
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/**/*.html"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#e53974",
        },
        secondary: {
          DEFAULT: "#9747FF",
          dark: "#5A328F",
        },
        black: {
          DEFAULT: "#555555",
        },
        background: {
          4: "#424867",
          3: "#353a55",
          2: "#1E2235",
          1: "#1A1D2D",
        },
        neutral: {
          light: "#dcdef3",
          DEFAULT: "#ABADC6",
          dark: "#7d7e89",
        },
        warning: {
          DEFAULT: "#EA4335",
        },
        yellow: {
          DEFAULT: "#FBBC05",
        },
      },
    },
  },
  plugins: [],
};
