const {
  getRouteCost,
  getNumberOfRoutes,
  getCheapestCostDjikstra,
  createNewGraph
} = require('../helpers.js');

const graph = 'AB1,AC4,AD10,BE3,CD4,CF2,DE1,EA2,EB3,FD1';
const graphObject = createNewGraph(graph);
const { edgeDict, nodeList } = graphObject;
const expectedGraphObject = {
  graph: 'AB1,AC4,AD10,BE3,CD4,CF2,DE1,EA2,EB3,FD1',
  edgeDict:
   { A: { B: 1, C: 4, D: 10 },
     B: { E: 3 },
     C: { D: 4, F: 2 },
     D: { E: 1 },
     E: { A: 2, B: 3 },
     F: { D: 1 } },
  nodeList: [ 'A', 'B', 'C', 'D', 'E', 'F' ],
  default: false
};

describe('createNewGraph', () => {
  it('should return the correct result.', () => {
    expect(graphObject).toEqual(expectedGraphObject);
  });
  it('should sort the input making the order irrelevant.', () => {
    const reorder = graph.split(',');
    reorder.reverse();
    expect(createNewGraph(reorder.join())).toEqual(expectedGraphObject);
  });
});

describe('Case1: getRouteCost', () => {
  it('should return the correct result.', () => {
    expect(getRouteCost('A-B-E', edgeDict)).toEqual(4);
    expect(getRouteCost('A-D', edgeDict)).toEqual(10);
    expect(getRouteCost('E-A-C-F', edgeDict)).toEqual(8);
    expect(getRouteCost('A-D-F', edgeDict)).toEqual(-1);
  });
});

describe('Case2: getNumberOfRoutes', () => {
  it('should return the correct result given maxStop.', () => {
    expect(getNumberOfRoutes('E', 'D', edgeDict, 4)).toEqual(4);
  });
  it('should return the correct result.', () => {
    expect(getNumberOfRoutes('E', 'E', edgeDict)).toEqual(5);
  });
  it('should return the correct result given maxCost and repeat allowed.', () => {
    expect(getNumberOfRoutes('E', 'E', edgeDict, undefined, false, 19)).toEqual(29);
  });
});

describe('Case3: getCheapestCostDjikstra', () => {
  it('should return the correct result.', () => {
    expect(getCheapestCostDjikstra('E', edgeDict, nodeList)['D']).toEqual(9);
    expect(getCheapestCostDjikstra('E', edgeDict, nodeList)['E']).toEqual(6);
  });
});
