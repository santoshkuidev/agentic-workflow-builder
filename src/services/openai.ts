import OpenAI from 'openai';

// Initialize OpenAI client
let openai: OpenAI | null = null;

export const initializeOpenAI = (apiKey: string) => {
  openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true // For client-side usage (in production, use a backend proxy)
  });
  return openai;
};

export const getOpenAIClient = () => {
  if (!openai) {
    throw new Error('OpenAI client not initialized. Call initializeOpenAI first.');
  }
  return openai;
};

// Task execution functions
export const summarizeText = async (text: string, prompt?: string): Promise<string> => {
  const client = getOpenAIClient();
  
  const response = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: prompt || 'Summarize the following text concisely:' },
      { role: 'user', content: text }
    ],
    max_tokens: 500,
  });

  return response.choices[0]?.message?.content || 'No summary generated';
};

export const analyzeText = async (text: string, prompt?: string): Promise<string> => {
  const client = getOpenAIClient();
  
  const response = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: prompt || 'Analyze the following text and provide insights:' },
      { role: 'user', content: text }
    ],
    max_tokens: 800,
  });

  return response.choices[0]?.message?.content || 'No analysis generated';
};

export const transformText = async (text: string, prompt?: string): Promise<string> => {
  const client = getOpenAIClient();
  
  const response = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: prompt || 'Transform the following text:' },
      { role: 'user', content: text }
    ],
    max_tokens: 800,
  });

  return response.choices[0]?.message?.content || 'No transformation generated';
};

// Execute a task based on type
export const executeTask = async (
  taskType: string, 
  input: string, 
  prompt?: string
): Promise<string> => {
  switch (taskType) {
    case 'summarize':
      return summarizeText(input, prompt);
    case 'analyze':
      return analyzeText(input, prompt);
    case 'transform':
      return transformText(input, prompt);
    default:
      throw new Error(`Unsupported task type: ${taskType}`);
  }
};

// Function to execute a workflow
export const executeWorkflow = async (
  nodes: any[], 
  edges: any[], 
  initialInput: string
): Promise<Record<string, any>> => {
  // Map to store results for each node
  const results: Record<string, any> = {};
  
  // Find input nodes (nodes with no incoming edges)
  const inputNodes = nodes.filter(node => 
    !edges.some(edge => edge.target === node.id) && node.type === 'input'
  );
  
  // Set initial input for input nodes
  inputNodes.forEach(node => {
    results[node.id] = initialInput || node.data.configuration.defaultValue || '';
  });
  
  // Process nodes in topological order (simple implementation)
  let processedNodes = new Set(inputNodes.map(node => node.id));
  let madeProgress = true;
  
  while (madeProgress) {
    madeProgress = false;
    
    for (const node of nodes) {
      // Skip already processed nodes
      if (processedNodes.has(node.id)) continue;
      
      // Find incoming edges
      const incomingEdges = edges.filter(edge => edge.target === node.id);
      
      // Check if all source nodes have been processed
      const allSourcesProcessed = incomingEdges.every(edge => 
        processedNodes.has(edge.source)
      );
      
      if (allSourcesProcessed) {
        // Get inputs from source nodes
        const inputs = incomingEdges.map(edge => results[edge.source]).join('\n\n');
        
        // Process based on node type
        if (node.type === 'task') {
          const config = node.data.configuration;
          try {
            results[node.id] = await executeTask(
              config.taskType || 'summarize',
              inputs,
              config.prompt
            );
          } catch (error) {
            console.error(`Error executing task for node ${node.id}:`, error);
            results[node.id] = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
          }
        } else if (node.type === 'output') {
          // For output nodes, just pass through the input
          results[node.id] = inputs;
        } else {
          // For any other node type, store the input
          results[node.id] = inputs;
        }
        
        processedNodes.add(node.id);
        madeProgress = true;
      }
    }
  }
  
  return results;
};
