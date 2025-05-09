import React from 'react';
import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { alpha } from '@mui/material/styles';

// Base shape container styles
const shapeContainerStyle: SxProps<Theme> = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
  zIndex: 0,
  userSelect: 'none',
  touchAction: 'none',
  willChange: 'transform',
};

// Input Node Shape (Lightning Bolt / Trigger)
export const InputNodeShape: React.FC<{ color: string }> = ({ color }) => (
  <Box sx={shapeContainerStyle}>
    <svg width="100%" height="100%" viewBox="0 0 220 100" preserveAspectRatio="none">
      <path
        d="M0,20 C0,8.954 8.954,0 20,0 H200 C211.046,0 220,8.954 220,20 V80 C220,91.046 211.046,100 200,100 H50 L30,100 L20,80 H20 C8.954,80 0,71.046 0,60 V20 Z"
        fill={alpha(color, 0.2)}
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M40,40 L60,40 L50,60 L70,60 L40,85 L45,60 L30,60 Z"
        fill={alpha(color, 0.6)}
        stroke={color}
        strokeWidth="1"
      />
    </svg>
  </Box>
);

// Task Node Shape (AI Agent / Robot)
export const TaskNodeShape: React.FC<{ color: string }> = ({ color }) => (
  <Box sx={shapeContainerStyle}>
    <svg width="100%" height="100%" viewBox="0 0 220 100" preserveAspectRatio="none">
      <rect
        x="0"
        y="0"
        width="220"
        height="100"
        rx="10"
        ry="10"
        fill={alpha(color, 0.2)}
        stroke={color}
        strokeWidth="2"
      />
      <circle
        cx="40"
        cy="40"
        r="15"
        fill={alpha(color, 0.6)}
        stroke={color}
        strokeWidth="1"
      />
      <rect
        x="30"
        y="35"
        width="20"
        height="10"
        rx="2"
        ry="2"
        fill={alpha(color, 0.8)}
      />
      <line
        x1="25"
        y1="50"
        x2="55"
        y2="50"
        stroke={color}
        strokeWidth="1"
      />
    </svg>
  </Box>
);

// Tool Node Shape (Wrench / Tool)
export const ToolNodeShape: React.FC<{ color: string }> = ({ color }) => (
  <Box sx={shapeContainerStyle}>
    <svg width="100%" height="100%" viewBox="0 0 220 100" preserveAspectRatio="none">
      <path
        d="M0,20 C0,8.954 8.954,0 20,0 H200 C211.046,0 220,8.954 220,20 V80 C220,91.046 211.046,100 200,100 H20 C8.954,100 0,91.046 0,80 V20 Z"
        fill={alpha(color, 0.2)}
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M30,30 L45,45 L40,50 L50,60 L55,55 L65,65 L60,70 L70,80 L80,70 L70,60 L75,55 L65,45 L60,50 L50,40 L45,35 Z"
        fill={alpha(color, 0.6)}
        stroke={color}
        strokeWidth="1"
      />
    </svg>
  </Box>
);

// Router Node Shape (Switch / Branch)
export const RouterNodeShape: React.FC<{ color: string }> = ({ color }) => (
  <Box sx={shapeContainerStyle}>
    <svg width="100%" height="100%" viewBox="0 0 220 100" preserveAspectRatio="none">
      <path
        d="M0,20 C0,8.954 8.954,0 20,0 H200 C211.046,0 220,8.954 220,20 V80 C220,91.046 211.046,100 200,100 H20 C8.954,100 0,91.046 0,80 V20 Z"
        fill={alpha(color, 0.2)}
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M40,30 L60,30 L60,45 L80,45 L80,30 L100,50 L80,70 L80,55 L60,55 L60,70 L40,50 Z"
        fill={alpha(color, 0.6)}
        stroke={color}
        strokeWidth="1"
      />
    </svg>
  </Box>
);

// Output Node Shape (Send / Output)
export const OutputNodeShape: React.FC<{ color: string }> = ({ color }) => (
  <Box sx={shapeContainerStyle}>
    <svg width="100%" height="100%" viewBox="0 0 220 100" preserveAspectRatio="none">
      <path
        d="M0,20 C0,8.954 8.954,0 20,0 H200 C211.046,0 220,8.954 220,20 V80 C220,91.046 211.046,100 200,100 H20 C8.954,100 0,91.046 0,80 V20 Z"
        fill={alpha(color, 0.2)}
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M40,40 L70,40 L70,30 L100,50 L70,70 L70,60 L40,60 Z"
        fill={alpha(color, 0.6)}
        stroke={color}
        strokeWidth="1"
      />
    </svg>
  </Box>
);
