const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const users = require('../model/users.js');
const validator = require('./validator.js');
const config = require('../config.js');

class AuthenticationError extends Error {
  constructor(message, httpStatus = 401, name = 'Unauthorized') {
    super(message, name);
    this.message = message;
    this.httpStatus = httpStatus;
    this.name = name;
  }
}

const authenticateUser = async (username, password) => {
  const user = await users.getOneUser(username);
  if (validator.isEmpty(user)) {
    throw new AuthenticationError(`User ${username} does not exist`);
  } else {
    const res = await bcrypt.compare(password, user.password);
    if (res === false) {
      throw new AuthenticationError('Username and password do not match');
    }
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 2),
        usr: username,
      },
      config.credentials.auth.jwt.secret,
      config.credentials.auth.jwt.options,
    );
    return token;
  }
};

const verifyToken = (token) => new Promise((resolve, reject) => {
  jwt.verify(token, config.credentials.auth.jwt.secret, (error, decoded) => {
    if (error) {
      reject(new AuthenticationError(`Invalid cookie, ${error.message}`));
    } else {
      resolve(decoded);
    }
  });
});

const verifyTokenAndUsername = (token, username) => new Promise((resolve, reject) => {
  jwt.verify(token, config.credentials.auth.jwt.secret, (error, decoded) => {
    if (error) {
      reject(new AuthenticationError(`Invalid cookie, ${error.message}`));
    } else if (username !== decoded.usr) {
      reject(new AuthenticationError('Invalid cookie, cookie does not match provided username'));
    } else {
      resolve(decoded);
    }
  });
});

module.exports = {
  authenticateUser,
  verifyToken,
  verifyTokenAndUsername,
};
