// import environmental variables
require('dotenv').config();

// connect to mongoDB
require('./database/db');

// connect to redis
// require('./handlers/cache.handler');

// start the server
const app = require('./app');
const PORT = process.env.PORT || 3100;
const server = app.listen(PORT, () => {
  console.log(`Server started at ${process.env.BASE_URL}:${PORT}`);
});
