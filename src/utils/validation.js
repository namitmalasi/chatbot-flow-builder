/**
 * Validates the flow before saving
 * Returns an array of validation errors if any
 * @param {import('../types/index.js').FlowNode[]} nodes
 * @param {import('../types/index.js').FlowEdge[]} edges
 * @returns {import('../types/index.js').ValidationError[]}
 */
export const validateFlow = (nodes, edges) => {
  const errors = [];

  // Check if there are more than one nodes
  if (nodes.length <= 1) {
    return errors; // No validation needed for single node or empty flow
  }

  // Find nodes with empty target handles (no incoming edges)
  const nodesWithIncomingEdges = new Set(edges.map((edge) => edge.target));
  const nodesWithoutIncomingEdges = nodes.filter(
    (node) => !nodesWithIncomingEdges.has(node.id)
  );

  if (nodesWithoutIncomingEdges.length > 1) {
    errors.push({
      type: "error",
      message: `Error: More than one node has empty target handles. Only one starting node is allowed.`,
      nodeIds: nodesWithoutIncomingEdges.map((node) => node.id),
    });
  }

  return errors;
};

/**
 * Checks if a source handle already has an outgoing edge
 * @param {string} sourceNodeId
 * @param {import('../types/index.js').FlowEdge[]} edges
 * @returns {boolean}
 */
export const hasOutgoingEdge = (sourceNodeId, edges) => {
  return edges.some((edge) => edge.source === sourceNodeId);
};

/**
 * Validates if a new edge can be created
 * @param {string} sourceNodeId
 * @param {string} targetNodeId
 * @param {import('../types/index.js').FlowEdge[]} edges
 * @returns {boolean}
 */
export const canCreateEdge = (sourceNodeId, targetNodeId, edges) => {
  // Check if source already has an outgoing edge
  if (hasOutgoingEdge(sourceNodeId, edges)) {
    return false;
  }

  // Prevent self-connection
  if (sourceNodeId === targetNodeId) {
    return false;
  }

  // Check if this exact connection already exists
  const existingEdge = edges.find(
    (edge) => edge.source === sourceNodeId && edge.target === targetNodeId
  );

  return !existingEdge;
};
