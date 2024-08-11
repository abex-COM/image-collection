/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  darkMode: "class", // Ensure this is inside the export default object
  plugins: [require("daisyui")],
};
