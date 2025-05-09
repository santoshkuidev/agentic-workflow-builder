import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Tooltip,
  alpha
} from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SendIcon from '@mui/icons-material/Send';
import BuildIcon from '@mui/icons-material/Build';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import { ragnarokColors } from '../theme/ragnarokTheme';

interface SidebarProps {
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onDragStart }) => {
  return (
    <Paper 
      elevation={2} 
      sx={{ 
        width: '100%', 
        height: '100%', 
        overflowY: 'auto',
        overflowX: 'hidden',
        borderRadius: 0,
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(135deg, ${ragnarokColors.background.paper} 0%, ${ragnarokColors.background.light} 100%)`,
        border: 'none',
      }}
    >
      <Box 
        className="sidebar-header"
        sx={{ 
          p: 2, 
          background: `linear-gradient(90deg, ${ragnarokColors.primary.main} 0%, ${ragnarokColors.accent1} 100%)`,
          color: 'white',
          boxShadow: `0 4px 20px rgba(0, 195, 255, 0.25)`,
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            textShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            fontSize: '1.1rem'
          }}
        >
          Available Nodes
        </Typography>
      </Box>
      
      <List sx={{ p: 0, overflowY: 'auto', overflowX: 'hidden' }}>
        <Tooltip title="Drag to canvas to add an Input node" placement="right" arrow>
          <ListItem 
            draggable
            onDragStart={(event) => onDragStart(event, 'input')}
            sx={{ 
              cursor: 'grab',
              borderRadius: 1,
              m: 1,
              py: 0.75,
              transition: 'all 0.3s ease',
              border: `1px solid ${alpha(ragnarokColors.nodes.input, 0.2)}`,
              background: `linear-gradient(145deg, ${alpha(ragnarokColors.nodes.input, 0.05)} 0%, ${alpha(ragnarokColors.nodes.input, 0.1)} 100%)`,
              '&:hover': { 
                transform: 'translateY(-2px)',
                boxShadow: `0 4px 10px ${alpha(ragnarokColors.nodes.input, 0.3)}`,
                background: `linear-gradient(145deg, ${alpha(ragnarokColors.nodes.input, 0.1)} 0%, ${alpha(ragnarokColors.nodes.input, 0.2)} 100%)`,
              },
              maxWidth: '100%',
              boxSizing: 'border-box'
            }}
          >
            <ListItemIcon sx={{ color: ragnarokColors.nodes.input }}>
              <TextFieldsIcon sx={{ filter: `drop-shadow(0 0 3px ${alpha(ragnarokColors.nodes.input, 0.5)})` }} />
            </ListItemIcon>
            <ListItemText 
              primary={
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis' }}>Text Input</Typography>
              }
              secondary={
                <Typography variant="caption" sx={{ opacity: 0.7, overflow: 'hidden', textOverflow: 'ellipsis' }}>Start</Typography>
              }
              sx={{ overflow: 'hidden' }}
            />
          </ListItem>
        </Tooltip>
        
        <Divider />
        
        <Tooltip title="Drag to canvas to add a Task node" placement="right" arrow>
          <ListItem 
            draggable
            onDragStart={(event) => onDragStart(event, 'task')}
            sx={{ 
              cursor: 'grab',
              borderRadius: 1,
              m: 1,
              py: 0.75,
              transition: 'all 0.3s ease',
              border: `1px solid ${alpha(ragnarokColors.nodes.task, 0.2)}`,
              background: `linear-gradient(145deg, ${alpha(ragnarokColors.nodes.task, 0.05)} 0%, ${alpha(ragnarokColors.nodes.task, 0.1)} 100%)`,
              '&:hover': { 
                transform: 'translateY(-2px)',
                boxShadow: `0 4px 10px ${alpha(ragnarokColors.nodes.task, 0.3)}`,
                background: `linear-gradient(145deg, ${alpha(ragnarokColors.nodes.task, 0.1)} 0%, ${alpha(ragnarokColors.nodes.task, 0.2)} 100%)`,
              },
              maxWidth: '100%',
              boxSizing: 'border-box'
            }}
          >
            <ListItemIcon sx={{ color: ragnarokColors.nodes.task }}>
              <PsychologyIcon sx={{ filter: `drop-shadow(0 0 3px ${alpha(ragnarokColors.nodes.task, 0.5)})` }} />
            </ListItemIcon>
            <ListItemText 
              primary={
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis' }}>Task</Typography>
              }
              secondary={
                <Typography variant="caption" sx={{ opacity: 0.7, overflow: 'hidden', textOverflow: 'ellipsis' }}>Process</Typography>
              }
              sx={{ overflow: 'hidden' }}
            />
          </ListItem>
        </Tooltip>
        
        <Divider />
        
        <Tooltip title="Drag to canvas to add a Tool node" placement="right" arrow>
          <ListItem 
            draggable
            onDragStart={(event) => onDragStart(event, 'tool')}
            sx={{ 
              cursor: 'grab',
              borderRadius: 1,
              m: 1,
              py: 0.75,
              transition: 'all 0.3s ease',
              border: `1px solid ${alpha(ragnarokColors.nodes.tool, 0.2)}`,
              background: `linear-gradient(145deg, ${alpha(ragnarokColors.nodes.tool, 0.05)} 0%, ${alpha(ragnarokColors.nodes.tool, 0.1)} 100%)`,
              '&:hover': { 
                transform: 'translateY(-2px)',
                boxShadow: `0 4px 10px ${alpha(ragnarokColors.nodes.tool, 0.3)}`,
                background: `linear-gradient(145deg, ${alpha(ragnarokColors.nodes.tool, 0.1)} 0%, ${alpha(ragnarokColors.nodes.tool, 0.2)} 100%)`,
              },
              maxWidth: '100%',
              boxSizing: 'border-box'
            }}
          >
            <ListItemIcon sx={{ color: ragnarokColors.nodes.tool }}>
              <BuildIcon sx={{ filter: `drop-shadow(0 0 3px ${alpha(ragnarokColors.nodes.tool, 0.5)})` }} />
            </ListItemIcon>
            <ListItemText 
              primary={
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis' }}>Tool</Typography>
              }
              secondary={
                <Typography variant="caption" sx={{ opacity: 0.7, overflow: 'hidden', textOverflow: 'ellipsis' }}>Integrate</Typography>
              }
              sx={{ overflow: 'hidden' }}
            />
          </ListItem>
        </Tooltip>
        
        <Divider />
        
        <Tooltip title="Drag to canvas to add a Router node" placement="right" arrow>
          <ListItem 
            draggable
            onDragStart={(event) => onDragStart(event, 'router')}
            sx={{ 
              cursor: 'grab',
              borderRadius: 1,
              m: 1,
              py: 0.75,
              transition: 'all 0.3s ease',
              border: `1px solid ${alpha(ragnarokColors.nodes.router, 0.2)}`,
              background: `linear-gradient(145deg, ${alpha(ragnarokColors.nodes.router, 0.05)} 0%, ${alpha(ragnarokColors.nodes.router, 0.1)} 100%)`,
              '&:hover': { 
                transform: 'translateY(-2px)',
                boxShadow: `0 4px 10px ${alpha(ragnarokColors.nodes.router, 0.3)}`,
                background: `linear-gradient(145deg, ${alpha(ragnarokColors.nodes.router, 0.1)} 0%, ${alpha(ragnarokColors.nodes.router, 0.2)} 100%)`,
              },
              maxWidth: '100%',
              boxSizing: 'border-box'
            }}
          >
            <ListItemIcon sx={{ color: ragnarokColors.nodes.router }}>
              <CallSplitIcon sx={{ filter: `drop-shadow(0 0 3px ${alpha(ragnarokColors.nodes.router, 0.5)})` }} />
            </ListItemIcon>
            <ListItemText 
              primary={
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis' }}>Router</Typography>
              }
              secondary={
                <Typography variant="caption" sx={{ opacity: 0.7, overflow: 'hidden', textOverflow: 'ellipsis' }}>Branch</Typography>
              }
              sx={{ overflow: 'hidden' }}
            />
          </ListItem>
        </Tooltip>
        
        <Divider />
        
        <Tooltip title="Drag to canvas to add an Output node" placement="right" arrow>
          <ListItem 
            draggable
            onDragStart={(event) => onDragStart(event, 'output')}
            sx={{ 
              cursor: 'grab',
              borderRadius: 1,
              m: 1,
              py: 0.75,
              transition: 'all 0.3s ease',
              border: `1px solid ${alpha(ragnarokColors.nodes.output, 0.2)}`,
              background: `linear-gradient(145deg, ${alpha(ragnarokColors.nodes.output, 0.05)} 0%, ${alpha(ragnarokColors.nodes.output, 0.1)} 100%)`,
              '&:hover': { 
                transform: 'translateY(-2px)',
                boxShadow: `0 4px 10px ${alpha(ragnarokColors.nodes.output, 0.3)}`,
                background: `linear-gradient(145deg, ${alpha(ragnarokColors.nodes.output, 0.1)} 0%, ${alpha(ragnarokColors.nodes.output, 0.2)} 100%)`,
              },
              maxWidth: '100%',
              boxSizing: 'border-box'
            }}
          >
            <ListItemIcon sx={{ color: ragnarokColors.nodes.output }}>
              <SendIcon sx={{ filter: `drop-shadow(0 0 3px ${alpha(ragnarokColors.nodes.output, 0.5)})` }} />
            </ListItemIcon>
            <ListItemText 
              primary={
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis' }}>Output</Typography>
              }
              secondary={
                <Typography variant="caption" sx={{ opacity: 0.7, overflow: 'hidden', textOverflow: 'ellipsis' }}>Results</Typography>
              }
              sx={{ overflow: 'hidden' }}
            />
          </ListItem>
        </Tooltip>
      </List>
      
      <Box sx={{ p: 2, mt: 'auto', width: '100%', boxSizing: 'border-box' }}>
        <Typography 
          variant="caption" 
          sx={{ 
            color: alpha(ragnarokColors.primary.main, 0.8),
            display: 'block',
            textAlign: 'center',
            fontStyle: 'italic',
            textShadow: `0 0 5px ${alpha(ragnarokColors.primary.main, 0.5)}`,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'normal',
            width: '100%'
          }}
        >
          Drag nodes onto the canvas to build your workflow
        </Typography>
      </Box>
    </Paper>
  );
};

export default Sidebar;
