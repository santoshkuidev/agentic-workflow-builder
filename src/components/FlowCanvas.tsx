import React, { useCallback, useRef, useState, useMemo } from 'react';
import AddIcon from '@mui/icons-material/Add';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
  Panel,
} from 'reactflow';
import type { Node, Connection } from 'reactflow';
import 'reactflow/dist/style.css';
import { Box, Button, Tooltip, ToggleButton, ToggleButtonGroup } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CodeIcon from '@mui/icons-material/Code';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import TemplateIcon from '@mui/icons-material/Dashboard';
import { autoLayout } from '../utils/layoutUtils';
import type { LayoutDirection } from '../utils/layoutUtils';
import { ragnarokColors } from '../theme/ragnarokTheme';
// NodeConfigDialog is handled by App.tsx
import ExecutionDialog from './ExecutionDialog';

import InputNode from './nodes/InputNode';
import TaskNode from './nodes/TaskNode';
import OutputNode from './nodes/OutputNode';
import ToolNode from './nodes/ToolNode';
import RouterNode from './nodes/RouterNode';
import useFlowStore from '../state/flowStore';

// Define custom node types
const nodeTypes = {
  input: InputNode,
  task: TaskNode,
  output: OutputNode,
  tool: ToolNode,
  router: RouterNode,
};

interface FlowCanvasProps {
  onOpenJsonView: () => void;
}

const FlowCanvas: React.FC<FlowCanvasProps> = ({ onOpenJsonView }) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { project, fitView } = useReactFlow();
  
  // State for dialogs
  const [executionDialogOpen, setExecutionDialogOpen] = useState(false);
  
  // No additional state needed for custom dropdown
  
  // Get layout direction from store
  const layoutDirection = useFlowStore(state => state.layoutDirection);
  const setLayoutDirection = useFlowStore(state => state.setLayoutDirection);
  
  // Define edge options based on layout direction
  const defaultEdgeOptions = useMemo(() => ({
    type: layoutDirection === 'horizontal' ? 'default' : 'smoothstep',
    style: {
      stroke: ragnarokColors.primary.main,
      strokeWidth: 2,
    },
    animated: true,
  }), [layoutDirection, ragnarokColors.primary.main]);
  
  // Define connection line style
  const connectionLineStyle = {
    stroke: ragnarokColors.primary.main,
    strokeWidth: 2,
  };
  
  // Get state and actions from store
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    saveWorkflow,
    setSelectedNode,
    createDemoWorkflow,
  } = useFlowStore();

  // Handle dropping a node onto the canvas
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      // Check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      addNode(type as 'input' | 'task' | 'output', position);
    },
    [project, addNode]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
  
  // Handle node drag start
  const onNodeDragStart = useCallback(() => {
    // Add dragging class to the node being dragged
    document.body.classList.add('node-dragging');
  }, []);
  
  // Handle node drag stop
  const onNodeDragStop = useCallback(() => {
    // Remove dragging class when drag ends
    document.body.classList.remove('node-dragging');
  }, []);
  
  // Handle connection with appropriate edge type based on layout direction
  const onConnectHandler = useCallback((params: Connection) => {
    // Create the connection with the appropriate edge type
    // Use any to bypass TypeScript's strict checking
    onConnect({
      ...params,
      type: layoutDirection === 'horizontal' ? 'default' : 'smoothstep',
    } as any);
  }, [onConnect, layoutDirection]);
  
  // Handle node click for configuration
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    // Just set the selected node, App.tsx will handle opening the dialog
    setSelectedNode(node.id);
  }, [setSelectedNode]);
  
  // Handle run workflow button click
  const handleRunWorkflow = useCallback(() => {
    setExecutionDialogOpen(true);
  }, []);
  
  // Handle auto-layout button click
  const handleAutoLayout = useCallback(() => {
    if (nodes.length === 0) return;
    
    const layoutedNodes = autoLayout(nodes, edges, layoutDirection);
    
    // Create a batch of position changes
    const changes = layoutedNodes.map(node => ({
      id: node.id,
      type: 'position' as const,
      position: node.position
    }));
    
    // Apply all changes at once using the hook from the store
    onNodesChange(changes);
    
    // Fit view after layout is applied
    setTimeout(() => {
      fitView({ padding: 0.2 });
    }, 50);
  }, [nodes, edges, layoutDirection, fitView, onNodesChange]);
  
  // Handle direction toggle
  const handleDirectionChange = useCallback((_: React.MouseEvent<HTMLElement>, newDirection: LayoutDirection | null) => {
    if (newDirection !== null) {
      // Update the layout direction in the store
      setLayoutDirection(newDirection);
      
      // Automatically apply the new layout direction
      if (nodes.length > 0) {
        // Small delay to ensure state is updated
        setTimeout(() => {
          const layoutedNodes = autoLayout(nodes, edges, newDirection);
          
          // Create a batch of position changes
          const changes = layoutedNodes.map(node => ({
            id: node.id,
            type: 'position' as const,
            position: node.position
          }));
          
          // Apply all changes at once
          onNodesChange(changes);
          
          // Update edge types for the new layout direction
          const edgeChanges = edges.map(edge => ({
            id: edge.id,
            type: 'remove' as const,
          }));
          onEdgesChange(edgeChanges);
          
          // Recreate edges with the correct type
          setTimeout(() => {
            // Recreate each edge with the correct type
            edges.forEach(edge => {
              // Use any to bypass TypeScript's strict checking
              onConnect({
                source: edge.source,
                target: edge.target,
                type: newDirection === 'horizontal' ? 'default' : 'smoothstep',
              } as any);
            });
          }, 10);
          
          // Fit view after layout is applied
          setTimeout(() => {
            fitView({ padding: 0.2 });
          }, 50);
        }, 10);
      }
    }
  }, [nodes, edges, onNodesChange, onEdgesChange, fitView, setLayoutDirection]);

  

  return (
    <Box sx={{ height: '100%', width: '100%' }} ref={reactFlowWrapper} className="react-flow-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnectHandler}
        nodeTypes={nodeTypes}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onNodeDragStart={onNodeDragStart}
        onNodeDragStop={onNodeDragStop}
        fitView
        attributionPosition="bottom-right"
        proOptions={{ 
          hideAttribution: false
        }}
        style={{ background: 'transparent' }}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        snapToGrid={true}
        snapGrid={[15, 15]}
        elevateNodesOnSelect={true}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineStyle={connectionLineStyle}
      >
        <Background 
          color={ragnarokColors.primary.main} 
          gap={20} 
          size={1.5} 
          style={{ opacity: 0.2 }} 
        />
        {/* Controls positioned at the bottom-left */}
        <Controls 
          position="bottom-left" 
          style={{ 
            marginLeft: 10, 
            marginBottom: 10,
            background: 'rgba(30, 30, 30, 0.7)',
            borderRadius: '8px',
            border: '1px solid rgba(0, 195, 255, 0.2)',
            boxShadow: '0 0 15px rgba(0, 195, 255, 0.3)',
            display: 'flex',
            zIndex: 10 // Higher z-index to ensure it's above other elements
          }} 
          showZoom={true}
          showFitView={true}
          showInteractive={true}
        />
        
        {/* MiniMap positioned at the bottom-right */}
        <MiniMap
          position="bottom-right"
          style={{ 
            background: 'rgba(30, 30, 30, 0.7)',
            border: '1px solid rgba(0, 195, 255, 0.2)',
            borderRadius: '8px',
            boxShadow: '0 0 15px rgba(0, 195, 255, 0.3)',
            marginBottom: 10,
            marginRight: 10,
            zIndex: 5 // Lower z-index than controls
          }}
          nodeStrokeColor={(n: Node) => {
            if (n.type === 'input') return ragnarokColors.nodes.input;
            if (n.type === 'output') return ragnarokColors.nodes.output;
            if (n.type === 'task') return ragnarokColors.nodes.task;
            if (n.type === 'tool') return ragnarokColors.nodes.tool;
            if (n.type === 'router') return ragnarokColors.nodes.router;
            return '#eee';
          }}
          nodeColor={(n: Node) => {
            if (n.type === 'input') return ragnarokColors.nodes.input;
            if (n.type === 'output') return ragnarokColors.nodes.output;
            if (n.type === 'task') return ragnarokColors.nodes.task;
            if (n.type === 'tool') return ragnarokColors.nodes.tool;
            if (n.type === 'router') return ragnarokColors.nodes.router;
            return '#fff';
          }}
          nodeBorderRadius={8}
        />
        
        <Panel position="top-right">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {/* Layout Controls */}
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 1, 
                p: 1,
                background: 'rgba(30, 30, 30, 0.7)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 195, 255, 0.2)',
                boxShadow: '0 0 15px rgba(0, 195, 255, 0.3)'
              }}
            >
              <Tooltip title="Auto-Layout Workflow">
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AutoFixHighIcon />}
                  onClick={handleAutoLayout}
                  className="toolbar-button"
                  sx={{ 
                    background: `linear-gradient(45deg, ${ragnarokColors.primary.main} 30%, ${ragnarokColors.primary.light} 90%)`,
                    boxShadow: `0 3px 10px rgba(0, 195, 255, 0.3)`,
                    '&:hover': {
                      boxShadow: `0 5px 15px rgba(0, 195, 255, 0.4)`,
                    }
                  }}
                >
                  Auto-Layout
                </Button>
              </Tooltip>

              <ToggleButtonGroup
                value={layoutDirection}
                exclusive
                onChange={handleDirectionChange}
                size="small"
                sx={{ 
                  '& .MuiToggleButton-root': {
                    color: ragnarokColors.text.secondary,
                    borderColor: 'rgba(0, 195, 255, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 195, 255, 0.1)',
                    },
                    '&.Mui-selected': {
                      color: '#ffffff',
                      backgroundColor: 'rgba(0, 195, 255, 0.3)',
                      boxShadow: '0 0 10px rgba(0, 195, 255, 0.5)',
                      transform: 'scale(1.05)',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 195, 255, 0.4)',
                      },
                    },
                  }
                }}
              >
                <ToggleButton value="horizontal">
                  <Tooltip title="Horizontal Layout">
                    <ViewStreamIcon />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="vertical">
                  <Tooltip title="Vertical Layout">
                    <ViewColumnIcon />
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>


            
            {/* Workflow Controls */}
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 1, 
                p: 1,
                background: 'rgba(30, 30, 30, 0.7)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 195, 255, 0.2)',
                boxShadow: '0 0 15px rgba(0, 195, 255, 0.3)'
              }}
            >
              <Tooltip title="Save Workflow">
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<SaveIcon />}
                  onClick={saveWorkflow}
                  className="toolbar-button"
                  sx={{ 
                    background: `linear-gradient(45deg, ${ragnarokColors.primary.main} 30%, ${ragnarokColors.primary.light} 90%)`,
                    boxShadow: `0 3px 10px rgba(0, 195, 255, 0.3)`,
                    '&:hover': {
                      boxShadow: `0 5px 15px rgba(0, 195, 255, 0.4)`,
                    }
                  }}
                >
                  Save
                </Button>
              </Tooltip>
              
              <Tooltip title="Run Workflow">
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<PlayArrowIcon />}
                  disabled={nodes.length === 0}
                  onClick={handleRunWorkflow}
                  className="toolbar-button"
                  sx={{ 
                    background: `linear-gradient(45deg, ${ragnarokColors.secondary.main} 30%, ${ragnarokColors.secondary.light} 90%)`,
                    boxShadow: `0 3px 10px rgba(255, 87, 34, 0.3)`,
                    '&:hover': {
                      boxShadow: `0 5px 15px rgba(255, 87, 34, 0.4)`,
                    }
                  }}
                >
                  Run
                </Button>
              </Tooltip>
              
              <Tooltip title="View JSON">
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<CodeIcon />}
                  onClick={onOpenJsonView}
                  className="toolbar-button"
                  sx={{ 
                    borderColor: ragnarokColors.primary.main,
                    color: ragnarokColors.primary.main,
                    '&:hover': {
                      borderColor: ragnarokColors.primary.light,
                      backgroundColor: 'rgba(0, 195, 255, 0.1)',
                    }
                  }}
                >
                  JSON
                </Button>
              </Tooltip>
            </Box>
          </Box>
        </Panel>
      </ReactFlow>
      
      {/* Execution Dialog */}
      <ExecutionDialog
        open={executionDialogOpen}
        onClose={() => setExecutionDialogOpen(false)}
      />
    </Box>
  );
};

// Wrap component with ReactFlowProvider
const FlowCanvasWithProvider: React.FC<FlowCanvasProps> = (props) => {
  return (
    <ReactFlowProvider>
      <FlowCanvas {...props} />
    </ReactFlowProvider>
  );
};

export default FlowCanvasWithProvider;
