import { create } from 'zustand';
import { 
  addEdge,
  applyNodeChanges,
  applyEdgeChanges
} from 'reactflow';
import type { 
  NodeChange,
  EdgeChange,
  OnNodesChange, 
  OnEdgesChange, 
  OnConnect,
  Connection as ReactFlowConnection,
  Edge as ReactFlowEdge
} from 'reactflow';

// Use ReactFlow's Connection type
type Connection = ReactFlowConnection;
type Edge = ReactFlowEdge;
import { v4 as uuidv4 } from 'uuid';
import type { WorkflowNode, WorkflowEdge, Workflow, NodeConfiguration } from '../types/flow';
import type { LayoutDirection } from '../utils/layoutUtils';

interface FlowState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNode: WorkflowNode | null;
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  layoutDirection: LayoutDirection;

  // Node operations
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (type: 'input' | 'task' | 'output', position: { x: number, y: number }) => void;
  updateNodeConfiguration: (nodeId: string, configuration: NodeConfiguration) => void;
  setSelectedNode: (nodeId: string | null) => void;
  
  // Workflow operations
  createWorkflow: (name: string, description?: string) => void;
  saveWorkflow: () => void;
  loadWorkflow: (id: string) => void;
  updateWorkflow: (id: string, name: string, description: string) => void;
  deleteWorkflow: (id: string) => void;
  exportWorkflow: () => string;
  importWorkflow: (data: string) => void;
  loadWorkflowsFromStorage: () => void;
  createDemoWorkflow: () => Workflow;
  
  // Layout operations
  setLayoutDirection: (direction: LayoutDirection) => void;
}

// Initial node data based on type
const getInitialNodeData = (type: 'input' | 'task' | 'output'): NodeConfiguration => {
  const baseConfig: NodeConfiguration = {
    name: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
  };

  switch (type) {
    case 'input':
      return {
        ...baseConfig,
        inputType: 'text',
        defaultValue: '',
      };
    case 'task':
      return {
        ...baseConfig,
        taskType: 'summarize',
        prompt: 'Summarize the input text',
      };
    case 'output':
      return {
        ...baseConfig,
        outputType: 'display',
        format: 'text',
      };
    default:
      return baseConfig;
  }
};

// Create the store
const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  workflows: [],
  currentWorkflow: null,
  layoutDirection: 'vertical',

  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes) as WorkflowNode[],
    });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges) as WorkflowEdge[],
    });
  },

  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(
        { ...connection, id: `e-${uuidv4()}` },
        get().edges
      ) as WorkflowEdge[],
    });
  },

  addNode: (type, position) => {
    const newNode: WorkflowNode = {
      id: `node-${uuidv4()}`,
      type,
      position,
      data: {
        label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        nodeType: type,
        configuration: getInitialNodeData(type),
      },
    };

    set({ nodes: [...get().nodes, newNode] });
  },

  updateNodeConfiguration: (nodeId, configuration) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              configuration: {
                ...node.data.configuration,
                ...configuration,
              },
              label: configuration.name || node.data.label,
            },
          };
        }
        return node;
      }),
    });
  },

  setSelectedNode: (nodeId) => {
    if (nodeId === null) {
      set({ selectedNode: null });
    } else {
      const node = get().nodes.find(n => n.id === nodeId);
      set({ selectedNode: node || null });
    }
  },

  createWorkflow: (name, description = '') => {
    const newWorkflow: Workflow = {
      id: uuidv4(),
      name,
      description,
      nodes: [],
      edges: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update state
    set({
      workflows: [...get().workflows, newWorkflow],
      currentWorkflow: newWorkflow,
      nodes: [],
      edges: [],
    });
    
    // Save to localStorage
    try {
      const savedWorkflows = JSON.parse(localStorage.getItem('workflows') || '[]');
      localStorage.setItem('workflows', JSON.stringify([...savedWorkflows, newWorkflow]));
    } catch (error) {
      console.error('Failed to save new workflow to localStorage:', error);
    }
  },

  saveWorkflow: () => {
    const { currentWorkflow, nodes, edges } = get();
    
    if (!currentWorkflow) return;
    
    const updatedWorkflow: Workflow = {
      ...currentWorkflow,
      nodes,
      edges,
      updatedAt: new Date().toISOString(),
    };

    // Update workflows array
    set({
      workflows: get().workflows.map((wf) =>
        wf.id === updatedWorkflow.id ? updatedWorkflow : wf
      ),
      currentWorkflow: updatedWorkflow,
    });

    // Save to localStorage
    try {
      const savedWorkflows = JSON.parse(localStorage.getItem('workflows') || '[]');
      const updatedWorkflows = savedWorkflows.map((wf: Workflow) => 
        wf.id === updatedWorkflow.id ? updatedWorkflow : wf
      );
      
      if (!savedWorkflows.some((wf: Workflow) => wf.id === updatedWorkflow.id)) {
        updatedWorkflows.push(updatedWorkflow);
      }
      
      localStorage.setItem('workflows', JSON.stringify(updatedWorkflows));
    } catch (error) {
      console.error('Failed to save workflow to localStorage:', error);
    }
  },

  loadWorkflow: (id) => {
    // First try to find the workflow in the current state
    let workflow = get().workflows.find((wf) => wf.id === id);
    
    // If not found, try to load from localStorage
    if (!workflow) {
      try {
        const savedWorkflows = JSON.parse(localStorage.getItem('workflows') || '[]');
        workflow = savedWorkflows.find((wf: Workflow) => wf.id === id);
        
        // If found in localStorage, update the workflows list
        if (workflow) {
          set({
            workflows: [...get().workflows, workflow]
          });
        }
      } catch (error) {
        console.error('Failed to load workflow from localStorage:', error);
      }
    }
    
    if (workflow) {
      set({
        currentWorkflow: workflow,
        nodes: workflow.nodes || [],
        edges: workflow.edges || [],
      });
    }
  },
  
  updateWorkflow: (id, name, description) => {
    const { workflows } = get();
    const workflowToUpdate = workflows.find(wf => wf.id === id);
    
    if (!workflowToUpdate) return;
    
    const updatedWorkflow = {
      ...workflowToUpdate,
      name,
      description,
      updatedAt: new Date().toISOString(),
    };
    
    // Update state
    const updatedWorkflows = workflows.map(wf => 
      wf.id === id ? updatedWorkflow : wf
    );
    
    set({
      workflows: updatedWorkflows,
      currentWorkflow: updatedWorkflow,
    });
    
    // Update localStorage
    try {
      const savedWorkflows = JSON.parse(localStorage.getItem('workflows') || '[]');
      const updatedSavedWorkflows = savedWorkflows.map((wf: Workflow) => 
        wf.id === id ? updatedWorkflow : wf
      );
      localStorage.setItem('workflows', JSON.stringify(updatedSavedWorkflows));
    } catch (error) {
      console.error('Failed to update workflow in localStorage:', error);
    }
  },
  
  deleteWorkflow: (id) => {
    const { workflows, currentWorkflow } = get();
    const updatedWorkflows = workflows.filter(wf => wf.id !== id);
    
    // Update state
    set({
      workflows: updatedWorkflows,
      // If the current workflow is being deleted, clear it
      currentWorkflow: currentWorkflow?.id === id ? null : currentWorkflow,
      // If the current workflow is being deleted, clear the canvas
      nodes: currentWorkflow?.id === id ? [] : get().nodes,
      edges: currentWorkflow?.id === id ? [] : get().edges,
    });
    
    // Update localStorage
    try {
      const savedWorkflows = JSON.parse(localStorage.getItem('workflows') || '[]');
      const updatedSavedWorkflows = savedWorkflows.filter((wf: Workflow) => wf.id !== id);
      localStorage.setItem('workflows', JSON.stringify(updatedSavedWorkflows));
    } catch (error) {
      console.error('Failed to delete workflow from localStorage:', error);
    }
  },
  
  loadWorkflowsFromStorage: () => {
    try {
      const savedWorkflows = JSON.parse(localStorage.getItem('workflows') || '[]');
      set({ workflows: savedWorkflows });
    } catch (error) {
      console.error('Failed to load workflows from localStorage:', error);
    }
  },

  createDemoWorkflow: () => {
    const id = uuidv4();
    const workflow: Workflow = {
      id,
      name: 'Content Analyzer Demo',
      description: 'A demo workflow that analyzes text content and routes based on sentiment',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nodes: [],
      edges: [],
    };
    
    // Clear the canvas
    set({
      nodes: [],
      edges: [],
      currentWorkflow: workflow,
    });
    
    // Add to workflows list
    set(state => ({
      workflows: [...state.workflows, workflow]
    }));
    
    // Save to localStorage
    try {
      localStorage.setItem('workflows', JSON.stringify(get().workflows));
    } catch (error) {
      console.error('Error saving workflows to storage:', error);
    }
    
    // Create input node
    const inputNode: WorkflowNode = {
      id: 'input-1',
      type: 'input',
      position: { x: 250, y: 50 },
      data: {
        label: 'User Input',
        nodeType: 'input',
        configuration: {
          name: 'User Input',
          description: 'Text input from the user',
          inputType: 'text',
          defaultValue: 'I really enjoyed learning about AI and its applications in workflow automation.'
        }
      }
    };
    
    // Create task node
    const taskNode: WorkflowNode = {
      id: 'task-1',
      type: 'task',
      position: { x: 250, y: 200 },
      data: {
        label: 'Content Analysis',
        nodeType: 'task',
        configuration: {
          name: 'Content Analysis',
          description: 'Analyze the text content',
          taskType: 'analyze',
          prompt: 'Analyze the following text and determine: 1) The main topic, 2) The sentiment (positive, negative, or neutral), and 3) Key entities mentioned. Format the response as JSON.'
        }
      }
    };
    
    // Create tool node
    const toolNode: WorkflowNode = {
      id: 'tool-1',
      type: 'tool',
      position: { x: 250, y: 350 },
      data: {
        label: 'Related Content Search',
        nodeType: 'tool',
        configuration: {
          name: 'Related Content Search',
          description: 'Find related content on the web',
          toolType: 'web-search',
          toolConfig: '{"max_results": 3, "search_type": "news"}',
          toolParameters: '{"query": "{{Content Analysis.output.main_topic}} latest developments"}'
        }
      }
    };
    
    // Create router node
    const routerNode: WorkflowNode = {
      id: 'router-1',
      type: 'router',
      position: { x: 250, y: 500 },
      data: {
        label: 'Sentiment Router',
        nodeType: 'router',
        configuration: {
          name: 'Sentiment Router',
          description: 'Route based on sentiment analysis',
          routerType: 'condition',
          conditions: '{"positive": "{{Content Analysis.output.sentiment}} === \'positive\'", "negative": "{{Content Analysis.output.sentiment}} === \'negative\'", "neutral": "{{Content Analysis.output.sentiment}} === \'neutral\'"}',
          defaultRoute: 'neutral'
        }
      }
    };
    
    // Create output nodes
    const outputNode1: WorkflowNode = {
      id: 'output-1',
      type: 'output',
      position: { x: 100, y: 650 },
      data: {
        label: 'Positive Response',
        nodeType: 'output',
        configuration: {
          name: 'Positive Response',
          description: 'Output for positive sentiment',
          outputType: 'display',
          format: 'text'
        }
      }
    };
    
    const outputNode2: WorkflowNode = {
      id: 'output-2',
      type: 'output',
      position: { x: 250, y: 650 },
      data: {
        label: 'Neutral Response',
        nodeType: 'output',
        configuration: {
          name: 'Neutral Response',
          description: 'Output for neutral sentiment',
          outputType: 'display',
          format: 'text'
        }
      }
    };
    
    const outputNode3: WorkflowNode = {
      id: 'output-3',
      type: 'output',
      position: { x: 400, y: 650 },
      data: {
        label: 'Negative Response',
        nodeType: 'output',
        configuration: {
          name: 'Negative Response',
          description: 'Output for negative sentiment',
          outputType: 'display',
          format: 'text'
        }
      }
    };
    
    // Add all nodes
    const nodes = [inputNode, taskNode, toolNode, routerNode, outputNode1, outputNode2, outputNode3];
    
    // Create edges
    const edges: Edge[] = [
      {
        id: 'edge-input-task',
        source: 'input-1',
        target: 'task-1',
        type: 'default'
      },
      {
        id: 'edge-task-tool',
        source: 'task-1',
        target: 'tool-1',
        type: 'default'
      },
      {
        id: 'edge-tool-router',
        source: 'tool-1',
        target: 'router-1',
        type: 'default'
      },
      {
        id: 'edge-router-output1',
        source: 'router-1',
        target: 'output-1',
        type: 'default'
      },
      {
        id: 'edge-router-output2',
        source: 'router-1',
        target: 'output-2',
        type: 'default'
      },
      {
        id: 'edge-router-output3',
        source: 'router-1',
        target: 'output-3',
        type: 'default'
      }
    ];
    
    // Update state with nodes and edges
    set({ nodes, edges });
    
    // Save the workflow with nodes and edges
    workflow.nodes = [...nodes];
    workflow.edges = [...edges];
    
    // Update the current workflow in state
    set({ currentWorkflow: workflow });
    
    // Save to localStorage
    try {
      localStorage.setItem('workflows', JSON.stringify(get().workflows));
    } catch (error) {
      console.error('Error saving workflows to storage:', error);
    }
    
    return workflow;
  },

  exportWorkflow: () => {
    const { currentWorkflow } = get();
    return currentWorkflow ? JSON.stringify(currentWorkflow, null, 2) : '';
  },

  importWorkflow: (data) => {
    try {
      const workflow = JSON.parse(data) as Workflow;
      
      // Validate workflow structure
      if (!workflow.id || !workflow.name || !Array.isArray(workflow.nodes) || !Array.isArray(workflow.edges)) {
        throw new Error('Invalid workflow data');
      }
      
      set({
        workflows: [...get().workflows, workflow],
        currentWorkflow: workflow,
        nodes: workflow.nodes,
        edges: workflow.edges,
      });
      
      // Save to localStorage
      const savedWorkflows = JSON.parse(localStorage.getItem('workflows') || '[]');
      localStorage.setItem('workflows', JSON.stringify([...savedWorkflows, workflow]));
    } catch (error) {
      console.error('Failed to import workflow:', error);
    }
  },
  
  // Set the layout direction
  setLayoutDirection: (direction) => {
    set({ layoutDirection: direction });
  },
}));

export default useFlowStore;
