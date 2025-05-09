import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
} from '@mui/material';
import useFlowStore from '../state/flowStore';
import { executeWorkflow } from '../services/openai';

interface ExecutionDialogProps {
  open: boolean;
  onClose: () => void;
}

const ExecutionDialog: React.FC<ExecutionDialogProps> = ({ open, onClose }) => {
  const { nodes, edges } = useFlowStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  // Find input nodes
  const inputNodes = nodes.filter(node => node.type === 'input');
  const outputNodes = nodes.filter(node => node.type === 'output');
  
  const handleRun = async () => {
    setLoading(true);
    setError(null);
    setResults({});
    
    try {
      // Initialize OpenAI with API key
      if (!apiKey) {
        throw new Error('OpenAI API key is required');
      }
      
      // Import dynamically to avoid initialization issues
      const openaiService = await import('../services/openai');
      openaiService.initializeOpenAI(apiKey);
      
      // Execute the workflow
      const workflowResults = await openaiService.executeWorkflow(nodes, edges, input);
      setResults(workflowResults);
      setActiveStep(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  const handleClose = () => {
    setInput('');
    setResults({});
    setError(null);
    setActiveStep(0);
    onClose();
  };
  
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Execute Workflow</DialogTitle>
      
      <DialogContent dividers>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          <Step>
            <StepLabel>Configure</StepLabel>
          </Step>
          <Step>
            <StepLabel>Results</StepLabel>
          </Step>
        </Stepper>
        
        {activeStep === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="OpenAI API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              fullWidth
              type="password"
              required
              helperText="Required to execute the workflow"
            />
            
            <TextField
              label="Input Text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              fullWidth
              multiline
              rows={6}
              placeholder="Enter text to process..."
              helperText={`This will be sent to ${inputNodes.length} input node(s)`}
            />
            
            {error && (
              <Typography color="error" variant="body2">
                Error: {error}
              </Typography>
            )}
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {outputNodes.map((node) => (
              <Paper key={node.id} variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {node.data.label}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'grey.100',
                    borderRadius: 1,
                    maxHeight: 200,
                    overflow: 'auto',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {results[node.id] || 'No output generated'}
                </Box>
              </Paper>
            ))}
            
            {outputNodes.length === 0 && (
              <Typography color="text.secondary" align="center">
                No output nodes found in the workflow
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>
      
      <DialogActions>
        {activeStep === 0 ? (
          <>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleRun}
              disabled={loading || !apiKey}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? 'Running...' : 'Run Workflow'}
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => setActiveStep(0)}>Back</Button>
            <Button variant="contained" onClick={handleClose}>
              Close
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ExecutionDialog;
