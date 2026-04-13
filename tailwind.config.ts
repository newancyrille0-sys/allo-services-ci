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
        // === COULEURS PRINCIPALES ALLO SERVICES CI ===
        
        // Primaire (Sarcelle) - Titres, boutons, liens
        primary: {
          DEFAULT: "#004150",           // HSL(191, 100%, 16%) - Mode clair
          light: "#8ed0e7",             // HSL(193, 60%, 73%) - Mode sombre
          container: "#005a6e",         // Variante plus claire
          fixed: "#b4ebff",             // Pour fond fixe
          "fixed-dim": "#8ed0e7",       // Pour fond fixe assombri
        },
        
        // Secondaire (Orange) - Accents, badges urgents
        secondary: {
          DEFAULT: "#9c4400",           // HSL(25, 100%, 31%) - Mode clair
          light: "#fd7613",             // HSL(25, 98%, 53%) - Mode sombre / vibrant
          container: "#fd7613",         // Variante
        },
        
        // Succès (Vert foncé) - Badges vérifiés
        success: {
          DEFAULT: "#0a4f1a",           // HSL(140, 60%, 15%)
          light: "#076018",             // Variante plus claire
          container: "#10b981",         // Vert standard pour badges
        },
        
        // Tertiaire (alias pour rétrocompatibilité)
        tertiary: {
          DEFAULT: "#0a4f1a",           // Même que success
          container: "#076018",
        },
        
        // Avertissement (Orange vibrant) - Alertes
        warning: {
          DEFAULT: "#fd7613",           // HSL(25, 98%, 53%)
          container: "#fed7aa",         // Fond avertissement
        },
        
        // Erreur
        error: {
          DEFAULT: "#ba1a1a",
          container: "#fecaca",
        },
        
        // Surfaces
        surface: {
          DEFAULT: "#f7fafb",           // HSL(195, 14%, 97%) - Mode clair
          dim: "#d7dadb",
          variant: "#e0e3e4",
          container: "#ebeeef",
          "container-low": "#f1f4f5",
          "container-lowest": "#ffffff",
          "container-high": "#e5e9ea",
        },
        
        // Arrière-plan
        background: "#f7fafb",          // HSL(195, 14%, 97%) - Mode clair
        "background-dark": "#0d1117",   // HSL(210, 29%, 7%) - Mode sombre
        
        // Premier plan (texte principal)
        foreground: "#181c1d",          // HSL(192, 9%, 10%) - Mode clair
        "foreground-dark": "#e6edf3",   // Mode sombre
        
        // Texte
        "on-surface": "#181c1d",
        "on-surface-variant": "#3f484c",
        
        // Contours
        outline: "#70787c",
        "outline-variant": "#bfc8cc",
        
        // Inversé (pour mode sombre)
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
        "premium-gradient": "linear-gradient(135deg, #001e40 0%, #003366 100%)",
        "primary-gradient": "linear-gradient(135deg, #004150 0%, #005a6e 100%)",
        "secondary-gradient": "linear-gradient(135deg, #9c4400 0%, #fd7613 100%)",
      },
      
      boxShadow: {
        "ambient": "0 8px 24px rgba(17, 29, 35, 0.06)",
        "ambient-lg": "0 12px 32px rgba(17, 29, 35, 0.08)",
      },
      
      backdropBlur: {
        "glass": "20px",
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
