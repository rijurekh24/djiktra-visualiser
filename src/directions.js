const directionMap = {
  north: { right: "east", left: "west" },
  south: { right: "west", left: "east" },
  east: { right: "south", left: "north" },
  west: { right: "north", left: "south" },
};

const directions = {
  A: { B: "east", C: "south" },
  B: { A: "west", C: "south", D: "east" },
  C: { A: "north", B: "north", E: "east" },
  D: { B: "west", E: "south" },
  E: { C: "west", D: "north" },
};

function getTurn(currentOrientation, newDirection) {
  if (directionMap[currentOrientation].right === newDirection) {
    return "right";
  } else if (directionMap[currentOrientation].left === newDirection) {
    return "left";
  } else {
    return null;
  }
}

export function generateDirections(path, initialOrientation) {
  const directionsList = [];
  let currentOrientation = initialOrientation;

  for (let i = 0; i < path.length - 1; i++) {
    const from = path[i];
    const to = path[i + 1];
    const newDirection = directions[from][to];

    const turn = getTurn(currentOrientation, newDirection);
    directionsList.push(`Turn ${turn} from ${from} to ${to}`);

    currentOrientation = newDirection;
  }

  return directionsList;
}
