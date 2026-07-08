/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#0D0D0D",
        surface: "#1A1A1A",
        "surface-elevated": "#222222",
        gold: "#C9A84C",
        "gold-muted": "#8A6E2F",
        "text-primary": "#F5F0E8",
        "text-secondary": "#888888",
        "text-muted": "#555555",
        border: "#2A2A2A",
      },
    },
  },
  plugins: [],
};
