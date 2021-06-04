const client = require('../service/database.js');
const config = require('../config.js');
const validator = require('../service/validator.js');

const DatabaseError = require('./DatabaseError.js');

const getAllPosts = async (username) => {
  const result = await client.db(config.credentials.database.name)
    .collection(config.credentials.database.postsCollection)
    .find(
      { username },
      { projection: { _id: 0, username: 0 } },
    );
  return result.toArray();
};

const getFivePostsFromIndex = async (username, startid) => {
  const result = await client.db(config.credentials.database.name)
    .collection(config.credentials.database.postsCollection)
    .find(
      { username, postid: { $gte: startid } },
      { projection: { _id: 0, username: 0 } },
    )
    .sort({ postid: 1 })
    .limit(6);
  return result.toArray();
};

const getOnePost = (username, postid) => new Promise((resolve, reject) => {
  client.db(config.credentials.database.name)
    .collection(config.credentials.database.postsCollection)
    .findOne(
      { username, postid },
      { projection: { _id: 0, username: 0 } },
      (err, document) => {
        if (err) {
          reject(new DatabaseError(err.message, 500, 'Internal Server Error'));
        } else if (validator.isEmpty(document)) {
          reject(new DatabaseError(`Post not found for user '${username}' and post ID ${postid}`, 404, 'Not Found'));
        } else {
          resolve(document);
        }
      },
    );
});

const insertOnePost = (username, postid, title, body) => new Promise((resolve, reject) => {
  const now = new Date().getTime();
  client.db(config.credentials.database.name)
    .collection(config.credentials.database.postsCollection)
    .insert(
      {
        postid, username, created: now, modified: now, title, body,
      },
      (err, res) => {
        if (err) {
          reject(new DatabaseError(err.message, 500, 'Internal Server Error'));
        } else if (res.insertedCount !== 1) {
          reject(new DatabaseError('Failed to insert post into database', 500, 'Internal Server Error'));
        } else {
          delete res.ops[0]._id; // eslint-disable-line no-underscore-dangle
          resolve(res.ops[0]);
        }
      },
    );
});

const updateOnePost = (username, postid, title, body) => new Promise((resolve, reject) => {
  client.db(config.credentials.database.name)
    .collection(config.credentials.database.postsCollection)
    .updateOne(
      { username, postid },
      { $set: { title, body, modified: new Date().getTime() } },
      (err, res) => {
        if (err) {
          reject(new DatabaseError(err.message, 404, 'Not Found'));
        } else {
          resolve(res.result.nModified);
        }
      },
    );
});

const deleteOnePost = (username, postid) => new Promise((resolve, reject) => {
  client.db(config.credentials.database.name)
    .collection(config.credentials.database.postsCollection)
    .deleteOne(
      { username, postid },
      (err, res) => {
        if (err) {
          reject(new DatabaseError(err.message, 500, 'Internal Server Error'));
        } else if (res.deletedCount === 0) {
          reject(new DatabaseError(`Post not found for user '${username}' and post ID ${postid}`, 404, 'Not Found'));
        } else {
          resolve(res.deletedCount);
        }
      },
    );
});

module.exports = {
  getAllPosts,
  getFivePostsFromIndex,
  getOnePost,
  insertOnePost,
  updateOnePost,
  deleteOnePost,
};
