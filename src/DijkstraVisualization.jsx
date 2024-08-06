import React, { useState, useEffect, useRef } from "react";
import { dijkstra } from "./Graph";
import { generateDirections } from "./directions";

const graph = {
  A: { B: 2, C: 4 },
  B: { A: 2, C: 1, D: 7 },
  C: { A: 4, B: 1, E: 3 },
  D: { B: 7, E: 2 },
  E: { C: 3, D: 2 },
};

const nodes = {
  A: { x: 50, y: 50 },
  B: { x: 150, y: 50 },
  C: { x: 150, y: 150 },
  D: { x: 250, y: 50 },
  E: { x: 250, y: 150 },
};

const DijkstraVisualization = () => {
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [distance, setDistance] = useState(0);
  const [directions, setDirections] = useState([]);
  const animationFrameId = useRef(null);
  const initialOrientation = "north";

  useEffect(() => {
    const result = dijkstra(graph, "A", "E");
    setSteps(result.steps);
    setDistance(result.distance);
    setDirections(
      generateDirections(
        result.steps[result.steps.length - 1],
        initialOrientation
      )
    );

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
        <h3>Directions:</h3>
        <ul>
          {directions.map((dir, idx) => (
            <li key={idx}>{dir}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DijkstraVisualization;
