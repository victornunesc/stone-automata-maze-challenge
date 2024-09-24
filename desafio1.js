const initialMap = [
  ["s", "o", "o", "o", "o", "o", "o", "o"],
  ["o", "o", "o", "o", "x", "o", "o", "o"],
  ["o", "o", "x", "o", "x", "x", "o", "o"],
  ["o", "x", "x", "o", "o", "x", "x", "o"],
  ["o", "o", "x", "o", "x", "x", "o", "o"],
  ["o", "o", "o", "o", "x", "o", "o", "o"],
  ["o", "o", "o", "o", "o", "o", "o", "f"],
];

function generateMap(initialMap) {
  let newMap = [];

  for (let i = 0; i < initialMap.length; i++) {
    let newRow = [];
    for (let j = 0; j < initialMap[i].length; j++) {
      // Count the number of infected neighbors
      let infectedNeighbors = 0;
      // check 3x3
      for (let k = i - 1; k <= i + 1; k++) {
        for (let y = j - 1; y <= j + 1; y++) {
          if (
            k >= 0 &&
            k < initialMap.length &&
            y >= 0 &&
            y < initialMap[i].length &&
            !(k == i && y == j)
          ) {
            if (initialMap[k][y] == "x") {
              infectedNeighbors++;
            }
          }
        }
      }

      // Apply the propagation rules
      if (initialMap[i][j] == "o") {
        if (infectedNeighbors == 2 || infectedNeighbors == 3) {
          newRow.push("x");
        } else {
          newRow.push("o");
        }
      } else if (initialMap[i][j] == "x") {
        if (infectedNeighbors >= 7) {
          newRow.push("o");
        } else if (infectedNeighbors >= 4) {
          newRow.push("x");
        } else {
          newRow.push("o");
        }
      } else {
        newRow.push(initialMap[i][j]);
      }
    }
    newMap.push(newRow);
  }

  return newMap;
}

let newMap = initialMap;

function findPath() {
  // Create the starting node with the initial map and position
  let startNode = {
    map: initialMap,
    position: [0, 0],
    path: [],
    visited: new Set(),
  };

  let moves = [
    { row: -1, col: 0 },
    { row: 0, col: -1 },
    { row: 1, col: 0 },
    { row: 0, col: 1 },
  ];

  // Create a queue to store the nodes to be processed
  let queue = [startNode];

  // Create a set to keep track of visited nodes
  // let visited = new Set();

  // Loop until the queue is empty
  while (queue.length > 0) {
    // Remove the first node from the queue
    let currentNode = queue.pop();

    // Check if the current node is the end node
    if (currentNode.position[0] == 6 && currentNode.position[1] == 7) {
      return currentNode.path.concat([currentNode.position]);
    }

    // Generate the new map from the current map
    let newMap = generateMap(currentNode.map);
    // Loop through the neighbors of the current position
    for (let move of moves) {
      // Check if the neighbor is within bounds and not the current position

      if (
        currentNode.position[0] + move.row >= 0 &&
        currentNode.position[0] + move.row < newMap.length &&
        currentNode.position[1] + move.col >= 0 &&
        currentNode.position[1] + move.col < newMap[0].length &&
        (move.row != 0 || move.col != 0)
      ) {
        // Check if the neighbor is a valid move (i.e. 'o' and not visited)
        let neighborPosition = [
          currentNode.position[0] + move.row,
          currentNode.position[1] + move.col,
        ];
        if (
          (newMap[neighborPosition[0]][neighborPosition[1]] == "o" ||
            newMap[neighborPosition[0]][neighborPosition[1]] == "f") &&
          !currentNode.visited.has(neighborPosition.toString())
        ) {
          // Create a new node for the neighbor and add it to the queue
          let newPath = currentNode.path.concat([currentNode.position]);
          currentNode.visited.add(neighborPosition.toString());

          let newNode = {
            map: newMap,
            position: neighborPosition,
            path: newPath,
            visited: new Set(),
          };
          queue.push(newNode);
        }
      }
    }
  }

  // No path found
  return null;
}

var start = console.time();
console.log(findPath());
var end = console.timeEnd();
console.log(`Execution time: ${end - start} ms`);
