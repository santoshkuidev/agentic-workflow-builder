import React from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SettingsIcon from '@mui/icons-material/Settings';
import useFlowStore from '../../state/flowStore';
import { ragnarokColors } from '../../theme/ragnarokTheme';
import type { LayoutDirection } from '../../utils/layoutUtils';
import { 
  taskNodeStyle, 
  nodeHeaderStyle, 
  nodeIconStyle, 
  nodeTitleStyle, 
  nodeDescriptionStyle, 
  nodeContentStyle,
  sourceHandleStyle,
  targetHandleStyle
} from './nodeStyles';
import { TaskNodeShape } from './NodeShapes';

const TaskNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const setSelectedNode = useFlowStore((state) => state.setSelectedNode);
  const layoutDirection = useFlowStore((state) => state.layoutDirection);
  
  const handleConfigClick = () => {
    setSelectedNode(id);
  };
  return (
    <Box
      sx={{
        ...taskNodeStyle,
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
      <TaskNodeShape color={ragnarokColors.nodes.task} />
      
      {/* Content (positioned above the shape) */}
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={nodeHeaderStyle}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SmartToyIcon sx={nodeIconStyle} />
            <Typography sx={nodeTitleStyle}>
              {data.label || 'Task'}
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
            Type: {data.configuration?.taskType || 'summarize'}
          </Typography>
        </Box>
      </Box>

      {/* Use different handle positions based on layout direction */}
      {layoutDirection === 'horizontal' ? (
        <>
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
          <Handle
            type="source"
            position={Position.Right}
            id="output"
            style={{
              ...sourceHandleStyle,
              transition: 'all 0.3s ease',
              right: -8, // Extend handle position further to the right
              background: ragnarokColors.primary.main
            }}
          />
        </>
      ) : (
        <>
          <Handle
            type="target"
            position={Position.Top}
            id="input"
            style={{
              ...targetHandleStyle,
              transition: 'all 0.3s ease'
            }}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="output"
            style={{
              ...sourceHandleStyle,
              transition: 'all 0.3s ease'
            }}
          />
        </>
      )}
    </Box>
  );
};

export default TaskNode;
