import React from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import useFlowStore from '../../state/flowStore';
import type { WorkflowNode } from '../../types/flow';
import type { LayoutDirection } from '../../utils/layoutUtils';

interface BaseNodeProps extends NodeProps {
  title: string;
  color: string;
  icon: React.ReactNode;
  isSource?: boolean;
  isTarget?: boolean;
  layoutDirection?: LayoutDirection;
}

const BaseNode: React.FC<BaseNodeProps> = ({ 
  data, 
  isConnectable, 
  title, 
  color, 
  icon, 
  isSource = true, 
  isTarget = true,
  layoutDirection = 'vertical'
}) => {
  const setSelectedNode = useFlowStore(state => state.setSelectedNode);
  const currentLayoutDirection = useFlowStore(state => state.layoutDirection) || layoutDirection;
  
  const handleConfigClick = () => {
    setSelectedNode(data.id);
  };

  return (
    <Card 
      sx={{ 
        minWidth: 180, 
        borderTop: `4px solid ${color}`,
        boxShadow: 2
      }}
    >
      {isTarget && (
        <Handle
          type="target"
          position={currentLayoutDirection === 'horizontal' ? Position.Top : Position.Left}
          isConnectable={isConnectable}
          style={{ 
            background: color,
            transition: 'all 0.3s ease'
          }}
        />
      )}
      
      <CardContent sx={{ p: 1.5, pb: '8px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box sx={{ mr: 1, color }}>{icon}</Box>
          <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <IconButton 
            size="small" 
            onClick={handleConfigClick}
            sx={{ p: 0.5 }}
          >
            <SettingsIcon fontSize="small" />
          </IconButton>
        </Box>
        
        <Typography variant="body2" color="text.secondary" noWrap>
          {data.label}
        </Typography>
      </CardContent>
      
      {isSource && (
        <Handle
          type="source"
          position={currentLayoutDirection === 'horizontal' ? Position.Bottom : Position.Right}
          isConnectable={isConnectable}
          style={{ 
            background: color,
            transition: 'all 0.3s ease'
          }}
        />
      )}
    </Card>
  );
};

export default BaseNode;
