class PriorityQueue {
  constructor() {
    this.items = [];
  }

  enqueue(element, priority) {
    let queueElement = { element, priority };
    let added = false;

    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].priority > queueElement.priority) {
        this.items.splice(i, 0, queueElement);
        added = true;
        break;
      }
    }

    if (!added) {
      this.items.push(queueElement);
    }
  }

  dequeue() {
    return this.items.shift();
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

export function dijkstra(graph, startNode, endNode) {
  let distances = {};
  let prev = {};
  let pq = new PriorityQueue();

  for (let node in graph) {
    if (node === startNode) {
      distances[node] = 0;
      pq.enqueue(node, 0);
    } else {
      distances[node] = Infinity;
      pq.enqueue(node, Infinity);
    }
    prev[node] = null;
  }

  while (!pq.isEmpty()) {
    let minNode = pq.dequeue().element;

    if (minNode === endNode) {
      let path = [];
      let currentNode = endNode;

      while (currentNode) {
        path.unshift(currentNode);
        currentNode = prev[currentNode];
      }

      return { distance: distances[endNode], path };
    }

    for (let neighbor in graph[minNode]) {
      let alt = distances[minNode] + graph[minNode][neighbor];

      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        prev[neighbor] = minNode;
        pq.enqueue(neighbor, alt);
      }
    }
  }

  return { distance: Infinity, path: [] };
}
