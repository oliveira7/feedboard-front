"use client";
import { Montserrat, Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";
import { TypographyOptions } from "@mui/material/styles/createTypography";

const montserrat = Montserrat({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});
const createTypography = (
  color: string,
  colorCaption: string
): TypographyOptions => ({
  fontFamily: montserrat.style.fontFamily,
  fontSize: 12,
  allVariants: {
    color,
  },
  h3: {
    fontSize: "1.3rem",
    fontWeight: 500,
  },
  h4: {
    fontSize: "1.8rem",
    fontWeight: 500,
  },
  button: {
    fontWeight: 600,
  },
  subtitle1: {
    fontSize: "0.9rem",
    fontWeight: 400,
    color: colorCaption,
  },
  subtitle2: {
    fontSize: "0.7rem",
    color: colorCaption,
  },
});

const lightTypography = createTypography("#1c3863", "#B1B1B1");
const darkTypography = createTypography("#FFFF", "#FFFFFF");

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1c3863",
    },
    secondary: {
      main: "#e0b60f",
    },
    tertiary: {
      main: "#22B24F",
    },
    custom: {
      card: "#FFFFFF",
    },
    text: {
      primary: "#B1B1B1",
      secondary: "#16181A",
    },
    background: {
      default: "#eeee",
    },
  },
  typography: lightTypography,
  components: {
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: "#4A494A",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "8px 16px",
        },
        contained: {
          color: "#FFFF",
        },
      },
      defaultProps: {
        variant: "contained",
        color: "primary",
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: "#D32F2F",
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          outline: "none",
          display: "flex",
          alignItems: "center",
          boxShadow: "1px 4px 8px rgba(0, 0, 0, 0.2)",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "transparent",
            },
            "&:hover fieldset": {
              borderColor: "transparent",
            },
            "&.Mui-focused fieldset": {
              borderColor: "transparent",
              display: "flex",
              alignItems: "self-end",
            },
          },
          "& .MuiAutocomplete-inputRoot": {
            padding: "8px 16px",
          },
        },
        listbox: {
          borderRadius: 12,
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          "& .MuiAutocomplete-option": {
            borderRadius: 8,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
            '&[data-focus="true"]': {
              backgroundColor: "rgba(0, 0, 0, 0.08)",
            },
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          outline: "none",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          "&.MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "transparent",
            },
            "&:hover fieldset": {
              borderColor: "transparent",
            },
            "&.Mui-focused fieldset": {
              borderColor: "transparent",
            },
          },
          "& .MuiSelect-select": {
            padding: "16px 32px",
            lineHeight: "1.5",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#B1B1B1",
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        root: {
          fontSize: "1.6rem",
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          fontSize: "0.9rem",
          color: "#1c3863",
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          borderRadius: "12px",
          overflow: "hidden",
          paddingTop: "1.25rem",
          paddingRight: "1.25rem",
          paddingLeft: "1.25rem",
          paddingBottom: "1.25rem",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          "& .MuiTableCell-root": {
            color: "#FDFDFD",
            fontSize: "1rem",
            backgroundColor: "#FFFFFF",
            borderBottom: "1px solid rgba(224, 224, 224, 1)",
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-root": {
            fontSize: "0.9rem",
            fontWeight: 500,
            borderBottom: "1px solid rgba(224, 224, 224, 1)",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: "1.0rem",
          borderBottom: "1px solid rgba(224, 224, 224, 1)",
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          color: "#4A494A",
          "&:hover": {
            color: "#22B24F",
          },
          "&.Mui-active": {
            color: "#22B24F !important",
          },
          "&.MuiTableSortLabel-root.MuiTableSortLabel-active": {
            color: "#22B24F !important",
          },
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
          backgroundColor: "#FFFFFF",
        },
        actions: {
          color: "#898989",
        },
        toolbar: {
          color: "#898989",
        },
        selectLabel: {
          color: "#898989",
        },
        displayedRows: {
          color: "#898989",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          styleOverrides: {
            borderRadius: "10px",
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          outline: "none",
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
          marginBottom: 15,
          border: "none",
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          border: "none",
          marginBottom: -1,
          minHeight: 56,
          "&$expanded": {
            minHeight: 56,
            border: "none",
          },
        },
        content: {
          "&$expanded": {
            margin: "12px 0",
            border: "none",
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          "&.Mui-checked": {
            color: "#22B24F",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          "& .MuiTabs-flexContainer": {
            justifyContent: "space-between",
          },
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 500,
            fontSize: "1rem",
            color: "#B1B1B1",
            "&.Mui-selected": {
              color: "#22B24F",
            },
            "&:hover": {
              color: "#e0b60f",
            },
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "#22B24F",
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minWidth: "unset",
          padding: "12px 16px",
          borderBottom: "2px solid transparent",
          "&.Mui-selected": {
            borderBottom: "2px solid #22B24F",
          },
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#FFFF",
    },
    secondary: {
      main: "#e0b60f",
    },
    tertiary: {
      main: "#22B24F",
    },
    custom: {
      card: "#2F2F2F",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#B1B1B1",
    },
    background: {
      default: "#212121",
    },
  },
  typography: darkTypography,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "8px 16px",
        },
        contained: {
          color: "#FFF",
        },
      },
      defaultProps: {
        variant: "contained",
        color: "primary",
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: "#FFF",
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        listbox: {
          "& .MuiAutocomplete-option": {
            "&:hover": {
              backgroundColor: "tertiary",
              color: "#ffff",
            },
            '&[data-focus="true"]': {
              backgroundColor: "tertiary",
              color: "##ffff",
            },
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          outline: "none",
          backgroundColor: "#2F2F2F",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          "&.MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "transparent",
            },
            "&:hover fieldset": {
              borderColor: "transparent",
            },
            "&.Mui-focused fieldset": {
              borderColor: "transparent",
            },
          },
          "& .MuiSelect-select": {
            padding: "8px 16px",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "20px",
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: "#2F2F2F",
          borderRadius: "12px",
          overflow: "hidden",
          paddingTop: "1.25rem",
          paddingRight: "1.25rem",
          paddingLeft: "1.25rem",
          paddingBottom: "1.25rem",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          "& .MuiTableCell-root": {
            color: "#FDFDFD",
            fontSize: "1rem",
            backgroundColor: "#2F2F2F",
            borderBottom: "1px solid rgba(224, 224, 224, 1)",
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-root": {
            fontSize: "0.9rem",
            fontWeight: 500,
            borderBottom: "1px solid rgba(224, 224, 224, 1)",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: "1.0rem",
          borderBottom: "1px solid rgba(224, 224, 224, 1)",
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          color: "#898989",
          "&:hover": {
            color: "#22B24F",
          },
          "&.Mui-active": {
            color: "#22B24F !important",
          },
          "&.MuiTableSortLabel-root.MuiTableSortLabel-active": {
            color: "#22B24F !important",
          },
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
          backgroundColor: "#2F2F2F",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          styleOverrides: {
            borderRadius: "10px",
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: "20px",
          outline: "none",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          marginBottom: 15,
          border: "none",
          "&:before": {
            display: "none",
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: "none",
          marginBottom: -1,
          minHeight: 56,
          "&$expanded": {
            minHeight: 56,
            border: "none",
          },
        },
        content: {
          borderRadius: 20,
          border: "none",
          "&$expanded": {
            margin: "12px 0",
            border: "none",
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          "&.Mui-checked": {
            color: "#22B24F",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          "& .MuiTabs-flexContainer": {
            justifyContent: "space-between",
          },
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 500,
            fontSize: "1rem",
            color: "#FFFF",
            "&.Mui-selected": {
              color: "#22B24F",
            },
            "&:hover": {
              color: "#e0b60f",
            },
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "#22B24F",
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minWidth: "unset",
          padding: "12px 16px",
          borderBottom: "2px solid transparent",
          "&.Mui-selected": {
            borderBottom: "2px solid #22B24F",
          },
        },
      },
    },
  },
});

declare module "@mui/material/styles" {
  interface Palette {
    tertiary: Palette["primary"];
  }
  interface PaletteOptions {
    tertiary?: PaletteOptions["primary"];
  }

  interface PaletteCustom {
    tertiary: string;
  }

  interface PaletteOptions {
    custom?: PaletteCustomOptions;
  }

  interface Palette {
    custom: PaletteCustom;
  }

  interface PaletteCustomOptions {
    grayText?: string;
    card?: string;
  }

  interface PaletteCustom {
    grayText: string;
    card: string;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    tertiary: true;
  }

  interface PaletteOptions {
    custom: PaletteCustom;
  }

  interface PaletteCustom {
    grayText: string;
    card: string;
  }
}

declare module "@mui/material/Tabs" {
  interface TabsPropsIndicatorColorOverrides {
    tertiary: true;
  }

  interface TabsPropsTextColorOverrides {
    tertiary: true;
  }
}

export { lightTheme, darkTheme };
