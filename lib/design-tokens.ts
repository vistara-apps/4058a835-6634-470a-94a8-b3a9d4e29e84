/**
 * Design System Tokens for Crypto Combat Arena
 * Centralized design tokens for consistent theming across the application
 */

// Color tokens
export const colors = {
  // Primary brand colors
  primary: {
    50: 'hsl(230 70% 95%)',
    100: 'hsl(230 70% 90%)',
    200: 'hsl(230 70% 80%)',
    300: 'hsl(230 70% 70%)',
    400: 'hsl(230 70% 60%)',
    500: 'hsl(230 70% 50%)', // Default
    600: 'hsl(230 70% 40%)',
    700: 'hsl(230 70% 30%)',
    800: 'hsl(230 70% 20%)',
    900: 'hsl(230 70% 10%)',
    950: 'hsl(230 70% 5%)',
  },
  
  // Accent colors
  accent: {
    50: 'hsl(35 90% 95%)',
    100: 'hsl(35 90% 90%)',
    200: 'hsl(35 90% 80%)',
    300: 'hsl(35 90% 70%)',
    400: 'hsl(35 90% 60%)', // Default
    500: 'hsl(35 90% 50%)',
    600: 'hsl(35 90% 40%)',
    700: 'hsl(35 90% 30%)',
    800: 'hsl(35 90% 20%)',
    900: 'hsl(35 90% 10%)',
    950: 'hsl(35 90% 5%)',
  },

  // Background colors
  bg: {
    primary: 'hsl(220 20% 10%)',
    secondary: 'hsl(220 20% 8%)',
  },

  // Surface colors
  surface: {
    primary: 'hsl(220 20% 15%)',
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
    primary: 'hsl(142 76% 36%)',
    foreground: 'hsl(138 76% 97%)',
  },
  warning: {
    primary: 'hsl(35 90% 60%)',
    foreground: 'hsl(35 90% 10%)',
  },
  destructive: {
    primary: 'hsl(0 84% 60%)',
    foreground: 'hsl(0 0% 98%)',
  },

  // UI element colors
  border: 'hsl(220 20% 25%)',
  input: 'hsl(220 20% 18%)',
  ring: 'hsl(230 70% 50%)',
} as const;

// Typography tokens
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Consolas', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }],
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
} as const;

// Spacing tokens
export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  18: '4.5rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
  40: '10rem',
  48: '12rem',
  56: '14rem',
  64: '16rem',
  88: '22rem',
  128: '32rem',
} as const;

// Border radius tokens
export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  default: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
} as const;

// Shadow tokens
export const shadows = {
  card: '0 4px 12px hsla(0 0% 0% / 0.20)',
  cardHover: '0 8px 24px hsla(0 0% 0% / 0.30)',
  neonBlue: '0 0 20px #00d4ff',
  neonPink: '0 0 20px #ff0080',
  neonPurple: '0 0 20px #8000ff',
  neonCyan: '0 0 20px #00ffff',
  innerGlow: 'inset 0 0 20px hsla(230 70% 50% / 0.2)',
} as const;

// Animation tokens
export const animations = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

// Breakpoint tokens
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Z-index tokens
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// Component-specific tokens
export const components = {
  button: {
    height: {
      sm: '2rem',
      md: '2.5rem',
      lg: '3rem',
    },
    padding: {
      sm: '0.5rem 1rem',
      md: '0.75rem 1.5rem',
      lg: '1rem 2rem',
    },
  },
  card: {
    padding: {
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
    },
  },
  input: {
    height: {
      sm: '2rem',
      md: '2.5rem',
      lg: '3rem',
    },
  },
} as const;

// Game-specific tokens
export const gameTokens = {
  rarity: {
    common: {
      color: colors.text.secondary,
      glow: 'none',
    },
    rare: {
      color: colors.neon.blue,
      glow: shadows.neonBlue,
    },
    epic: {
      color: colors.neon.purple,
      glow: shadows.neonPurple,
    },
    legendary: {
      color: colors.neon.pink,
      glow: shadows.neonPink,
    },
  },
  stats: {
    health: colors.success.primary,
    attack: colors.destructive.primary,
    defense: colors.primary[400],
    speed: colors.accent[400],
    energy: colors.neon.cyan,
  },
} as const;

// Export all tokens as a single object
export const designTokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  animations,
  breakpoints,
  zIndex,
  components,
  gameTokens,
} as const;

export default designTokens;
