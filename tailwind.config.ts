import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-source-serif)', 'Georgia', 'serif'],
      },
      colors: {
        // TribeWell brand colors - soft, nature-inspired palette
        tribe: {
          // Primary sage/seafoam green (buttons, accents, links)
          sage: {
            50: '#f4f9f6',
            100: '#e6f2ec',
            200: '#cce5d9',
            300: '#a3d1bc',
            400: '#73b89a',
            500: '#5DB075', // Primary brand green
            600: '#4a9962',
            700: '#3d7d50',
            800: '#346542',
            900: '#2c5338',
            950: '#152e1d',
          },
          // Soft coral/pink (accents, indicators)
          coral: {
            50: '#fdf5f5',
            100: '#fae8e8',
            200: '#f5d4d4',
            300: '#e8b4b4', // Soft coral accent
            400: '#d68f8f',
            500: '#c26b6b',
            600: '#a85454',
            700: '#8c4444',
            800: '#743a3a',
            900: '#613434',
            950: '#341919',
          },
          // Calm blue (progress, highlights)
          sky: {
            50: '#f2f8fc',
            100: '#e3eff8',
            200: '#c1dff0',
            300: '#8bc5e3',
            400: '#4da5d3',
            500: '#4A90D9', // Progress bar blue
            600: '#2570b3',
            700: '#205a91',
            800: '#1e4c78',
            900: '#1e4164',
            950: '#142a43',
          },
        },
        // Keep medical palette for compatibility
        medical: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
      },
      boxShadow: {
        // Soft, nature-inspired shadows
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.04)',
        'soft-md': '0 4px 12px rgba(0, 0, 0, 0.05), 0 8px 24px rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 8px 24px rgba(0, 0, 0, 0.06), 0 16px 48px rgba(0, 0, 0, 0.06)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
