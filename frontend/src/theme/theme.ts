import { createTheme } from "@mui/material/styles";

// Create a theme instance with space-themed colors and Poppins font
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#64b5f6", // Light blue - space/sky
      light: "#90caf9",
      dark: "#1976d2",
    },
    secondary: {
      main: "#ce93d8", // Purple - nebula
      light: "#f3e5f5",
      dark: "#ab47bc",
    },
    success: {
      main: "#66bb6a",
    },
    info: {
      main: "#29b6f6",
    },
    warning: {
      main: "#ffa726",
    },
    error: {
      main: "#ef5350",
    },
    background: {
      default: "#0a0e27", // Deep space blue
      paper: "#1a1f3a", // Slightly lighter for cards
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0bec5",
    },
  },
  typography: {
    fontFamily: '"Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: "-1px",
    },
    h2: {
      fontWeight: 700,
      letterSpacing: "-0.8px",
    },
    h3: {
      fontWeight: 600,
      letterSpacing: "-0.5px",
    },
    h4: {
      fontWeight: 600,
      letterSpacing: "-0.5px",
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          borderRadius: 16,
          border: "1px solid rgba(100, 181, 246, 0.1)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            border: "1px solid rgba(100, 181, 246, 0.3)",
            transform: "translateY(-4px)",
            boxShadow: "0 8px 24px rgba(100, 181, 246, 0.15)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 10,
          fontWeight: 600,
          padding: "10px 24px",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 6px 20px rgba(100, 181, 246, 0.3)",
          },
        },
        contained: {
          background: "linear-gradient(135deg, #64b5f6 0%, #1976d2 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #90caf9 0%, #2196f3 100%)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 500,
          transition: "all 0.2s ease",
          "&:hover": {
            transform: "scale(1.05)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid rgba(100, 181, 246, 0.1)",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          fontSize: "1rem",
        },
      },
    },
  },
});

export default theme;
