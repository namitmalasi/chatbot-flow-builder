import React, { useState, useEffect } from "react";
import { Settings, MessageSquare, ArrowLeft } from "lucide-react";

const SettingsPanel = ({ selectedNode, onNodeUpdate, onBack }) => {
  const [text, setText] = useState("");

  // Update local state when selected node changes
  useEffect(() => {
    if (selectedNode) {
      setText(selectedNode.data.text || "");
    }
  }, [selectedNode]);

  // Handle text changes with debounced updates
  const handleTextChange = (newText) => {
    setText(newText);
    if (selectedNode) {
      onNodeUpdate(selectedNode.id, { ...selectedNode.data, text: newText });
    }
  };

  if (!selectedNode) {
    return null;
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Settings
        </h2>
        <button
          onClick={onBack}
          className="p-1 hover:bg-gray-100 rounded-md transition-colors duration-200"
          title="Back to Nodes Panel"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Node Info */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-4 h-4 text-blue-500" />
          <span className="font-medium text-gray-700">Text Message</span>
        </div>
        <p className="text-xs text-gray-500">
          Edit the message content that will be sent to users.
        </p>
      </div>

      {/* Text Editor */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message Text
        </label>
        <textarea
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Enter your message here..."
          className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          autoFocus
        />
        <p className="text-xs text-gray-500 mt-1">
          This message will be displayed in the chatbot flow.
        </p>
      </div>

      {/* Additional Settings Section (for future features) */}
      <div className="mt-6 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-xs text-yellow-700">
          <strong>Note:</strong> More settings will be available here as new
          node types are added.
        </p>
      </div>
    </div>
  );
};

export default SettingsPanel;
