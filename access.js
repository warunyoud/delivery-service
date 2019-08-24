const mongo = require('mongodb');
const mainCollection = 'graphs';
const costCollection = 'cheapestCost';

const getAllGraphs = (db, callback) => {
  db.collection(mainCollection).find({}).toArray((err, docs) => {
    if (!err) {
      callback(docs);
    }
  });
};

const getGraphFromId = (db, graphId, callback) => {
  db.collection(mainCollection).find({ _id: new mongo.ObjectID(graphId) }).toArray((err, docs) => {
    if (!err) {
      callback(docs);
    }
  })
};

const insertGraph = (db, graphObject, callback) => {
  db.collection(mainCollection).find({ graph: graphObject.graph }).toArray((err, docs) => {
    if (err) {
      return null;
    }
    if (docs.length == 0) {
      db.collection(mainCollection).insertOne(graphObject, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          callback(res.insertedId);
        }
      });
    } else {
      callback(docs[0]._id);
    }
  });
};

const getStoredCheapestCost = (db, origin, graphId, callback) => {
  db.collection(costCollection).find({ graphId: new mongo.ObjectID(graphId), origin: origin }).toArray(
    (err, docs) => {
      if (!err) {
        callback(docs);
      }
    }
  );
};

const storeCheapestCost = (db, origin, graphId, lowestCostDict, callback) => {
  db.collection(costCollection).insertOne({
    origin: origin, graphId: new mongo.ObjectID(graphId), lowestCostDict }, (err, res) => {
      if (err) {
        console.log(err)
      } else {
        callback(res.insertedId);
      }
  });
};

module.exports = {
  getAllGraphs,
  getGraphFromId,
  insertGraph,
  getStoredCheapestCost,
  storeCheapestCost
};
