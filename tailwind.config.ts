import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        primary: {
          DEFAULT: '#DEDEDE',
          50: '#F5F5F5',
          100: '#E7E8E4'
        },
      },
      colors: {
        primary: {
          light: '#9B5DE5', 
          DEFAULT: '#6A0DAD',
          dark: '#4C0070',
        },
        secondary: {
          DEFAULT: '#FFFFFF',
        },
        keyframes: {
          progress: {
            '0%': { width: '0%' },
            '100%': { width: '100%' },
          },
        },
        animation: {
          progress: 'progress 2s linear infinite',
        },
      },
    },
  },
  plugins: [],
};
export default config;
