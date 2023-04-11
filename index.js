const Logger = require('./middlewares/logger.middleware');

// import environmental variables
require('dotenv').config();

// connect to mongoDB
const MongoConnection = require('./database/db');
MongoConnection.once('open', startServer);

function startServer() {
  // connect to redis
  const CacheHandler = require('./handlers/cache.handler');
  (async () => await CacheHandler.client.connect())();

  // start the server
  const app = require('./app');
  const PORT = process.env.PORT || 3100;
  app.listen(PORT, () => {
    Logger.log(`Server started at ${process.env.BASE_URL}:${PORT}`);
  });
}
