"use client";

import React, { createContext, useState, ReactNode, useContext, useEffect } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import RouteLoader from "@/app/loading";

interface ThemeContextType {
  themeMode: "light" | "dark";
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
      light: "#9B5DE5",
      main: "#6A0DAD",
      dark: "#4C0070",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#e0b60f",
    },
    background: {
      default: "#FFFFFF",
      paper: "#EEEEEE", 
    },
    text: {
      primary: "#4A494A",
      secondary: "#B1B1B1",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          padding: "8px 16px",
          textTransform: "none",
          fontWeight: 600,
          transition: "background-color 0.3s ease",
          '&:hover': {
            backgroundColor: '#6A0DAD',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '20px',
            '& fieldset': {
              borderColor: '#6A0DAD',
              borderRadius: '20px',
            },
            '&:hover fieldset': {
              borderColor: '#6A0DAD',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6A0DAD',
            },
          },
        },
      },
    }
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      light: "#9B5DE5",
      main: "#6A0DAD",
      dark: "#4C0070",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#c0a60d",
    },
    background: {
      default: "#212121",
      paper: "#414141",
    },
    text: {
      primary: "#E0E0E0",
      secondary: "#A4A4A4",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          padding: "8px 16px",
          textTransform: "none",
          fontWeight: 600,
          transition: "background-color 0.3s ease",
          '&:hover': {
            backgroundColor: '#9B5DE5',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '20px',
            '& fieldset': {
              borderColor: '#9B5DE5',
              borderRadius: '20px',
            },
            '&:hover fieldset': {
              borderColor: '#9B5DE5',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#9B5DE5',
            },
          },
        },
      },
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});
export const CustomThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  // Carregar o tema inicial do localStorage
  useEffect(() => {
    const storedTheme =
      (typeof window !== "undefined" && localStorage.getItem("theme")) || "light";
    setThemeMode(storedTheme as "light" | "dark");
    setIsThemeLoaded(true);
  }, []);

  const toggleTheme = () => {
    const newThemeMode = themeMode === "light" ? "dark" : "light";
    localStorage.setItem("theme", newThemeMode);
    setThemeMode(newThemeMode);
  };

  const theme = themeMode === "light" ? lightTheme : darkTheme;

  if (!isThemeLoaded) {
    return <RouteLoader />;
  }

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme, theme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

// Hook para acessar o tema
export const useTheme = () => useContext(ThemeContext);
