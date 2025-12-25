/**
 * TribeWellMD Design Tokens
 *
 * =============================================================================
 * FOREST THEME - LOCKED PALETTE
 * =============================================================================
 *
 * This palette is FINALIZED. Do not add new colors without design review.
 *
 * APPROVED FOREST THEME PALETTE:
 * ----------------------------------------
 * Brand / Structure (Greens):
 *   primary-strong  → #405549
 *   primary         → #556B5E
 *   primary-soft    → #6E847D
 *
 * Surfaces:
 *   background      → #F2F0EC
 *   surface         → #FEFDFD
 *
 * Secondary / Earth:
 *   secondary       → #B2ADA7
 *   secondary-strong→ #786551
 *
 * Status:
 *   danger          → #924A48
 *
 * Text / Utility:
 *   text-primary    → #2F3A35
 *   text-muted      → #8C9499
 *   border          → #DADBDB
 *
 * =============================================================================
 * USAGE RULES:
 * - All UI must reference semantic tokens (bg-primary, text-content, etc.)
 * - No hardcoded hex values in components
 * - No Tailwind default color utilities (slate-*, gray-*, etc.)
 * - Gradients may use forest/sand raw values for gradient stops
 * =============================================================================
 */

// =============================================================================
// LOCKED FOREST THEME PALETTE
// =============================================================================

export const forestPalette = {
  // Brand / Structure (Greens)
  primaryStrong: '#405549',
  primary: '#556B5E',
  primarySoft: '#6E847D',

  // Surfaces
  background: '#F2F0EC',
  surface: '#FEFDFD',

  // Secondary / Earth
  secondary: '#B2ADA7',
  secondaryStrong: '#786551',

  // Status
  danger: '#924A48',

  // Text / Utility
  textPrimary: '#2F3A35',
  textMuted: '#8C9499',
  border: '#DADBDB',
} as const;

// =============================================================================
// SEMANTIC TOKEN MAPPINGS
// These map semantic meanings to the locked palette
// =============================================================================

export const forestThemeTokens = {
  // Surfaces
  surface: {
    default: forestPalette.surface,
    elevated: forestPalette.surface,
    muted: forestPalette.background,
    subtle: forestPalette.background,
  },

  // Backgrounds
  background: {
    primary: forestPalette.background,
    secondary: forestPalette.background,
  },

  // Primary actions (main CTA, active states)
  primary: {
    DEFAULT: forestPalette.primary,
    hover: forestPalette.primaryStrong,
    light: forestPalette.primarySoft,
    foreground: forestPalette.surface,
  },

  // Secondary actions
  secondary: {
    DEFAULT: forestPalette.secondaryStrong,
    hover: forestPalette.secondaryStrong,
    light: forestPalette.secondary,
    foreground: forestPalette.surface,
  },

  // Accent (highlights, badges) - uses secondary
  accent: {
    DEFAULT: forestPalette.secondaryStrong,
    hover: forestPalette.secondaryStrong,
    light: forestPalette.secondary,
    foreground: forestPalette.surface,
  },

  // Text colors
  text: {
    primary: forestPalette.textPrimary,
    secondary: forestPalette.textPrimary,
    muted: forestPalette.textMuted,
    inverse: forestPalette.surface,
  },

  // Borders
  border: {
    DEFAULT: forestPalette.border,
    light: forestPalette.border,
    focus: forestPalette.primary,
  },

  // Status colors
  success: {
    DEFAULT: forestPalette.primary,
    light: forestPalette.primarySoft,
  },

  warning: {
    DEFAULT: forestPalette.secondaryStrong,
    light: forestPalette.secondary,
  },

  error: {
    DEFAULT: forestPalette.danger,
    light: forestPalette.secondary,
  },

  info: {
    DEFAULT: forestPalette.primary,
    light: forestPalette.primarySoft,
  },
} as const;

// =============================================================================
// GRADIENT DEFINITIONS
// For gradient stops - only use these raw values
// =============================================================================

export const forestGradients = {
  // Primary green gradient
  primary: `from-[${forestPalette.primary}] to-[${forestPalette.primaryStrong}]`,

  // Secondary earth gradient
  secondary: `from-[${forestPalette.secondaryStrong}] to-[${forestPalette.secondaryStrong}]`,

  // Soft green gradient
  soft: `from-[${forestPalette.primarySoft}] to-[${forestPalette.primary}]`,
} as const;

// =============================================================================
// TYPE-BASED COLOR MAPPINGS
// For components that need type→color mapping (e.g., tribe types)
// =============================================================================

export const typeColorMap = {
  study: 'secondary',
  specialty: 'accent',
  wellness: 'primary',
  cause: 'primary',
} as const;

// CSS variable names for Tailwind mapping
export const cssVarNames = {
  // Surfaces
  '--surface-default': 'surface-default',
  '--surface-elevated': 'surface-elevated',
  '--surface-muted': 'surface-muted',
  '--surface-subtle': 'surface-subtle',

  // Backgrounds
  '--bg-primary': 'bg-primary',
  '--bg-secondary': 'bg-secondary',

  // Primary
  '--primary': 'primary',
  '--primary-hover': 'primary-hover',
  '--primary-light': 'primary-light',
  '--primary-foreground': 'primary-foreground',

  // Secondary
  '--secondary': 'secondary',
  '--secondary-hover': 'secondary-hover',
  '--secondary-light': 'secondary-light',
  '--secondary-foreground': 'secondary-foreground',

  // Accent
  '--accent': 'accent',
  '--accent-hover': 'accent-hover',
  '--accent-light': 'accent-light',
  '--accent-foreground': 'accent-foreground',

  // Text
  '--text-primary': 'text-primary',
  '--text-secondary': 'text-secondary',
  '--text-muted': 'text-muted',
  '--text-inverse': 'text-inverse',

  // Border
  '--border': 'border-default',
  '--border-light': 'border-light',
  '--border-focus': 'border-focus',

  // Status
  '--success': 'success',
  '--success-light': 'success-light',
  '--warning': 'warning',
  '--warning-light': 'warning-light',
  '--error': 'error',
  '--error-light': 'error-light',
  '--info': 'info',
  '--info-light': 'info-light',
} as const;

export type SemanticColor = keyof typeof cssVarNames;
