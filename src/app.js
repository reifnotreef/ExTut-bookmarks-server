// node reqs
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

// local reqs
const { NODE_ENV } = require('./config');
const validateBearerToken = require('./validate-bearer-token');
const errorHandler = require('./error-handler');
const bookmarksRouter = require('./bookmarks/bookmarks-router');

// define app
const app = express();
app.use(
  morgan(NODE_ENV === 'production' ? 'tiny' : 'common', {
    skip: () => NODE_ENV === 'test',
  })
);
app.use(cors());
app.use(helmet());
app.use(validateBearerToken);
app.use(bookmarksRouter);
app.use(errorHandler);

// base url/route
app.use('/bookmarks', bookmarksRouter);

module.exports = app;
