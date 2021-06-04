const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const client = require('./service/database.js');

const indexRouter = require('./routes/index.js');
const authRouter = require('./routes/auth.js');
const blogRouter = require('./routes/blog.js');
const editorRouter = require('./routes/editor.js');
const postRouter = require('./routes/protected/post.js');

const config = require('./config.js');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/login', authRouter);
app.use('/blog', blogRouter);
app.use('/editor', editorRouter);
app.use('/api/posts', postRouter);

app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// THIS CODE BLOCK IS REFERENCED AND MODIFIED FROM THE FOLLOWING CLASS RESOURCE
// http://oak.cs.ucla.edu/classes/cs144/mongo/mongo-node.html
client.connect(config.credentials.database.url, (err) => {
  if (err) {
    console.log('Unable to connect to Mongo.'); // eslint-disable-line no-console
    process.exit(1);
  }
});

module.exports = app;
