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
        // Unified design system colors for Crypto Combat Arena
        primary: {
          DEFAULT: 'hsl(230 70% 50%)',
          50: 'hsl(230 70% 95%)',
          100: 'hsl(230 70% 90%)',
          200: 'hsl(230 70% 80%)',
          300: 'hsl(230 70% 70%)',
          400: 'hsl(230 70% 60%)',
          500: 'hsl(230 70% 50%)',
          600: 'hsl(230 70% 40%)',
          700: 'hsl(230 70% 30%)',
          800: 'hsl(230 70% 20%)',
          900: 'hsl(230 70% 10%)',
          950: 'hsl(230 70% 5%)',
        },
        accent: {
          DEFAULT: 'hsl(35 90% 60%)',
          50: 'hsl(35 90% 95%)',
          100: 'hsl(35 90% 90%)',
          200: 'hsl(35 90% 80%)',
          300: 'hsl(35 90% 70%)',
          400: 'hsl(35 90% 60%)',
          500: 'hsl(35 90% 50%)',
          600: 'hsl(35 90% 40%)',
          700: 'hsl(35 90% 30%)',
          800: 'hsl(35 90% 20%)',
          900: 'hsl(35 90% 10%)',
          950: 'hsl(35 90% 5%)',
        },
        // Background and surface colors
        bg: {
          DEFAULT: 'hsl(220 20% 10%)',
          secondary: 'hsl(220 20% 8%)',
        },
        surface: {
          DEFAULT: 'hsl(220 20% 15%)',
          hover: 'hsl(220 20% 18%)',
          active: 'hsl(220 20% 12%)',
        },
        // Text colors
        text: {
          primary: 'hsl(0 0% 95%)',
          secondary: 'hsl(0 0% 70%)',
          muted: 'hsl(0 0% 50%)',
          inverse: 'hsl(220 20% 10%)',
        },
        // Neon colors for gaming theme
        neon: {
          blue: '#00d4ff',
          pink: '#ff0080',
          purple: '#8000ff',
          cyan: '#00ffff',
          green: '#00ff80',
        },
        // Semantic colors
        success: {
          DEFAULT: 'hsl(142 76% 36%)',
          foreground: 'hsl(138 76% 97%)',
        },
        warning: {
          DEFAULT: 'hsl(35 90% 60%)',
          foreground: 'hsl(35 90% 10%)',
        },
        destructive: {
          DEFAULT: 'hsl(0 84% 60%)',
          foreground: 'hsl(0 0% 98%)',
        },
        // UI element colors
        border: 'hsl(220 20% 25%)',
        input: 'hsl(220 20% 18%)',
        ring: 'hsl(230 70% 50%)',
        muted: {
          DEFAULT: 'hsl(220 20% 15%)',
          foreground: 'hsl(0 0% 70%)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        DEFAULT: '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(0 0% 0% / 0.20)',
        'card-hover': '0 8px 24px hsla(0 0% 0% / 0.30)',
        'neon-blue': '0 0 20px #00d4ff',
        'neon-pink': '0 0 20px #ff0080',
        'neon-purple': '0 0 20px #8000ff',
        'neon-cyan': '0 0 20px #00ffff',
        'inner-glow': 'inset 0 0 20px hsla(230 70% 50% / 0.2)',
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite alternate',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'shake': 'shake 0.5s ease-in-out',
      },
      keyframes: {
        'pulse-neon': {
          '0%': { boxShadow: '0 0 5px currentColor' },
          '100%': { boxShadow: '0 0 20px currentColor, 0 0 30px currentColor' },
        },
        'glow': {
          '0%': { textShadow: '0 0 5px currentColor' },
          '100%': { textShadow: '0 0 20px currentColor, 0 0 30px currentColor' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },
    },
  },
  plugins: [],
};
export default config;
