import React from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import BoltIcon from '@mui/icons-material/Bolt';
import useFlowStore from '../../state/flowStore';
import { ragnarokColors } from '../../theme/ragnarokTheme';
import type { LayoutDirection } from '../../utils/layoutUtils';
import { 
  inputNodeStyle, 
  nodeHeaderStyle, 
  nodeIconStyle, 
  nodeTitleStyle, 
  nodeDescriptionStyle, 
  nodeContentStyle,
  sourceHandleStyle
} from './nodeStyles';
import { InputNodeShape } from './NodeShapes';

const InputNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const setSelectedNode = useFlowStore((state) => state.setSelectedNode);
  const layoutDirection = useFlowStore((state) => state.layoutDirection);
  
  const handleConfigClick = () => {
    setSelectedNode(id);
  };
  

  return (
    <Box
      sx={{
        ...inputNodeStyle,
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
      <InputNodeShape color={ragnarokColors.nodes.input} />
      
      {/* Content (positioned above the shape) */}
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={nodeHeaderStyle}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BoltIcon sx={nodeIconStyle} />
            <Typography sx={nodeTitleStyle}>
              {data.label || 'Input'}
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
            Type: {data.configuration?.inputType || 'text'}
          </Typography>
        </Box>
      </Box>

      {/* Use different handle positions based on layout direction */}
      {layoutDirection === 'horizontal' ? (
        <Handle
          type="source"
          position={Position.Right}
          id="output"
          style={{
            ...sourceHandleStyle,
            transition: 'all 0.3s ease',
            right: -8,  // Extend handle position further to the right
            background: ragnarokColors.primary.main
          }}
        />
      ) : (
        <Handle
          type="source"
          position={Position.Bottom}
          id="output"
          style={{
            ...sourceHandleStyle,
            transition: 'all 0.3s ease'
          }}
        />
      )}
    </Box>
  );
};

export default InputNode;
