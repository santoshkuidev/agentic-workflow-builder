import type { Edge } from 'reactflow';
import type { WorkflowNode } from '../types/flow';

// Direction types for layout
export type LayoutDirection = 'horizontal' | 'vertical';

// Node with level information for layout
interface NodeWithLevel extends WorkflowNode {
  level?: number;
  column?: number;
}

/**
 * Calculates the levels of nodes in a graph
 * @param nodes The nodes to calculate levels for
 * @param edges The edges connecting the nodes
 * @returns A new array of nodes with level information
 */
const calculateNodeLevels = (nodes: WorkflowNode[], edges: Edge[]): NodeWithLevel[] => {
  // Create a map of node IDs to their outgoing and incoming edges
  const outgoingEdges: Record<string, string[]> = {};
  const incomingEdges: Record<string, string[]> = {};
  
  // Initialize
  nodes.forEach(node => {
    outgoingEdges[node.id] = [];
    incomingEdges[node.id] = [];
  });
  
  // Populate edge maps
  edges.forEach(edge => {
    if (outgoingEdges[edge.source]) {
      outgoingEdges[edge.source].push(edge.target);
    }
    if (incomingEdges[edge.target]) {
      incomingEdges[edge.target].push(edge.source);
    }
  });
  
  // Find root nodes (nodes with no incoming edges)
  const rootNodes = nodes.filter(node => incomingEdges[node.id].length === 0);
  
  // Create a copy of nodes to add level information
  const nodesWithLevels: NodeWithLevel[] = nodes.map(node => ({
    ...node,
    level: undefined,
    column: undefined,
  }));
  
  // Set level 0 for root nodes
  rootNodes.forEach(node => {
    const nodeWithLevel = nodesWithLevels.find(n => n.id === node.id);
    if (nodeWithLevel) {
      nodeWithLevel.level = 0;
    }
  });
  
  // Breadth-first traversal to assign levels
  let currentLevel = 0;
  let nodesToProcess = rootNodes.map(node => node.id);
  
  while (nodesToProcess.length > 0) {
    const nextNodesToProcess: string[] = [];
    
    nodesToProcess.forEach(nodeId => {
      // Process all outgoing edges
      outgoingEdges[nodeId].forEach(targetId => {
        const targetNode = nodesWithLevels.find(n => n.id === targetId);
        if (targetNode) {
          // If the node doesn't have a level yet, or if we found a longer path
          if (targetNode.level === undefined || targetNode.level < currentLevel + 1) {
            targetNode.level = currentLevel + 1;
            nextNodesToProcess.push(targetId);
          }
        }
      });
    });
    
    currentLevel++;
    nodesToProcess = nextNodesToProcess;
  }
  
  // Handle nodes that weren't assigned a level (disconnected nodes)
  nodesWithLevels.forEach(node => {
    if (node.level === undefined) {
      node.level = 0;
    }
  });
  
  // Assign columns within each level
  const nodesByLevel: Record<number, NodeWithLevel[]> = {};
  
  // Group nodes by level
  nodesWithLevels.forEach(node => {
    if (node.level !== undefined) {
      if (!nodesByLevel[node.level]) {
        nodesByLevel[node.level] = [];
      }
      nodesByLevel[node.level].push(node);
    }
  });
  
  // Assign column numbers within each level
  Object.keys(nodesByLevel).forEach(levelStr => {
    const level = parseInt(levelStr);
    nodesByLevel[level].forEach((node, index) => {
      node.column = index;
    });
  });
  
  return nodesWithLevels;
};

/**
 * Automatically layouts nodes in a graph
 * @param nodes The nodes to layout
 * @param edges The edges connecting the nodes
 * @param direction The direction of the layout ('horizontal' or 'vertical')
 * @param nodeWidth The width of each node
 * @param nodeHeight The height of each node
 * @param horizontalSpacing The horizontal spacing between nodes
 * @param verticalSpacing The vertical spacing between nodes
 * @returns A new array of nodes with updated positions
 */
export const autoLayout = (
  nodes: WorkflowNode[],
  edges: Edge[],
  direction: LayoutDirection = 'vertical',
  nodeWidth: number = 180,
  nodeHeight: number = 100,
  horizontalSpacing: number = 150,
  verticalSpacing: number = 150
): WorkflowNode[] => {
  // Calculate levels for each node
  const nodesWithLevels = calculateNodeLevels(nodes, edges);
  
  // Find the maximum level and column
  let maxLevel = 0;
  let maxNodesInAnyLevel = 0;
  
  nodesWithLevels.forEach(node => {
    if (node.level !== undefined && node.level > maxLevel) {
      maxLevel = node.level;
    }
  });
  
  // Count nodes in each level
  for (let level = 0; level <= maxLevel; level++) {
    const nodesInLevel = nodesWithLevels.filter(node => node.level === level);
    if (nodesInLevel.length > maxNodesInAnyLevel) {
      maxNodesInAnyLevel = nodesInLevel.length;
    }
  }
  
  // Position nodes based on their level and column
  return nodesWithLevels.map(node => {
    const { level = 0, column = 0 } = node;
    
    // Calculate position based on direction
    let x, y;
    
    if (direction === 'horizontal') {
      // In horizontal layout, levels go from left to right
      x = level * (nodeWidth + horizontalSpacing);
      y = column * (nodeHeight + verticalSpacing);
    } else {
      // In vertical layout, levels go from top to bottom
      x = column * (nodeWidth + horizontalSpacing);
      y = level * (nodeHeight + verticalSpacing);
    }
    
    return {
      ...node,
      position: { x, y }
    };
  });
};

/**
 * Toggles the layout direction
 * @param currentDirection The current layout direction
 * @returns The new layout direction
 */
export const toggleDirection = (currentDirection: LayoutDirection): LayoutDirection => {
  return currentDirection === 'horizontal' ? 'vertical' : 'horizontal';
};
