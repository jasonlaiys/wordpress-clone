const client = require('./database.js');
const blogs = require('../model/blogs.js');
const users = require('../model/users.js');
const validator = require('./validator.js');

class TransactionError extends Error {
  constructor(message, httpStatus, name) {
    super(message, name);
    this.message = message;
    this.httpStatus = httpStatus;
    this.name = name;
  }
}

// Transaction is used to ensure atomicity in inserting a new post and incrementing user maxid
// CODE IN THIS FUNCTION REFERENCED AND MODIFIED FROM THE FOLLOWING INTERNET RESOURCES
// https://docs.mongodb.com/manual/core/transactions/
// https://www.mongodb.com/blog/post/quick-start-nodejs--mongodb--how-to-implement-transactions
const insertNewPost = async (username, title, body) => {
  const session = client.startSession();
  const transactionResult = await new Promise((resolve, reject) => {
    session.withTransaction(async () => {
      const user = await users.getOneUser(username);
      if (validator.isEmpty(user)) {
        await session.abortTransaction();
        await session.endSession();
        reject(new TransactionError(`User '${username}' not found in database`, 404, 'Not Found'));
      }

      let inserted;
      try {
        inserted = await blogs.insertOnePost(username, user.maxid + 1, title, body);
      } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        reject(new TransactionError(error.message, error.httpStatus, error.name));
      }

      try {
        await users.updateUserMaxId(username, user.maxid + 1);
      } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        reject(new TransactionError(error.message, error.httpStatus, error.name));
      }

      await session.endSession();
      resolve(inserted);
    }, {
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' },
    });
  });
  return transactionResult;
};

module.exports = {
  insertNewPost,
};
