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
          DEFAULT: '#1A1A1A',
          50: '#2A2A2A',
          100: '#333333',
          200: '#4D4D4D',
        },
      },
      colors: {
        primary: {
          light: '#4CAF50',
          DEFAULT: '#388E3C',
          dark: '#1B5E20',
        },
        secondary: {
          DEFAULT: '#F1F1F1',
        },
        // Neutros
        neutral: {
          100: '#E0E0E0', // Cinza claro
          200: '#BDBDBD', // Cinza médio
          300: '#9E9E9E', // Cinza escuro
        },
      },
      textColor: {
        primary: '#FFFFFF', // Branco para textos principais em fundos escuros
        secondary: '#BDBDBD', // Cinza claro para textos secundários
        neutral: '#9E9E9E', // Cinza médio para textos descritivos
        highlight: '#4CAF50', // Verde claro para destaques, como links ou botões
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
  plugins: [],
};

export default config;
