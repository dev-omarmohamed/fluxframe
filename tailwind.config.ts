import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B0B0F",
          70: "rgba(11, 11, 15, 0.70)",
          10: "rgba(11, 11, 15, 0.10)",
        },
        cloud: {
          DEFAULT: "#F5F7FA",
          70: "rgba(245, 247, 250, 0.70)",
        },
        violet: {
          DEFAULT: "#7F00FF",
        },
        lime: {
          DEFAULT: "#C6FF00",
        },
        danger: {
          DEFAULT: "#FF3B30",
        },
        white: {
          DEFAULT: "#FFFFFF",
          10: "rgba(255, 255, 255, 0.10)",
          5: "rgba(255, 255, 255, 0.05)",
        },
      },
      fontFamily: {
        display: ["var(--font-tajawal)", "Tajawal", "var(--font-poppins)", "Poppins", "sans-serif"],
        sans: ["var(--font-tajawal)", "Tajawal", "var(--font-poppins)", "Poppins", "sans-serif"],
        mono: ["var(--font-tajawal)", "Tajawal", "var(--font-poppins)", "Poppins", "sans-serif"], // strictly NO mono font
      },
      borderRadius: {
        "2rem": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
