/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: '"Poppins", sans-serif',
        roboto: '"Roboto", sans-serif',
        acme: '"Acme", sans-serif',
      },
      colors: {
        primary: "#232E42",
        primaryDefault: "#1959AA",
        primaryRed: "#E62F55",
      },
    },
  },
  plugins: [
    daisyui,
    function ({ addUtilities }) {
      const newUtilties = {
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
      };

      addUtilities(newUtilties);
    },
    require("tailwind-scrollbar"),
  ],
};
