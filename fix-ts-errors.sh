#!/bin/bash

# Fix ExecutionDialog.tsx
sed -i '' '/import { executeWorkflow } from/d' src/components/ExecutionDialog.tsx

# Fix FlowCanvas.tsx
sed -i '' '/import AddIcon from/d' src/components/FlowCanvas.tsx
sed -i '' '/import TemplateIcon from/d' src/components/FlowCanvas.tsx
sed -i '' 's/createDemoWorkflow,//' src/components/FlowCanvas.tsx

# Fix BaseNode.tsx
sed -i '' '/import type { WorkflowNode } from/d' src/components/nodes/BaseNode.tsx

# Fix various node files with LayoutDirection import
sed -i '' '/import type { LayoutDirection } from/d' src/components/nodes/InputNode.tsx
sed -i '' '/import type { LayoutDirection } from/d' src/components/nodes/OutputNode.tsx
sed -i '' '/import type { LayoutDirection } from/d' src/components/nodes/RouterNode.tsx
sed -i '' '/import type { LayoutDirection } from/d' src/components/nodes/TaskNode.tsx
sed -i '' '/import type { LayoutDirection } from/d' src/components/nodes/ToolNode.tsx

# Fix WorkflowDialog.tsx
sed -i '' '/import type { Workflow } from/d' src/components/WorkflowDialog.tsx

echo "TypeScript errors fixed!"
