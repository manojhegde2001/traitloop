import { nextui } from '@nextui-org/theme';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      keyframes: {
        heartbeat: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' }
        },
        'infinite-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      animation: {
        heartbeat: 'heartbeat 1s ease-in-out infinite',
        'infinite-scroll': 'infinite-scroll 25s linear infinite',
        float: 'float 6s ease-in-out infinite',
      }
    }
  },
  darkMode: 'class',
  plugins: [
    nextui({
      layout: {
        radius: {
          small: '4px',
          medium: '8px',
          large: '12px',
        },
        borderWidth: {
          small: '1px',
          medium: '2px',
          large: '3px',
        },
      },
      themes: {
        light: {
          colors: {
            background: '#ffffff',
            foreground: '#0f172a',
            primary: {
              50: '#f0f9ff',
              100: '#e0f2fe',
              200: '#bae6fd',
              300: '#7dd3fc',
              400: '#38bdf8',
              500: '#0ea5e9',
              600: '#0284c7',
              700: '#0369a1',
              800: '#075985',
              900: '#0c4a6e',
              DEFAULT: '#0ea5e9',
              foreground: '#ffffff',
            },
            secondary: {
              DEFAULT: '#8b5cf6',
              foreground: '#ffffff',
            },
            focus: '#0ea5e9',
          },
        },
        dark: {
          colors: {
            background: '#020617',
            foreground: '#f8fafc',
            primary: {
              50: '#0c4a6e',
              100: '#075985',
              200: '#0369a1',
              300: '#0284c7',
              400: '#0ea5e9',
              500: '#38bdf8',
              600: '#7dd3fc',
              700: '#bae6fd',
              800: '#e0f2fe',
              900: '#f0f9ff',
              DEFAULT: '#38bdf8',
              foreground: '#020617',
            },
            secondary: {
              DEFAULT: '#a78bfa',
              foreground: '#ffffff',
            },
            focus: '#38bdf8',
          },
        },
      },
    }),
  ],
};
