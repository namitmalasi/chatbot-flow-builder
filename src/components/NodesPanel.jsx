import { MessageSquare, Plus } from "lucide-react";

const NodesPanel = ({ onDragStart }) => {
  const nodeTypes = [
    {
      id: "text",
      type: "text",
      label: "Message",
      icon: "MessageSquare",
      description: "Send a text message",
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5" />
        Nodes Panel
      </h2>

      <div className="space-y-2">
        {nodeTypes.map((nodeType) => (
          <div
            key={nodeType.id}
            draggable
            onDragStart={(event) => onDragStart(event, nodeType.type)}
            className="p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-grab active:cursor-grabbing hover:bg-gray-100 hover:border-gray-300 transition-all duration-200"
          >
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <span className="font-medium text-gray-700">
                {nodeType.label}
              </span>
            </div>
            <p className="text-xs text-gray-500">{nodeType.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-700">
          <strong>Tip:</strong> Drag nodes from here to the canvas to build your
          chatbot flow.
        </p>
      </div>
    </div>
  );
};

export default NodesPanel;
