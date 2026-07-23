/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#131313",
        surface: "#1C1C1C",
        "surface-elevated": "#252525",
        gold: "#C5A059",
        "gold-muted": "#7A6235",
        "gold-muted-2": "#C9A84C",
        "gold-muted-3": " #FFDEA5",
        "text-primary": "#FFFFFF",
        "text-secondary": "#888888",
        "text-muted": "#555555",
        border: "#2A2A2A",
        error: "#FFB4AB",
        "on-error": "#690005",
        "error-container": "#93000A",
      },
    },
  },
  plugins: [],
};
