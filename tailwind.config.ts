import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        kora: {
          dark: "#0a0f1e",
          mid: "#0d1525",
          green: "#28a745",
          "green-dark": "#1e7e34",
          gold: "#c9a84c",
          alert: "#ff4444",
          teal: "#5adb7e",
          surface: "#f8fafc",
        },
      },
      fontFamily: {
        arabic: ["var(--font-noto-arabic)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-bebas)", "var(--font-cairo)", "system-ui", "sans-serif"],
        cairo: ["var(--font-cairo)", "var(--font-noto-arabic)", "system-ui", "sans-serif"],
      },
    },
  },
};

export default config;
