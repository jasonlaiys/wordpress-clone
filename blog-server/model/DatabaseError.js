class DatabaseError extends Error {
  constructor(message, httpStatus, name) {
    super(message, name);
    this.message = message;
    this.httpStatus = httpStatus;
    this.name = name;
  }
}

module.exports = DatabaseError;
