const getRouteCost = (route, edgeDict) => {
  const routeNodes = route.split('-');
  if (routeNodes.length < 2) return -1;

  let cost = 0;
  let previousNode = null;
  for (let i = 0; i < routeNodes.length; i++) {
    node = routeNodes[i];
    if (previousNode) {
      if (previousNode in edgeDict && node in edgeDict[previousNode]) {
        cost += edgeDict[previousNode][node];
      } else {
        cost = -1;
        break;
      }
    }
    previousNode = node;
  }
  return cost;
};

const getNumberOfRoutesHelper = (current, endpoint, edgeDict, maxStop, noRepeat, maxCost, visitedEdge,
  stop, cost) => {
  let numberOfRoutes = 0;
  if (current == endpoint && Object.keys(visitedEdge).length > 0) {
    numberOfRoutes++;
    if (noRepeat) {
      return numberOfRoutes;
    }
  }
  if (stop + 1 > maxStop || !(current in edgeDict)) {
    return numberOfRoutes;
  }

  for (neighbor in edgeDict[current]) {
    const clonedVisitedEdge = {...visitedEdge};
    const edge = `${current}, ${neighbor}`;
    const nextCost = cost + edgeDict[current][neighbor];
    if ((!noRepeat || !(edge in clonedVisitedEdge)) && nextCost <= maxCost) {
      clonedVisitedEdge[edge] = true;
      numberOfRoutes += getNumberOfRoutesHelper(neighbor, endpoint, edgeDict, maxStop,
        noRepeat, maxCost, clonedVisitedEdge, stop + 1, nextCost);
    }
  }
  return numberOfRoutes;
};

const getNumberOfRoutes = (origin, endpoint, edgeDict, maxStop = 1e99, noRepeat = true, maxCost = 1e99) => {
  return getNumberOfRoutesHelper(origin, endpoint, edgeDict, maxStop, noRepeat, maxCost, {}, 0, 0);
};

const getNextNodeDjikstra = (unvisited, costs) => {
  const unvisitedPair = unvisited.map((node, i) => [node, i]);
  return unvisitedPair.reduce((a, b) => costs[a[0]] < costs[b[0]] ? a : b);
};

const getCheapestCostDjikstra = (startNode, edgeDict, nodeList) => {
  const unvisited = [...nodeList];
  const costs = {};
  unvisited.forEach((node) => {
    costs[node] = node == startNode ? 0 : 1e99;
  });

  let currentNode = currentIndex = null;
  while (unvisited.length > 0) {
    if (currentNode) {
      [currentNode, currentIndex] = getNextNodeDjikstra(unvisited, costs);
    } else {
      currentNode = startNode;
      currentIndex = unvisited.indexOf(currentNode);
    }
    unvisited.splice(currentIndex, 1);
    for (neighbor in edgeDict[currentNode]) {
      const altDistance = costs[currentNode] + edgeDict[currentNode][neighbor];
      costs[neighbor] = Math.min(altDistance, costs[neighbor]);
    }
  }

  const candidate = nodeList.filter((node) => node in edgeDict && startNode in edgeDict[node]);
  costs[startNode] = Math.min(...candidate.map((node) => costs[node] + edgeDict[node][startNode]));
  return costs;
};

const createNewGraphHelper = (node, nodeDict) => {
  if (!(node in nodeDict)) {
    nodeDict[node] = true;
  }
};

const createNewGraph = (graph) => {
  const edges = graph.split(',').sort();
  graph = edges.join();
  const edgeDict = {};
  const nodeDict = {};
  edges.forEach((edge) => {
    const start = edge[0];
    const dest = edge[1];
    const cost = parseInt(edge.slice(2));

    if (!(start in edgeDict)) {
      edgeDict[start] = {};
    }
    edgeDict[start][dest] = cost ;
    createNewGraphHelper(start, nodeDict);
    createNewGraphHelper(dest, nodeDict);
  });
  return {
    graph,
    edgeDict,
    nodeList: Object.keys(nodeDict),
    default: false
  };
};

module.exports = {
  getRouteCost,
  getNumberOfRoutes,
  getCheapestCostDjikstra,
  createNewGraph
};
