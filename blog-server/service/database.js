// CODE IN THIS MODULE REFERENCED AND MODIFIED FROM THE FOLLOWING CLASS RESOURCE
// http://oak.cs.ucla.edu/classes/cs144/mongo/mongo-node.html

const { MongoClient } = require('mongodb');

const options = { useUnifiedTopology: true, writeConcern: { j: true } };
let client = null;

const connect = (url, callback) => {
  if (client == null) {
    client = new MongoClient(url, options);
    client.connect((err) => {
      if (err) {
        client = null;
        callback(err);
      } else {
        callback();
      }
    });
  } else {
    callback();
  }
};

const db = (dbName) => client.db(dbName);

const startSession = () => client.startSession();

const close = () => {
  if (client) {
    client.close();
    client = null;
  }
};

module.exports = {
  connect,
  db,
  startSession,
  close,
};
