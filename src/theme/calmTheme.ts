import { createTheme } from '@mui/material/styles';

// Calm, simple color palette inspired by the screenshot
const calmColors = {
  // Primary colors
  primary: {
    main: '#4285f4', // Google blue
    light: '#80b4ff',
    dark: '#0059c1',
    contrastText: '#ffffff',
  },
  // Secondary colors
  secondary: {
    main: '#34a853', // Google green
    light: '#6ada85',
    dark: '#007824',
    contrastText: '#ffffff',
  },
  // Accent colors
  accent1: '#fbbc05', // Google yellow
  accent2: '#ea4335', // Google red
  accent3: '#673ab7', // Purple
  
  // Background colors
  background: {
    default: '#f5f5f5', // Light gray background
    paper: '#ffffff',
    light: '#fafafa',
  },
  
  // Text colors
  text: {
    primary: '#202124', // Dark gray
    secondary: '#5f6368', // Medium gray
    disabled: '#9aa0a6', // Light gray
  },
  
  // Node colors by type
  nodes: {
    input: '#34a853', // Green
    task: '#4285f4', // Blue
    tool: '#673ab7', // Purple
    router: '#ea4335', // Red
    output: '#fbbc05', // Yellow
  },
};

// Create the calm theme
const calmTheme = createTheme({
  palette: {
    mode: 'light',
    primary: calmColors.primary,
    secondary: calmColors.secondary,
    background: {
      default: calmColors.background.default,
      paper: calmColors.background.paper,
    },
    text: {
      primary: calmColors.text.primary,
      secondary: calmColors.text.secondary,
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
    },
    h2: {
      fontWeight: 500,
    },
    h3: {
      fontWeight: 500,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: calmColors.background.paper,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
          color: calmColors.text.primary,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
          },
        },
        contained: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
        },
        elevation1: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
          borderRadius: 8,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(32, 33, 36, 0.9)',
          color: '#ffffff',
          fontSize: '0.75rem',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: calmColors.text.primary,
          '&:hover': {
            backgroundColor: 'rgba(66, 133, 244, 0.08)',
          },
        },
      },
    },
  },
});

export { calmTheme, calmColors };
