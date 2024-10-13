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
          DEFAULT: '#1A1A1A', // Preto escuro para o fundo principal
          50: '#2A2A2A', // Cinza escuro para variações
          100: '#333333', // Cinza um pouco mais claro
        },
      },
      colors: {
        primary: {
          light: '#4CAF50', // Verde claro para realces
          DEFAULT: '#388E3C', // Verde médio para elementos principais
          dark: '#1B5E20', // Verde escuro para textos ou botões
        },
        secondary: {
          DEFAULT: '#F1F1F1', // Branco suave para contraste com os fundos escuros
        },
        // Neutros
        neutral: {
          100: '#E0E0E0', // Cinza claro
          200: '#BDBDBD', // Cinza médio
          300: '#9E9E9E', // Cinza escuro
        },
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
