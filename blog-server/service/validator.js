const isEmpty = (obj) => obj === '' || obj === null || obj === undefined;
const isNumber = (obj) => typeof obj === 'number';
const isDigitOnly = (s) => s.match(/^\d*$/);

class ValidationError extends Error {
  constructor(message, httpStatus = 400, name = 'Bad Request') {
    super(message, name);
    this.message = message;
    this.httpStatus = httpStatus;
    this.name = name;
  }
}

const validatePostId = (postid) => {
  if (isEmpty(postid)) {
    throw new ValidationError('Invalid post ID, post ID cannot be empty');
  } else if (!isNumber(postid) && !isDigitOnly(postid)) {
    throw new ValidationError('Invalid post ID, post ID must be an integer');
  }
};

const validateUsername = (username) => {
  if (isEmpty(username)) {
    throw new ValidationError('Invalid username, username cannot be empty');
  }
};

const validatePassword = (password) => {
  if (isEmpty(password)) {
    throw new ValidationError('Invalid password, password cannot be empty');
  }
};

const validateTitle = (title) => {
  if (isEmpty(title)) {
    throw new ValidationError('Title cannot be empty for this request');
  }
};

module.exports = {
  isEmpty,
  validatePostId,
  validateUsername,
  validatePassword,
  validateTitle,
};
