const { DateTime } = require('luxon');

function getFormattedDate() {
  return DateTime.now().setZone('Asia/Kolkata').toFormat('dd-LL-yyyy HH:mm:ss');
}

const log = (data) => {
  console.log(`[${getFormattedDate()}]  [LOG]  ${data}`);
};

const logInfo = (data) => {
  console.log(`[${getFormattedDate()}]  [INF]  ${data}`);
};

const logError = (error) => {
  console.log(`[${getFormattedDate()}]  [ERR]  ${error}`);
};

const loggerMiddleware = (req, res, next) => {
  const { method, url } = req;
  const status = res.statusCode;
  log(`${method} \t ${status} \t ${url}`);

  next();
};

module.exports = { log, logInfo, logError, loggerMiddleware };
