import { alpha } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';
import { ragnarokColors } from '../../theme/ragnarokTheme';

// Common node styles
export const baseNodeStyle: SxProps<Theme> = {
  border: '2px solid',
  borderRadius: 2,
  padding: 1.5,
  width: 220,
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
  position: 'relative',
  overflow: 'hidden',
  userSelect: 'none',
  touchAction: 'none',
  willChange: 'transform',
  transform: 'translate3d(0,0,0)',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at top right, rgba(255,255,255,0.15), transparent 70%)',
    pointerEvents: 'none',
  },
  '&:hover': {
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.4)',
  },
  '&.selected': {
    boxShadow: '0 0 0 2px #ffffff, 0 6px 15px rgba(0, 0, 0, 0.4)',
  }
};

// Node type specific styles
export const inputNodeStyle: SxProps<Theme> = {
  ...baseNodeStyle,
  background: `linear-gradient(135deg, ${alpha(ragnarokColors.nodes.input, 0.8)} 0%, ${alpha(ragnarokColors.nodes.input, 0.6)} 100%)`,
  borderColor: ragnarokColors.nodes.input,
  '&.selected': {
    boxShadow: `0 0 0 2px #ffffff, 0 0 15px ${ragnarokColors.nodes.input}`,
  }
};

export const taskNodeStyle: SxProps<Theme> = {
  ...baseNodeStyle,
  background: `linear-gradient(135deg, ${alpha(ragnarokColors.nodes.task, 0.8)} 0%, ${alpha(ragnarokColors.nodes.task, 0.6)} 100%)`,
  borderColor: ragnarokColors.nodes.task,
  '&.selected': {
    boxShadow: `0 0 0 2px #ffffff, 0 0 15px ${ragnarokColors.nodes.task}`,
  }
};

export const toolNodeStyle: SxProps<Theme> = {
  ...baseNodeStyle,
  background: `linear-gradient(135deg, ${alpha(ragnarokColors.nodes.tool, 0.8)} 0%, ${alpha(ragnarokColors.nodes.tool, 0.6)} 100%)`,
  borderColor: ragnarokColors.nodes.tool,
  '&.selected': {
    boxShadow: `0 0 0 2px #ffffff, 0 0 15px ${ragnarokColors.nodes.tool}`,
  }
};

export const routerNodeStyle: SxProps<Theme> = {
  ...baseNodeStyle,
  background: `linear-gradient(135deg, ${alpha(ragnarokColors.nodes.router, 0.8)} 0%, ${alpha(ragnarokColors.nodes.router, 0.6)} 100%)`,
  borderColor: ragnarokColors.nodes.router,
  '&.selected': {
    boxShadow: `0 0 0 2px #ffffff, 0 0 15px ${ragnarokColors.nodes.router}`,
  }
};

export const outputNodeStyle: SxProps<Theme> = {
  ...baseNodeStyle,
  background: `linear-gradient(135deg, ${alpha(ragnarokColors.nodes.output, 0.8)} 0%, ${alpha(ragnarokColors.nodes.output, 0.6)} 100%)`,
  borderColor: ragnarokColors.nodes.output,
  '&.selected': {
    boxShadow: `0 0 0 2px #ffffff, 0 0 15px ${ragnarokColors.nodes.output}`,
  }
};

// Header styles for nodes
export const nodeHeaderStyle: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  mb: 1,
};

export const nodeIconStyle: SxProps<Theme> = {
  color: '#ffffff',
  mr: 1,
  filter: 'drop-shadow(0 0 3px rgba(0, 0, 0, 0.3))',
};

export const nodeTitleStyle: SxProps<Theme> = {
  fontWeight: 'bold',
  fontSize: '1rem',
  color: '#ffffff',
  textShadow: '0 0 5px rgba(0, 0, 0, 0.5)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export const nodeDescriptionStyle: SxProps<Theme> = {
  fontSize: '0.75rem',
  color: 'rgba(255, 255, 255, 0.8)',
  mb: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
};

export const nodeContentStyle: SxProps<Theme> = {
  fontSize: '0.8rem',
  color: 'rgba(255, 255, 255, 0.9)',
  p: 1,
  borderRadius: 1,
  background: 'rgba(0, 0, 0, 0.2)',
  backdropFilter: 'blur(5px)',
  maxHeight: 80,
  overflow: 'auto',
};

// Handle styles
export const handleStyle = {
  width: 12,
  height: 12,
  border: '2px solid #ffffff',
  borderRadius: '50%',
  background: '#ffffff',
  boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.2)',
    boxShadow: '0 0 8px rgba(255, 255, 255, 0.5)',
  },
};

export const sourceHandleStyle = {
  ...handleStyle,
  bottom: -6,
  background: '#ffffff',
};

export const targetHandleStyle = {
  ...handleStyle,
  top: -6,
  background: '#ffffff',
};

// Button styles
export const nodeButtonStyle: SxProps<Theme> = {
  minWidth: 'unset',
  padding: '4px 8px',
  fontSize: '0.7rem',
  borderRadius: 1,
  textTransform: 'none',
  fontWeight: 'bold',
  background: 'rgba(255, 255, 255, 0.2)',
  color: '#ffffff',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.3)',
  },
};

// Badge styles
export const nodeBadgeStyle: SxProps<Theme> = {
  position: 'absolute',
  top: 8,
  right: 8,
  borderRadius: '50%',
  width: 20,
  height: 20,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(255, 255, 255, 0.2)',
  color: '#ffffff',
  fontSize: '0.7rem',
  fontWeight: 'bold',
  boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
};
