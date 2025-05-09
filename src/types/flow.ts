// Define base types that match ReactFlow's API
interface Node {
  id: string;
  position: { x: number; y: number };
  data: Record<string, any>;
  type?: string;
}

interface Edge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

export type NodeType = 'input' | 'task' | 'output' | 'tool' | 'router';

export interface WorkflowNode extends Node {
  type: NodeType;
  data: {
    label: string;
    nodeType: NodeType;
    configuration: NodeConfiguration;
  };
}

export interface NodeConfiguration {
  name: string;
  description?: string;
  // Input node specific
  inputType?: 'text' | 'file' | 'api';
  defaultValue?: string;
  
  // Task node specific
  taskType?: 'summarize' | 'analyze' | 'transform' | 'call-api';
  prompt?: string;
  apiEndpoint?: string;
  apiKey?: string;
  
  // Tool node specific
  toolType?: 'web-search' | 'code-execution' | 'database' | 'file-system' | 'custom';
  toolConfig?: string;
  toolParameters?: string;
  
  // Router node specific
  routerType?: 'condition' | 'switch' | 'parallel';
  conditions?: string;
  defaultRoute?: string;
  
  // Output node specific
  outputType?: 'display' | 'notification' | 'download' | 'api';
  format?: 'text' | 'json' | 'csv';
  destination?: string;
}

export interface WorkflowEdge extends Edge {}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: string;
  updatedAt: string;
}
