const swaggerUI = require('swagger-ui-express');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const ErrorHandler = require('./handlers/error.handler');
const swaggerSpecification = require('./config/swagger.config');
const Logger = require('./middlewares/logger.middleware');

// create Express app
const app = express();

// Takes the raw requests and turns them into usable properties on req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middlewares
app.use(helmet());
app.use(
  cors({
    origin: '*',
  })
);

// Serve static files
app.use(express.static(__dirname + '/public'));

// Logger middleware
app.use(Logger.loggerMiddleware);

// Handle routes
app.use('/', require('./routes/media.route'));
app.use('/user', require('./routes/user.route'));
app.use(
  '/docs',
  swaggerUI.serve,
  swaggerUI.setup(swaggerSpecification, {
    explorer: true,
    customCssUrl: '/swagger-ui.css',
  })
);
app.get('/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpecification);
});

// If that above routes didn't work, we 404 them and forward to error handler
app.use(ErrorHandler.notFound);

// Error Handler
app.use(ErrorHandler.productionErrors);

// Export app
module.exports = app;
