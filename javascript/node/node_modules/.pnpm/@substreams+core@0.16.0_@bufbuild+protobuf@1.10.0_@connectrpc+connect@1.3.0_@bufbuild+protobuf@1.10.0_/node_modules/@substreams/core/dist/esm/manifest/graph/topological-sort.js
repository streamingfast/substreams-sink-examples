export function topologicalSort(nodes, node, visited = new Set(), stack = new Set()) {
  if (visited.has(node)) {
    return stack;
  }
  visited.add(node);
  const adjacents = nodes.get(node);
  if (adjacents === undefined) {
    throw new Error(`Module ${node.name} not found in graph`);
  }
  for (const incoming of adjacents.values()) {
    if (!visited.has(incoming)) {
      topologicalSort(nodes, incoming, visited, stack);
    }
  }
  stack.add(node);
  return stack;
}
//# sourceMappingURL=topological-sort.js.map