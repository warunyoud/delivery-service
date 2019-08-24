const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const {
  getRouteCost,
  getNumberOfRoutes,
  getCheapestCostDjikstra,
  createNewGraph
} = require('./helpers.js');
const {
  getAllGraphs,
  getGraphFromId,
  insertGraph,
  getStoredCheapestCost,
  storeCheapestCost
} = require('./access.js');

const url = 'mongodb://localhost:27017';
const dbName = 'test';

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/build')));

MongoClient.connect(url, (err, client) => {
  if (err) {
    console.log(err);
    return;
  }

  const db = client.db(dbName);
  insertGraph(
    db,
    createNewGraph('AB1,AC4,AD10,BE3,CD4,CF2,DE1,EA2,EB3,FD1'),
    () => {}
  );

  app.get('/api/getRouteCost', (req, res) => {
    const { graphId, route } = req.query;

    if (!graphId || !route || !/(\w-)+\w/.test(route)) {
      res.json(null);
      return;
    }

    getGraphFromId(db, graphId, (docs) => {
      if (docs.length == 0){
        res.json(null);
        return;
      }
      const { edgeDict } = docs[0];
      const cost = getRouteCost(route, edgeDict);
      if (cost < 0) {
        res.json('No Such Route');
      } else {
        res.json(cost);
      }
    });
  });

  app.get('/api/getNumberOfRoutes', (req, res) => {
    const { graphId, origin, endpoint } = req.query;
    let { maxStop, maxCost, noRepeat } = req.query;

    if (!graphId || !origin || !endpoint || !noRepeat) {
      res.json(null);
      return;
    }

    if ((maxStop && !/\d+/.test(maxStop)) || (maxCost && !/\d+/.test(maxCost))) {
      res.json(null);
      return;
    }

    noRepeat = noRepeat === 'true';
    if (!noRepeat && !maxCost && !noRepeat) {
      // Avoid infinite loop
      res.json(null);
      return;
    }
    getGraphFromId(db, graphId, (docs) => {
      if (docs.length == 0){
        res.json(null);
        return;
      }
      const { edgeDict } = docs[0];
      const numberOfRoutes = getNumberOfRoutes(origin, endpoint, edgeDict, maxStop, noRepeat, maxCost);
      res.json(numberOfRoutes);
    });
  });

  app.get('/api/getCheapestCost', (req, res) => {
    const { graphId, origin, endpoint } = req.query;
    if (!graphId || !origin || !endpoint) {
      res.json(null);
      return;
    }

    // check if the path has already been calculated
    getStoredCheapestCost(db, origin, graphId, (docs) => {
      if (docs.length > 0) {
        if (endpoint in docs[0].lowestCostDict) {
          res.json(docs[0].lowestCostDict[endpoint]);
        } else {
          res.json('No Such Route');
        }
      } else {
        getGraphFromId(db, graphId, (docs) => {
          if (docs.length == 0){
            res.json(null);
            return;
          }
          const { edgeDict, nodeList } = docs[0];
          const lowestCostDict = getCheapestCostDjikstra(origin, edgeDict, nodeList);
          storeCheapestCost(db, origin, graphId, lowestCostDict, () => {});
          if (endpoint in lowestCostDict) {
            res.json(lowestCostDict[endpoint]);
          } else {
            res.json('No Such Route');
          }
        });
      }
    });
  });

  app.post('/api/createNewGraph', (req, res) => {
    let graph = req.body.graph;
    if (!graph) {
      res.json(null);
      return;
    }
    // remove spaces
    graph = graph.replace(/\s/g, '');
    if(!/(\w\w\d+)+/.test(graph)) {
      res.json(null);
      return;
    }
    insertGraph(db, createNewGraph(graph), (insertedId) => {
      res.json(insertedId);
    });
  });

  app.get('/api/getAllGraphs', (req, res) => {
    getAllGraphs(db, (docs) => {
      res.json(docs.map((item) => ({ _id: item._id, graph: item.graph })));
    });
  });

  app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
  });


  const port = process.env.PORT || 5000;
  app.listen(port);

  console.log('App is listening on port ' + port);
});
