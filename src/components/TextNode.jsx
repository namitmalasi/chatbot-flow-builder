import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { MessageSquare } from "lucide-react";

const TextNode = memo(({ data, selected }) => {
  return (
    <div
      className={`relative bg-white rounded-lg shadow-md border-2 transition-all duration-200 min-w-[200px] ${
        selected
          ? "border-blue-500 shadow-lg"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500 border-2 border-white shadow-md"
        style={{ top: -6 }}
      />

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-gray-600">
            Text Message
          </span>
        </div>

        <div className="text-sm text-gray-800 min-h-[20px] break-words">
          {data.text || "Enter your message..."}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-green-500 border-2 border-white shadow-md"
        style={{ bottom: -6 }}
      />
    </div>
  );
});

TextNode.displayName = "TextNode";

export default TextNode;
