import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#004150",
          container: "#005a6e",
          fixed: "#b4ebff",
          "fixed-dim": "#8ed0e7",
        },
        secondary: {
          DEFAULT: "#9c4400",
          container: "#fd7613",
        },
        tertiary: {
          DEFAULT: "#00460e",
          container: "#076018",
        },
        surface: {
          DEFAULT: "#f7fafb",
          dim: "#d7dadb",
          variant: "#e0e3e4",
          container: "#ebeeef",
          "container-low": "#f1f4f5",
          "container-lowest": "#ffffff",
          "container-high": "#e5e9ea",
        },
        background: "#f7fafb",
        "on-surface": "#181c1d",
        "on-surface-variant": "#3f484c",
        outline: "#70787c",
        "outline-variant": "#bfc8cc",
        error: "#ba1a1a",
        "inverse-surface": "#2d3132",
        "inverse-primary": "#8ed0e7",
      },
      fontFamily: {
        headline: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #004150 0%, #005a6e 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
