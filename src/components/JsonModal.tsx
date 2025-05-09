import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import useFlowStore from '../state/flowStore';

interface JsonModalProps {
  open: boolean;
  onClose: () => void;
}

const JsonModal: React.FC<JsonModalProps> = ({ open, onClose }) => {
  const { nodes, edges, currentWorkflow } = useFlowStore();
  
  const workflowJson = React.useMemo(() => {
    const workflow = {
      ...currentWorkflow,
      nodes,
      edges,
      updatedAt: new Date().toISOString(),
    };
    
    return JSON.stringify(workflow, null, 2);
  }, [currentWorkflow, nodes, edges]);
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(workflowJson);
  };
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { height: '80vh' }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        Workflow JSON
        <Box>
          <IconButton size="small" onClick={handleCopyToClipboard} title="Copy to clipboard">
            <ContentCopyIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onClose} sx={{ ml: 1 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box
          component="pre"
          sx={{
            p: 2,
            bgcolor: 'grey.900',
            color: 'grey.100',
            borderRadius: 1,
            overflow: 'auto',
            fontSize: '0.875rem',
            fontFamily: 'monospace',
            height: '100%',
            m: 0,
          }}
        >
          {workflowJson}
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={handleCopyToClipboard} startIcon={<ContentCopyIcon />}>
          Copy to Clipboard
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JsonModal;
