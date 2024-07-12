/** @type {import('tailwindcss').Config} */
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
    function({addUtilities}){
      const newUtilties ={
        ".no-scrollbar::-webkit-scrollbar":{
          display:"none"
        },
        ".no-scrollbar":{
          "-ms-overflow-style":"none",
          "scrollbar-width":"none",
        },
      };

      addUtilities(newUtilties)
    }
  ],
};
