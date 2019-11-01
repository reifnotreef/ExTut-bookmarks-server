const { NODE_ENV } = require('./config');
const logger = require('./logger').default;

function errorHandler(error, req, res, next) {
  let output;
  if (NODE_ENV === 'production') {
    output = { error: { message: 'server error' } };
  } else {
    logger.error(error.message);
    output = { message: error.message, error };
  }
  res.status(500).json(output);
}

module.exports = errorHandler;
