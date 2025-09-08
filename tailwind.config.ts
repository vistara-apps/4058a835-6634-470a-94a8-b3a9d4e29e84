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
        // PRD Design System Colors
        bg: "hsl(220 20% 10%)",
        accent: "hsl(35 90% 60%)",
        primary: "hsl(230 70% 50%)",
        surface: "hsl(220 20% 15%)",
        "text-primary": "hsl(0 0% 95%)",
        "text-secondary": "hsl(0 0% 70%)",
        // Neon colors for gaming aesthetic
        "neon-blue": "#00d4ff",
        "neon-purple": "#8000ff",
        "neon-pink": "#ff0080",
        // Legacy colors for compatibility
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
      },
      borderRadius: {
        lg: "12px", // PRD lg radius
        md: "8px",  // PRD md radius
        sm: "4px",  // PRD sm radius
      },
      spacing: {
        sm: "8px",  // PRD sm spacing
        md: "16px", // PRD md spacing
        lg: "24px", // PRD lg spacing
      },
      boxShadow: {
        card: "0 4px 12px hsla(0 0% 0% / 0.20)", // PRD card shadow
        "neon-blue": "0 0 20px rgba(0, 212, 255, 0.5)",
        "neon-purple": "0 0 20px rgba(128, 0, 255, 0.5)",
        "neon-pink": "0 0 20px rgba(255, 0, 128, 0.5)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-neon": {
          "0%, 100%": { opacity: "0.2" },
          "50%": { opacity: "0.4" },
        },
        "glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 212, 255, 0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(0, 212, 255, 0.6)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-neon": "pulse-neon 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
