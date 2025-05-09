import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Typography,
  Box,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  Menu,
  MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import useFlowStore from '../state/flowStore';
import type { Workflow } from '../types/flow';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`workflow-tabpanel-${index}`}
      aria-labelledby={`workflow-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface WorkflowDialogProps {
  open: boolean;
  onClose: () => void;
}

const WorkflowDialog: React.FC<WorkflowDialogProps> = ({ open, onClose }) => {
  const { 
    workflows, 
    createWorkflow, 
    updateWorkflow, 
    deleteWorkflow, 
    loadWorkflow,
    currentWorkflow
  } = useFlowStore();
  
  const [tabValue, setTabValue] = useState(0);
  const [newWorkflowName, setNewWorkflowName] = useState('');
  const [newWorkflowDescription, setNewWorkflowDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [editingWorkflowId, setEditingWorkflowId] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);

  // Initialize form with current workflow if editing
  useEffect(() => {
    if (editingWorkflowId) {
      const workflow = workflows.find(w => w.id === editingWorkflowId);
      if (workflow) {
        setNewWorkflowName(workflow.name);
        setNewWorkflowDescription(workflow.description || '');
      }
    }
  }, [editingWorkflowId, workflows]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    resetForm();
  };

  const resetForm = () => {
    setNewWorkflowName('');
    setNewWorkflowDescription('');
    setEditingWorkflowId(null);
    setError(null);
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleCreateWorkflow = () => {
    if (!newWorkflowName.trim()) {
      setError('Workflow name is required');
      return;
    }

    try {
      if (editingWorkflowId) {
        updateWorkflow(editingWorkflowId, newWorkflowName, newWorkflowDescription);
        showSnackbar('Workflow updated successfully');
      } else {
        createWorkflow(newWorkflowName, newWorkflowDescription);
        showSnackbar('Workflow created successfully');
      }
      resetForm();
      setTabValue(1); // Switch to the saved workflows tab
    } catch (error) {
      setError('Failed to save workflow');
      console.error(error);
    }
  };
  
  const handleCreateDemoWorkflow = () => {
    try {
      useFlowStore.getState().createDemoWorkflow();
      showSnackbar('Demo workflow created successfully');
      onClose(); // Close the dialog to show the demo workflow
    } catch (error) {
      setError('Failed to create demo workflow');
      console.error(error);
    }
  };
  
  const handleLoadWorkflow = (id: string) => {
    loadWorkflow(id);
    onClose();
    showSnackbar('Workflow loaded successfully');
  };
  
  const handleDeleteWorkflow = (id: string) => {
    deleteWorkflow(id);
    handleCloseMenu();
    showSnackbar('Workflow deleted successfully');
  };
  
  const handleEditWorkflow = (id: string) => {
    setEditingWorkflowId(id);
    setTabValue(0); // Switch to the create/edit tab
    handleCloseMenu();
  };
  
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, workflowId: string) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedWorkflowId(workflowId);
  };
  
  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
    setSelectedWorkflowId(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="workflow tabs">
            <Tab label="Create Workflow" id="workflow-tab-0" aria-controls="workflow-tabpanel-0" />
            <Tab label="Saved Workflows" id="workflow-tab-1" aria-controls="workflow-tabpanel-1" />
          </Tabs>
        </DialogTitle>
        
        <DialogContent dividers>
          <TabPanel value={tabValue} index={0}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <TextField
              label="Workflow Name"
              value={newWorkflowName}
              onChange={(e) => setNewWorkflowName(e.target.value)}
              fullWidth
              margin="normal"
              required
              error={!!error && !newWorkflowName.trim()}
              helperText={error && !newWorkflowName.trim() ? 'Workflow name is required' : ''}
            />
            
            <TextField
              label="Description (optional)"
              value={newWorkflowDescription}
              onChange={(e) => setNewWorkflowDescription(e.target.value)}
              fullWidth
              margin="normal"
              multiline
              rows={3}
            />
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCreateDemoWorkflow}
              >
                Create from pre-built workflow template.
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateWorkflow}
                disabled={!newWorkflowName.trim()}
              >
                {editingWorkflowId ? 'Update Workflow' : 'Create Workflow'}
              </Button>
            </Box>
            
            {editingWorkflowId && (
              <Box sx={{ mt: 2 }}>
                <Button variant="text" onClick={resetForm}>
                  Cancel Editing
                </Button>
              </Box>
            )}
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            {workflows.length === 0 ? (
              <Typography variant="body1" color="text.secondary" align="center">
                No workflows saved yet. Create a new workflow to get started.
              </Typography>
            ) : (
              <List>
                {workflows.map((workflow) => (
                  <ListItem 
                    key={workflow.id}
                    sx={{ 
                      mb: 1, 
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      bgcolor: currentWorkflow?.id === workflow.id ? 'action.selected' : 'transparent'
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle1" component="span">
                            {workflow.name}
                          </Typography>
                          {currentWorkflow?.id === workflow.id && (
                            <Typography 
                              variant="caption" 
                              component="span" 
                              sx={{ ml: 1, bgcolor: 'primary.main', color: 'white', px: 1, py: 0.5, borderRadius: 1 }}
                            >
                              Active
                            </Typography>
                          )}
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" component="span" sx={{ display: 'block' }}>
                            {workflow.description || 'No description'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Last updated: {formatDate(workflow.updatedAt)}
                          </Typography>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleLoadWorkflow(workflow.id)}
                        sx={{ mr: 1 }}
                      >
                        Load
                      </Button>
                      <IconButton 
                        edge="end" 
                        aria-label="more options"
                        onClick={(e) => handleOpenMenu(e, workflow.id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </TabPanel>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
      
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => selectedWorkflowId && handleEditWorkflow(selectedWorkflowId)}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => selectedWorkflowId && handleDeleteWorkflow(selectedWorkflowId)}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </>
  );
};

export default WorkflowDialog;
