import React, { useState, useEffect, useRef } from "react";
import { dijkstra } from "./Graph";

const graph = {
  A: [
    { node: "B", distance: 2 },
    { node: "F", distance: 2 },
  ],
  B: [
    { node: "A", distance: 2 },
    { node: "C", distance: 2 },
    { node: "G", distance: 1 },
  ],
  C: [
    { node: "B", distance: 2 },
    { node: "E", distance: 3 },
    { node: "F", distance: 2 },
  ],
  D: [
    { node: "E", distance: 2 },
    { node: "G", distance: 2 },
  ],
  E: [
    { node: "C", distance: 3 },
    { node: "D", distance: 2 },
  ],
  F: [
    { node: "A", distance: 2 },
    { node: "C", distance: 2 },
  ],
  G: [
    { node: "B", distance: 1 },
    { node: "D", distance: 2 },
  ],
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
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [distance, setDistance] = useState(0);
  const animationFrameId = useRef(null);

  useEffect(() => {
    const result = dijkstra(graph, "A", "E");
    setSteps(result.steps);
    setDistance(result.distance);

    let stepIndex = 0;

    const animate = () => {
      stepIndex++;
      if (stepIndex < result.steps.length) {
        setCurrentStep(stepIndex);
        animationFrameId.current = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(animationFrameId.current);
      }
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId.current);
  }, []);

  const renderEdges = () => {
    const edges = [];
    for (let node in graph) {
      graph[node].forEach((neighbor) => {
        edges.push(
          <g key={`${node}-${neighbor.node}`}>
            <line
              x1={nodes[node].x}
              y1={nodes[node].y}
              x2={nodes[neighbor.node].x}
              y2={nodes[neighbor.node].y}
              stroke="gray"
              strokeWidth="2"
            />
            <text
              x={(nodes[node].x + nodes[neighbor.node].x) / 2}
              y={(nodes[node].y + nodes[neighbor.node].y) / 2}
              fill="black"
              fontSize="12"
            >
              {neighbor.distance}
            </text>
          </g>
        );
      });
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
          fill={
            steps[currentStep] && steps[currentStep].includes(node)
              ? "green"
              : "blue"
          }
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
    if (!steps[currentStep]) return null;
    const pathEdges = [];
    for (let i = 0; i < steps[currentStep].length - 1; i++) {
      pathEdges.push(
        <line
          key={`path-${steps[currentStep][i]}-${steps[currentStep][i + 1]}`}
          x1={nodes[steps[currentStep][i]].x}
          y1={nodes[steps[currentStep][i]].y}
          x2={nodes[steps[currentStep][i + 1]].x}
          y2={nodes[steps[currentStep][i + 1]].y}
          stroke="red"
          strokeWidth="4"
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
      <div>
        <h2>
          Current Path:{" "}
          {steps[currentStep] ? steps[currentStep].join(" -> ") : ""}
        </h2>
        <h3>Distance: {distance}</h3>
      </div>
    </div>
  );
};

export default DijkstraVisualization;
