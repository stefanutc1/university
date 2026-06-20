/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#090d16",
        surface: "#121826",
        surfaceElevated: "#1b2336",
        primary: "#3b82f6",
        primaryDark: "#1d4ed8",
        accent: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
        textPrimary: "#f3f4f6",
        textSecondary: "#9ca3af",
        borderDark: "#243049"
      }
    },
  },
  plugins: [],
};
