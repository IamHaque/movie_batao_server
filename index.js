const mongoose = require('mongoose');

// import environmental variables
require('dotenv').config();

// connect to Database and handle any bad connections
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  autoIndex: true,
});
mongoose.connection.on('error', (err) => {
  console.error(`[MongoError] → ${err.message}`);
});

// import database models
require('./database/models/user.model');
require('./database/models/collection.model');

(async () => {
  // import redis cache
  const CacheHandler = require('./handlers/cache.handler');
  await CacheHandler.client.connect();
})();

// start the server
const app = require('./app');
const PORT = process.env.PORT || 3100;
const server = app.listen(PORT, () => {
  console.log(`Server started at ${process.env.BASE_URL}:${PORT}`);
});
