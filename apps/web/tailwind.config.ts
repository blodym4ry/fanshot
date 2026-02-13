import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#08080F',
          secondary: '#0F1019',
          card: '#151520',
          elevated: '#1A1A2E',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F5D76E',
          dark: '#A67C00',
        },
        accent: {
          red: '#E63946',
          green: '#2DC653',
          blue: '#457BF5',
        },
        pitch: {
          green: '#1B8B3A',
        },
        text: {
          primary: '#F0F0F5',
          secondary: '#8A8A9A',
          muted: '#555566',
        },
      },
      fontFamily: {
        oswald: ['var(--font-oswald)', 'Oswald', 'sans-serif'],
        body: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'float-up': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'fade-step': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s ease-in-out infinite',
        'spin-slow': 'spin-slow 2s linear infinite',
        'float-up': 'float-up 3s ease-in-out infinite',
        'fade-step': 'fade-step 0.35s ease-out',
      },
    },
  },
  plugins: [],
};
export default config;
