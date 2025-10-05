import { createTheme } from "@mui/material/styles";

// Create a theme instance with space-themed colors
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
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.5px",
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
