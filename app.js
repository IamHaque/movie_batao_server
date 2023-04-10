const swaggerUI = require('swagger-ui-express');
const express = require('express');
const pino = require('pino-http');
const helmet = require('helmet');
const cors = require('cors');

const ErrorHandler = require('./handlers/error.handler');
const swaggerSpecification = require('./config/swagger.config');

// create Express app
const app = express();

// Takes the raw requests and turns them into usable properties on req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middlewares
app.use(
  cors({
    origin: '*',
  })
);
app.use(pino());
app.use(helmet());

// Serve static files
app.use(express.static(__dirname + '/public'));

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

// Development Error Handler - Prints stack trace
// if (app.get('env') === 'development') {
//   app.use(ErrorHandler.developmentErrors);
// }

// Production Error Handler
app.use(ErrorHandler.productionErrors);

// Export app
module.exports = app;
