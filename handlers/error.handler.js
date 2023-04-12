const Logger = require('../middlewares/logger.middleware');

/*
  Catch Errors Handler

  With async/await, you need some way to catch errors
  Instead of using try{} catch(e) {} in each controller, we wrap the function in
  catchErrors(), catch and errors they throw, and pass it along to our express middleware with next()
*/

exports.catchErrors = (fn) => {
  return function (req, res, next) {
    return fn(req, res, next).catch((err) => {
      console.log(err);
      Logger.logError(`Controller | ${err.message}`);

      const error = new Error(err.message);
      error.status = err.status || 404;

      if (err.name === 'AxiosError' && err?.response?.data?.status_message) {
        error.message = err.response.data.status_message;
        error.status = err.response.status;
      }

      if (err.name === 'MongoServerError' && err.message.startsWith('E11000')) {
        error.message = 'already exists in DB';
      }

      next(error);
    });
  };
};

/*
    Not Found Error Handler
  
    If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
  */
exports.notFound = (req, res, next) => {
  Logger.logError(`404 | Not Found`);

  const err = new Error('Not Found');
  err.status = 404;
  next(err);
};

/*
    Error Handler
  
    No stacktraces are leaked to user
  */
exports.productionErrors = (err, req, res, next) => {
  Logger.logError(`Server | ${err.message}`);

  res.status(err.status || 500).json({
    message: err.message,
    status: err.status || 500,
  });
};
