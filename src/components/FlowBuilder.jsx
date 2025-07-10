import React, { useState, useCallback, useMemo } from "react";
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  ConnectionMode,
  ReactFlowProvider,
} from "@xyflow/react";
import { Save, AlertCircle, CheckCircle } from "lucide-react";
import "@xyflow/react/dist/style.css";

import TextNode from "./TextNode";
import NodesPanel from "./NodesPanel";
import SettingsPanel from "./SettingsPanel";
import { validateFlow, canCreateEdge } from "../utils/validation";

/**
 * FlowBuilder component - main component for the chatbot flow builder
 * Handles node management, edge connections, and validation
 */
const FlowBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [saveStatus, setSaveStatus] = useState("idle");

  // Define custom node types
  const nodeTypes = useMemo(
    () => ({
      text: TextNode,
    }),
    []
  );

  // Handle drag start from nodes panel
  const onDragStart = useCallback((event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  }, []);

  // Handle drop on canvas
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      if (!type) return;

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: {
          id: `${type}-${Date.now()}`,
          text: "",
          type: type,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  // Handle drag over canvas
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Handle edge connections with validation
  const onConnect = useCallback(
    (params) => {
      if (!params.source || !params.target) return;

      // Validate if this connection is allowed
      if (!canCreateEdge(params.source, params.target, edges)) {
        console.warn(
          "Connection not allowed: Source handle already has an outgoing edge or invalid connection"
        );
        return;
      }

      setEdges((eds) => addEdge(params, eds));
    },
    [edges, setEdges]
  );

  // Handle node selection
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  // Handle canvas click (deselect node)
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Handle node updates from settings panel
  const onNodeUpdate = useCallback(
    (nodeId, data) => {
      setNodes((nds) =>
        nds.map((node) => (node.id === nodeId ? { ...node, data } : node))
      );
    },
    [setNodes]
  );

  // Handle back to nodes panel
  const onBackToNodesPanel = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Handle save flow
  const onSave = useCallback(() => {
    setSaveStatus("saving");

    // Validate the flow
    const errors = validateFlow(nodes, edges);
    setValidationErrors(errors);

    if (errors.length > 0) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
      return;
    }

    // Simulate save operation
    setTimeout(() => {
      setSaveStatus("saved");
      console.log("Flow saved successfully!", { nodes, edges });

      // Reset status after 2 seconds
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 1000);
  }, [nodes, edges]);

  // Get save button styling based on status
  const getSaveButtonProps = () => {
    switch (saveStatus) {
      case "saving":
        return {
          className:
            "bg-blue-500 text-white px-4 py-2 rounded-md cursor-not-allowed opacity-75",
          disabled: true,
          children: "Saving...",
        };
      case "saved":
        return {
          className: "bg-green-500 text-white px-4 py-2 rounded-md",
          disabled: false,
          children: (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Saved!
            </>
          ),
        };
      case "error":
        return {
          className: "bg-red-500 text-white px-4 py-2 rounded-md",
          disabled: false,
          children: (
            <>
              <AlertCircle className="w-4 h-4 mr-2" />
              Error
            </>
          ),
        };
      default:
        return {
          className:
            "bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200",
          disabled: false,
          children: (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Flow
            </>
          ),
        };
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">
          Chatbot Flow Builder
        </h1>
        <button
          onClick={onSave}
          className={`flex items-center ${getSaveButtonProps().className}`}
          disabled={getSaveButtonProps().disabled}
        >
          {getSaveButtonProps().children}
        </button>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            <div>
              {validationErrors.map((error, index) => (
                <p key={index} className="text-red-700 text-sm">
                  {error.message}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Nodes Panel or Settings Panel */}
        {selectedNode ? (
          <SettingsPanel
            selectedNode={selectedNode}
            onNodeUpdate={onNodeUpdate}
            onBack={onBackToNodesPanel}
          />
        ) : (
          <NodesPanel onDragStart={onDragStart} />
        )}

        {/* Flow Canvas */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            connectionMode={ConnectionMode.Loose}
            fitView
            className="bg-gray-50"
          >
            <Background color="#e5e7eb" gap={20} />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

// Wrap with ReactFlowProvider for context
const FlowBuilderWrapper = () => (
  <ReactFlowProvider>
    <FlowBuilder />
  </ReactFlowProvider>
);

export default FlowBuilderWrapper;
