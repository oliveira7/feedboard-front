"use client";

import React, { createContext, useState, ReactNode, useContext } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";

interface ThemeContextType {
  themeMode: "light";
  toggleTheme: () => void;
  theme: ReturnType<typeof createTheme>;
}

const ThemeContext = createContext<ThemeContextType>({
  themeMode: "light",
  toggleTheme: () => {},
  theme: createTheme(),
});

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      light: "#4CAF50", // Verde claro
      main: "#388E3C",  // Verde principal
      dark: "#1B5E20",  // Verde mais escuro
    },
    secondary: {
      main: "#F1F1F1", // Cor de fundo secundária clara
    },
    background: {
      default: "#FFFFFF", // Fundo branco
      paper: "#F5F5F5",   // Papel mais claro para áreas elevadas
    },
    text: {
      primary: "#333333",  // Cor de texto principal em fundo claro
      secondary: "#666666", // Cor de texto secundário
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "8px 16px",
          backgroundColor: "#388E3C", // Verde principal
          "&:hover": {
            backgroundColor: "#4CAF50", // Verde claro no hover
          },
        },
        contained: {
          color: "#FFFFFF", // Cor do texto no botão
        },
      },
      defaultProps: {
        variant: "contained",
        color: "primary",
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "20px",
            "& fieldset": {
              borderColor: "#388E3C", // Borda inicial
            },
            "&:hover fieldset": {
              borderColor: "#4CAF50", // Borda no hover
            },
            "&.Mui-focused fieldset": {
              borderColor: "#4CAF50", // Borda quando o campo está focado
            },
            "& input": {
              color: "#333333", // Texto digitado no input
            },
          },
          "& .MuiInputLabel-root": {
            color: "#666666", // Cor da label
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#388E3C", // Cor da label quando focada
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: "20px",
          "& .MuiOutlinedInput-root": {
            borderRadius: "20px",
            "& fieldset": {
              borderColor: "#388E3C",
            },
            "&:hover fieldset": {
              borderColor: "#4CAF50",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#4CAF50",
            },
            "& input": {
              color: "#333333",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#666666",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#388E3C", 
          },
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: "1rem",
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        root: {
          border: "1px solid #388E3C"
        },
      },
    }
  },
});

export const CustomThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeMode] = useState<"light">("light");

  const theme = lightTheme;

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme: () => {}, theme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
