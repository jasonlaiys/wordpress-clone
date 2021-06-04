const client = require('../service/database.js');
const config = require('../config.js');

const DatabaseError = require('./DatabaseError.js');

const getOneUser = async (username) => {
  const result = await client.db(config.credentials.database.name)
    .collection(config.credentials.database.usersCollection)
    .findOne(
      { username },
      { projection: { _id: 0 } },
    );
  return result;
};

const updateUserMaxId = (username, maxid) => new Promise((resolve, reject) => {
  client.db(config.credentials.database.name)
    .collection(config.credentials.database.usersCollection)
    .updateOne(
      { username },
      { $set: { maxid } },
      (err, document) => {
        if (err) {
          reject(new DatabaseError(err.message, 404, 'Not Found'));
        } else {
          resolve(document);
        }
      },
    );
});

module.exports = {
  getOneUser,
  updateUserMaxId,
};
