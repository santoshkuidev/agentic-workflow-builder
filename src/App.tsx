import { useState, useEffect, useCallback, useRef } from 'react';
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  IconButton,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CodeIcon from '@mui/icons-material/Code';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Dark mode icon
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Light mode icon
import { ThemeProvider, useTheme } from './theme/ThemeContext';
import './styles/ragnarok.css';

import FlowCanvas from './components/FlowCanvas';
import Sidebar from './components/Sidebar';
import NodeConfigDialog from './components/NodeConfigDialog';
import JsonModal from './components/JsonModal';
import WorkflowDialog from './components/WorkflowDialog';
import ExecutionDialog from './components/ExecutionDialog';
import useFlowStore from './state/flowStore';

/**
 * Main content of the application
 */
function AppContent() {
  const selectedNode = useFlowStore((state) => state.selectedNode);
  const [configDrawerOpen, setConfigDrawerOpen] = useState(false);
  const [jsonModalOpen, setJsonModalOpen] = useState(false);
  const [workflowDialogOpen, setWorkflowDialogOpen] = useState(false);
  const [executionDialogOpen, setExecutionDialogOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Ref for the dropdown menu
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle drag start for sidebar items
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  // Function to clear the current workflow
  const clearWorkflow = useCallback(() => {
    const onNodesChange = useFlowStore.getState().onNodesChange;
    const onEdgesChange = useFlowStore.getState().onEdgesChange;
    
    // Clear all nodes and edges
    onNodesChange([{ type: 'remove', id: 'all' }]);
    onEdgesChange([{ type: 'remove', id: 'all' }]);
  }, []);

  // Handle closing the config dialog
  const handleCloseConfigDialog = useCallback(() => {
    setConfigDrawerOpen(false);
    // Clear selected node when dialog is closed
    setTimeout(() => {
      useFlowStore.getState().setSelectedNode(null);
    }, 100); // Small delay to ensure proper cleanup
  }, []);
  
  // Update dialog state when selected node changes
  useEffect(() => {
    if (selectedNode) {
      setConfigDrawerOpen(true);
    }
  }, [selectedNode]);

  // Get theme toggle function from context
  const { themeMode, toggleTheme } = useTheme();
  
  // Handle clicks outside of dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    
    // Add event listener when dropdown is open
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Clean up the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);
  
  return (
    <>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
        {/* App Bar */}
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="toggle sidebar"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="toolbar-button"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                flexGrow: 1, 
                fontWeight: 'bold',
                background: themeMode === 'ragnarok' ? 'linear-gradient(45deg, #00c3ff 30%, #9c27b0 90%)' : 'none',
                WebkitBackgroundClip: themeMode === 'ragnarok' ? 'text' : 'unset',
                WebkitTextFillColor: themeMode === 'ragnarok' ? 'transparent' : 'inherit',
                textShadow: themeMode === 'ragnarok' ? '0 0 10px rgba(0, 195, 255, 0.5)' : 'none',
                letterSpacing: '1px'
              }}
            >
              AGENTIC WORKFLOW BUILDER
            </Typography>
            
            {/* New Workflow Dropdown Button */}
            <Box sx={{ position: 'relative', marginRight: 1 }}>
              <Box 
                className="workflow-dropdown"
                ref={dropdownRef}
                sx={{
                  position: 'relative',
                }}
              >
                <Button
                  color="primary"
                  variant="contained"
                  startIcon={<AddIcon />}
                  className="toolbar-button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  New Workflow
                </Button>
                
                {/* Custom Dropdown Content */}
                <Box 
                  className="dropdown-content"
                  sx={{
                    display: dropdownOpen ? 'block' : 'none',
                    opacity: dropdownOpen ? 1 : 0,
                    position: 'absolute',
                    backgroundColor: themeMode === 'ragnarok' ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    minWidth: '250px',
                    boxShadow: themeMode === 'ragnarok' ? '0 0 15px rgba(0, 195, 255, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.12)',
                    border: themeMode === 'ragnarok' ? '1px solid rgba(0, 195, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.08)',
                    borderRadius: '8px',
                    padding: '8px 0',
                    zIndex: 100,
                    top: '100%',
                    left: 0,
                    marginTop: '5px',
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  <Box 
                    onClick={() => {
                      // Clear the current workflow
                      clearWorkflow();
                      setDropdownOpen(false);
                    }}
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px 16px',
                      cursor: 'pointer',
                      color: themeMode === 'ragnarok' ? '#fff' : '#202124',
                      '&:hover': { 
                        backgroundColor: themeMode === 'ragnarok' ? 'rgba(0, 195, 255, 0.1)' : 'rgba(66, 133, 244, 0.08)' 
                      }
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      marginRight: '12px',
                      width: '24px',
                      height: '24px'
                    }}>
                      <AddIcon fontSize="small" sx={{ color: themeMode === 'ragnarok' ? '#00c3ff' : '#4285f4' }} />
                    </Box>
                    <Box>Workflow from scratch</Box>
                  </Box>
                  
                  <Box 
                    onClick={() => {
                      useFlowStore.getState().createDemoWorkflow();
                      setDropdownOpen(false);
                    }}
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px 16px',
                      cursor: 'pointer',
                      color: themeMode === 'ragnarok' ? '#fff' : '#202124',
                      '&:hover': { 
                        backgroundColor: themeMode === 'ragnarok' ? 'rgba(0, 195, 255, 0.1)' : 'rgba(66, 133, 244, 0.08)' 
                      }
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      marginRight: '12px',
                      width: '24px',
                      height: '24px'
                    }}>
                      <DashboardIcon fontSize="small" sx={{ color: themeMode === 'ragnarok' ? '#ff5722' : '#ea4335' }} />
                    </Box>
                    <Box>Workflow from pre-built template</Box>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Tooltip title="Open Workflow">
              <Button
                color="primary"
                variant="outlined"
                startIcon={<FolderOpenIcon />}
                onClick={() => setWorkflowDialogOpen(true)}
                className="toolbar-button"
                sx={{ mr: 1 }}
              >
                Open
              </Button>
            </Tooltip>
            <Tooltip title="Execute Workflow">
              <Button
                color="secondary"
                variant="contained"
                startIcon={<PlayArrowIcon />}
                onClick={() => setExecutionDialogOpen(true)}
                className="toolbar-button"
                sx={{ mr: 1 }}
              >
                Execute
              </Button>
            </Tooltip>
            <Tooltip title="View JSON">
              <Button
                color="primary"
                variant="outlined"
                startIcon={<CodeIcon />}
                onClick={() => setJsonModalOpen(true)}
                className="toolbar-button"
                sx={{ mr: 1 }}
              >
                JSON
              </Button>
            </Tooltip>
            
            {/* Theme Toggle Button */}
            <Tooltip title={themeMode === 'ragnarok' ? 'Switch to Calm Theme' : 'Switch to Ragnarok Theme'}>
              <IconButton
                onClick={toggleTheme}
                color="inherit"
                sx={{ ml: 1 }}
              >
                {themeMode === 'ragnarok' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        {/* Sidebar */}
        <Box 
          sx={{ 
            width: sidebarOpen ? 240 : 0, 
            flexShrink: 0,
            transition: 'width 0.3s ease',
            overflow: 'hidden',
            position: 'relative',
            zIndex: 1,
            boxShadow: sidebarOpen ? (themeMode === 'ragnarok' ? '0 0 15px rgba(0, 195, 255, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.12)') : 'none',
            borderRight: themeMode === 'ragnarok' ? '1px solid rgba(0, 195, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.08)'
          }}
        >
          <Toolbar /> {/* Spacer for AppBar */}
          <Sidebar onDragStart={onDragStart} />
        </Box>

        {/* Main Content */}
        <Box sx={{ 
          flexGrow: 1, 
          height: '100%', 
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <Toolbar /> {/* Spacer for AppBar */}
          <Box sx={{ 
            flexGrow: 1, 
            position: 'relative',
            width: '100%',
            height: 'calc(100vh - 64px)', /* Subtract AppBar height */
          }}>
            <FlowCanvas onOpenJsonView={() => setJsonModalOpen(true)} />
          </Box>
        </Box>

        {/* Node Configuration Dialog */}
        <NodeConfigDialog
          open={configDrawerOpen}
          onClose={handleCloseConfigDialog}
        />

        {/* JSON Modal */}
        <JsonModal open={jsonModalOpen} onClose={() => setJsonModalOpen(false)} />

        {/* Workflow Dialog */}
        <WorkflowDialog
          open={workflowDialogOpen}
          onClose={() => setWorkflowDialogOpen(false)}
        />

        {/* Execution Dialog */}
        <ExecutionDialog
          open={executionDialogOpen}
          onClose={() => setExecutionDialogOpen(false)}
        />
      </Box>
    </>
  );
}

/**
 * Main application component
 */
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
