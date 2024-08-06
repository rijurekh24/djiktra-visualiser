import React, { useState, useEffect } from "react";
import { dijkstra } from "./Graph";

const graph = {
  A: { B: 2, F: 1 },
  B: { A: 2, C: 1, G: 1 },
  C: { B: 1, E: 3, F: 2 },
  D: { G: 2, E: 1 },
  E: { C: 3, D: 1 },
  F: { A: 1, C: 2 },
  G: { B: 1, D: 2 },
};

const nodes = {
  A: { x: 50, y: 50 },
  B: { x: 150, y: 50 },
  C: { x: 150, y: 150 },
  D: { x: 350, y: 50 },
  E: { x: 350, y: 150 },
  F: { x: 50, y: 150 },
  G: { x: 200, y: 50 },
};

const DijkstraVisualization = () => {
  const [path, setPath] = useState([]);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const result = dijkstra(graph, "G", "F");
    setPath(result.path);
    setDistance(result.distance);
  }, []);

  const renderEdges = () => {
    const edges = [];
    for (let node in graph) {
      for (let neighbor in graph[node]) {
        edges.push(
          <g key={`${node}-${neighbor}`}>
            <line
              x1={nodes[node].x}
              y1={nodes[node].y}
              x2={nodes[neighbor].x}
              y2={nodes[neighbor].y}
              stroke="gray"
              strokeWidth="2"
            />
            <text
              x={(nodes[node].x + nodes[neighbor].x) / 2}
              y={(nodes[node].y + nodes[neighbor].y) / 2}
              fill="black"
              fontSize="12"
            >
              {graph[node][neighbor]}
            </text>
          </g>
        );
      }
    }
    return edges;
  };

  const renderNodes = () => {
    return Object.keys(nodes).map((node) => (
      <g key={node}>
        <circle
          cx={nodes[node].x}
          cy={nodes[node].y}
          r="15"
          fill={path.includes(node) ? "green" : "blue"}
        />
        <text
          x={nodes[node].x}
          y={nodes[node].y}
          textAnchor="middle"
          alignmentBaseline="middle"
          fill="white"
          fontSize="12"
        >
          {node}
        </text>
      </g>
    ));
  };

  const renderPath = () => {
    const pathEdges = [];
    for (let i = 0; i < path.length - 1; i++) {
      pathEdges.push(
        <line
          key={`path-${path[i]}-${path[i + 1]}`}
          x1={nodes[path[i]].x}
          y1={nodes[path[i]].y}
          x2={nodes[path[i + 1]].x}
          y2={nodes[path[i + 1]].y}
          stroke="red"
          strokeWidth="2"
        />
      );
    }
    return pathEdges;
  };

  return (
    <div>
      <svg width="400" height="300">
        {renderEdges()}
        {renderPath()}
        {renderNodes()}
      </svg>
    </div>
  );
};

export default DijkstraVisualization;
