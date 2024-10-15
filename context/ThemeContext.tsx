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
    mode: "dark",
    primary: {
      light: "#4CAF50",
      main: "#388E3C",
      dark: "#1B5E20",
    },
    secondary: {
      main: "#F1F1F1",
    },
    background: {
      default: "#212121",
      paper: "#333333",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#E0E0E0",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "8px 16px",
          backgroundColor: "#388E3C",
          "&:hover": {
            backgroundColor: "#4CAF50",
          },
        },
        contained: {
          color: "#FFFFFF",
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
              borderColor: "#388E3C",
            },
            "&:hover fieldset": {
              borderColor: "#4CAF50",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#4CAF50",
            },
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
          },
        },
      },
    },
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
