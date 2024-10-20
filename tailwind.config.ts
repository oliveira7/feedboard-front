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
          DEFAULT: '#F1F1F1',
          50: '#F5F5F5',
          100: '#E0E0E0',
          200: '#CCCCCC',
        },
      },
      colors: {
        primary: {
          light: '#A5D6A7', // Verde claro
          DEFAULT: '#66BB6A', // Verde principal
          dark: '#388E3C', // Verde mais escuro
        },
        secondary: {
          DEFAULT: '#FAFAFA', // Fundo secundário claro
        },
        neutral: {
          100: '#F0F0F0', // Cinza claro
          200: '#D9D9D9', // Cinza médio claro
          300: '#B0B0B0', // Cinza mais escuro
        },
      },
      textColor: {
        DEFAULT: '#388E3C',
        primary: '#333333', // Texto escuro em fundos claros
        secondary: '#666666', // Cinza mais escuro para textos secundários
        neutral: '#999999', // Cinza médio para textos descritivos
        highlight: '#388E3C', // Verde para destaques, como links ou botões
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
