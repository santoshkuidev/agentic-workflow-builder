# Agentic Workflow Builder

![Agentic Workflow Builder](./public/images/workflow-preview.png)

A visual workflow dashboard for defining and managing agent-based automation using a drag-and-drop interface. This application allows you to create, edit, and execute workflows that integrate with the OpenAI API for AI-powered task execution.

## Features

- **Visual Workflow Editor**: Intuitive drag-and-drop interface for creating complex workflows
- **Multiple Node Types**: Input, Task, Tool, Router, and Output nodes to build comprehensive workflows
- **Dual Layout Options**: Choose between horizontal or vertical workflow layouts
- **Theme Options**: Toggle between the vibrant Thor: Ragnarok-inspired theme and a clean, calm theme
- **Workflow Management**: Save, load, and execute workflows
- **JSON Export/Import**: View and edit the underlying workflow JSON
- **OpenAI Integration**: Execute tasks using OpenAI's powerful API

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key (for execution features)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/agentic-workflow-builder.git
   cd agentic-workflow-builder
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the root directory and add your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

### Creating a Workflow

1. Click the "New Workflow" button in the header and choose either "Workflow from scratch" or "Workflow from pre-built template"
2. Drag nodes from the sidebar onto the canvas
3. Connect nodes by dragging from one handle to another
4. Configure each node by clicking on it and using the configuration panel
5. Save your workflow using the "Save" button

### Executing a Workflow

1. Create or load a workflow
2. Click the "Execute" button in the header
3. Provide any required input values
4. View the execution results in real-time

### Switching Themes

Click the theme toggle button in the top-right corner of the header to switch between:
- **Ragnarok Theme**: A vibrant, dark theme inspired by Thor: Ragnarok
- **Calm Theme**: A clean, light theme for a more traditional interface

## Project Structure

```
agentic-workflow-builder/
├── src/
│   ├── components/       # React components
│   │   ├── nodes/        # Node type components
│   │   └── ...           # Other UI components
│   ├── state/            # State management (Zustand)
│   ├── theme/            # Theme configuration
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── public/               # Static assets
└── ...                   # Configuration files
```

## Technologies Used

- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and development server
- **ReactFlow**: Flow diagram library for the workflow canvas
- **Material-UI**: Component library for the user interface
- **Zustand**: State management
- **OpenAI API**: AI integration for task execution

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by visual programming tools and workflow automation systems
- UI design influenced by Thor: Ragnarok's vibrant aesthetic
- Built with ReactFlow for the workflow canvas
  },
})
```
