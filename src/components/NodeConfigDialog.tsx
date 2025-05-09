import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  IconButton,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import useFlowStore from '../state/flowStore';
import type { NodeConfiguration } from '../types/flow';

interface NodeConfigDialogProps {
  open: boolean;
  onClose: () => void;
}

// Custom draggable paper component that doesn't use findDOMNode
function DraggablePaper(props: any) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dialogRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.draggable-dialog-title')) {
      setIsDragging(true);
      const startX = e.clientX - position.x;
      const startY = e.clientY - position.y;
      
      const handleMouseMove = (moveEvent: MouseEvent) => {
        setPosition({
          x: moveEvent.clientX - startX,
          y: moveEvent.clientY - startY
        });
      };
      
      const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };
  
  return (
    <Paper 
      {...props} 
      ref={dialogRef}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'default',
        ...props.style
      }}
      onMouseDown={handleMouseDown}
    />
  );
}

const NodeConfigDialog: React.FC<NodeConfigDialogProps> = ({ open, onClose }) => {
  const selectedNode = useFlowStore((state) => state.selectedNode);
  const updateNodeConfiguration = useFlowStore((state) => state.updateNodeConfiguration);

  const [config, setConfig] = useState<NodeConfiguration>({
    name: '',
  });

  // Initialize form when selected node changes
  useEffect(() => {
    if (selectedNode) {
      setConfig(selectedNode.data.configuration || { name: '' });
    }
  }, [selectedNode]);

  // Use a more generic event handler that works with all Material UI input components
  const handleChange = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    
    if (name) {
      setConfig((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = () => {
    if (selectedNode) {
      updateNodeConfiguration(selectedNode.id, config);
      onClose();
    }
  };
  
  // Ensure dialog closes properly on first click
  const handleClose = (event: React.MouseEvent) => {
    event.stopPropagation();
    onClose();
  };

  if (!selectedNode) return null;

  const nodeType = selectedNode.type;

  const renderNodeSpecificFields = () => {
    switch (nodeType) {
      case 'input':
        return (
          <>
            <FormControl fullWidth size="small">
              <InputLabel>Input Type</InputLabel>
              <Select
                name="inputType"
                value={config.inputType || 'text'}
                onChange={handleChange}
                label="Input Type"
              >
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="file">File</MenuItem>
                <MenuItem value="api">API</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Default Value"
              name="defaultValue"
              value={config.defaultValue || ''}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
              multiline
              rows={3}
            />
          </>
        );
      case 'task':
        return (
          <>
            <FormControl fullWidth size="small">
              <InputLabel>Task Type</InputLabel>
              <Select
                name="taskType"
                value={config.taskType || 'summarize'}
                onChange={handleChange}
                label="Task Type"
              >
                <MenuItem value="summarize">Summarize</MenuItem>
                <MenuItem value="analyze">Analyze</MenuItem>
                <MenuItem value="transform">Transform</MenuItem>
                <MenuItem value="call-api">Call API</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Prompt / Instructions"
              name="prompt"
              value={config.prompt || ''}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
              multiline
              rows={4}
            />
            {config.taskType === 'call-api' && (
              <>
                <TextField
                  label="API Endpoint"
                  name="apiEndpoint"
                  value={config.apiEndpoint || ''}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
                <TextField
                  label="API Key"
                  name="apiKey"
                  value={config.apiKey || ''}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  type="password"
                />
              </>
            )}
          </>
        );
      case 'tool':
        return (
          <>
            <FormControl fullWidth size="small">
              <InputLabel>Tool Type</InputLabel>
              <Select
                name="toolType"
                value={config.toolType || 'web-search'}
                onChange={handleChange}
                label="Tool Type"
              >
                <MenuItem value="web-search">Web Search</MenuItem>
                <MenuItem value="code-execution">Code Execution</MenuItem>
                <MenuItem value="database">Database Query</MenuItem>
                <MenuItem value="file-system">File System</MenuItem>
                <MenuItem value="custom">Custom Tool</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Tool Configuration"
              name="toolConfig"
              value={config.toolConfig || ''}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
              multiline
              rows={3}
              helperText="Configuration details for the tool (JSON format)"
            />
            <TextField
              label="Tool Parameters"
              name="toolParameters"
              value={config.toolParameters || ''}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
              multiline
              rows={3}
              helperText="Parameters to pass to the tool (JSON format)"
            />
          </>
        );
      case 'router':
        return (
          <>
            <FormControl fullWidth size="small">
              <InputLabel>Router Type</InputLabel>
              <Select
                name="routerType"
                value={config.routerType || 'condition'}
                onChange={handleChange}
                label="Router Type"
              >
                <MenuItem value="condition">Condition</MenuItem>
                <MenuItem value="switch">Switch</MenuItem>
                <MenuItem value="parallel">Parallel</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Conditions"
              name="conditions"
              value={config.conditions || ''}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
              multiline
              rows={4}
              helperText="Define conditions for routing (JavaScript expression or JSON)"
            />
            <TextField
              label="Default Route"
              name="defaultRoute"
              value={config.defaultRoute || ''}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
              helperText="Path to take if no conditions match"
            />
          </>
        );
      case 'output':
        return (
          <>
            <FormControl fullWidth size="small">
              <InputLabel>Output Type</InputLabel>
              <Select
                name="outputType"
                value={config.outputType || 'display'}
                onChange={handleChange}
                label="Output Type"
              >
                <MenuItem value="display">Display</MenuItem>
                <MenuItem value="notification">Notification</MenuItem>
                <MenuItem value="download">Download</MenuItem>
                <MenuItem value="api">API</MenuItem>
              </Select>
              <FormHelperText>How to handle the output</FormHelperText>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Format</InputLabel>
              <Select
                name="format"
                value={config.format || 'text'}
                onChange={handleChange}
                label="Format"
              >
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="json">JSON</MenuItem>
                <MenuItem value="csv">CSV</MenuItem>
              </Select>
              <FormHelperText>Output format</FormHelperText>
            </FormControl>

            {config.outputType === 'api' && (
              <TextField
                label="Destination"
                name="destination"
                value={config.destination || ''}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                size="small"
                placeholder="API endpoint URL"
              />
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperComponent={DraggablePaper}
      aria-labelledby="draggable-dialog-title"
      maxWidth="sm"
      fullWidth
      hideBackdrop
      disableEnforceFocus
      sx={{ pointerEvents: 'none' }}
      PaperProps={{ sx: { pointerEvents: 'auto' } }}
    >
      <DialogTitle 
        className="draggable-dialog-title"
        style={{ cursor: 'move' }}
        id="draggable-dialog-title"
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DragIndicatorIcon fontSize="small" color="action" />
            <Typography variant="h6">Configure {nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} Node</Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          {/* Common fields for all node types */}
          <TextField
            label="Node Name"
            name="name"
            value={config.name || ''}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            size="small"
          />

          <TextField
            label="Description"
            name="description"
            value={config.description || ''}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            size="small"
            multiline
            rows={2}
          />

          {renderNodeSpecificFields()}
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default NodeConfigDialog;
