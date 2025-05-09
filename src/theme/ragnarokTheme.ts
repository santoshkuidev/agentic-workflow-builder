import { createTheme } from '@mui/material/styles';

// Thor: Ragnarok inspired color palette
const ragnarokColors = {
  // Primary colors
  primary: {
    main: '#00c3ff', // Electric blue (Grandmaster's palace)
    light: '#64f5ff',
    dark: '#0093cc',
    contrastText: '#000000',
  },
  // Secondary colors
  secondary: {
    main: '#ff5722', // Sakaar orange/red (Grandmaster's outfit)
    light: '#ff8a50',
    dark: '#c41c00',
    contrastText: '#ffffff',
  },
  // Accent colors
  accent1: '#9c27b0', // Cosmic purple (Space scenes)
  accent2: '#ffeb3b', // Bright yellow (Thor's lightning)
  accent3: '#4caf50', // Green (Hulk)
  
  // Background colors
  background: {
    default: '#121212', // Dark space background
    paper: '#1e1e1e',
    light: '#2d2d2d',
  },
  
  // Text colors
  text: {
    primary: '#ffffff',
    secondary: '#b3b3b3',
    disabled: '#757575',
  },
  
  // Node colors by type
  nodes: {
    input: '#4caf50', // Green like Hulk
    task: '#00c3ff', // Electric blue like Thor's lightning
    tool: '#9c27b0', // Cosmic purple like space scenes
    router: '#ff5722', // Orange like Sakaar/Grandmaster
    output: '#ffeb3b', // Bright yellow like Thor's lightning
  },
};

// Create the theme
const ragnarokTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: ragnarokColors.primary,
    secondary: ragnarokColors.secondary,
    background: {
      default: ragnarokColors.background.default,
      paper: ragnarokColors.background.paper,
    },
    text: {
      primary: ragnarokColors.text.primary,
      secondary: ragnarokColors.text.secondary,
    },
  },
  typography: {
    fontFamily: '"Rajdhani", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: `linear-gradient(90deg, ${ragnarokColors.background.default} 0%, ${ragnarokColors.primary.dark} 100%)`,
          boxShadow: '0 4px 20px rgba(0, 195, 255, 0.15)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          boxShadow: '0 0 10px rgba(0, 195, 255, 0.2)',
          '&:hover': {
            boxShadow: '0 0 15px rgba(0, 195, 255, 0.4)',
          },
        },
        containedPrimary: {
          background: `linear-gradient(45deg, ${ragnarokColors.primary.dark} 0%, ${ragnarokColors.primary.main} 100%)`,
        },
        containedSecondary: {
          background: `linear-gradient(45deg, ${ragnarokColors.secondary.dark} 0%, ${ragnarokColors.secondary.main} 100%)`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: ragnarokColors.text.primary,
          '&:hover': {
            backgroundColor: 'rgba(0, 195, 255, 0.1)',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: ragnarokColors.text.primary,
          fontSize: '0.75rem',
          border: `1px solid ${ragnarokColors.primary.main}`,
        },
      },
    },
  },
});

export { ragnarokTheme, ragnarokColors };
