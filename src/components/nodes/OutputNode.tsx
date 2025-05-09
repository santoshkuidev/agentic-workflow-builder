import React from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SettingsIcon from '@mui/icons-material/Settings';
import useFlowStore from '../../state/flowStore';
import { ragnarokColors } from '../../theme/ragnarokTheme';
import type { LayoutDirection } from '../../utils/layoutUtils';
import { 
  outputNodeStyle, 
  nodeHeaderStyle, 
  nodeIconStyle, 
  nodeTitleStyle, 
  nodeDescriptionStyle, 
  nodeContentStyle,
  targetHandleStyle
} from './nodeStyles';
import { OutputNodeShape } from './NodeShapes';

const OutputNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const setSelectedNode = useFlowStore((state) => state.setSelectedNode);
  const layoutDirection = useFlowStore((state) => state.layoutDirection);
  
  const handleConfigClick = () => {
    setSelectedNode(id);
  };

  return (
    <Box
      sx={{
        ...outputNodeStyle,
        position: 'relative',
        zIndex: 1,
        userSelect: 'none',
        transition: 'none',
        transform: 'translate3d(0,0,0)',
        '& *': { pointerEvents: 'auto' }
      }}
      className={selected ? 'selected' : ''}
    >
      {/* Background Shape */}
      <OutputNodeShape color={ragnarokColors.nodes.output} />
      
      {/* Content (positioned above the shape) */}
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={nodeHeaderStyle}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SendIcon sx={nodeIconStyle} />
            <Typography sx={nodeTitleStyle}>
              {data.label || 'Output'}
            </Typography>
          </Box>
          <Tooltip title="Configure Node">
            <IconButton 
              size="small" 
              onClick={handleConfigClick}
              sx={{ 
                color: 'white', 
                bgcolor: 'rgba(0,0,0,0.2)', 
                '&:hover': { bgcolor: 'rgba(0,0,0,0.3)' } 
              }}
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {data.configuration?.description && (
          <Typography sx={nodeDescriptionStyle}>
            {data.configuration.description}
          </Typography>
        )}

        <Box sx={nodeContentStyle}>
          <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
            Type: {data.configuration?.outputType || 'display'}
          </Typography>
        </Box>
      </Box>

      {/* Use different handle positions based on layout direction */}
      {layoutDirection === 'horizontal' ? (
        <Handle
          type="target"
          position={Position.Left}
          id="input"
          style={{
            ...targetHandleStyle,
            transition: 'all 0.3s ease',
            left: -8, // Extend handle position further to the left
            background: ragnarokColors.primary.main
          }}
        />
      ) : (
        <Handle
          type="target"
          position={Position.Top}
          id="input"
          style={{
            ...targetHandleStyle,
            transition: 'all 0.3s ease'
          }}
        />
      )}
    </Box>
  );
};

export default OutputNode;
