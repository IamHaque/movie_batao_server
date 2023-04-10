const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MovieBatao REST API',
      version: '1.0.0',
      description: 'REST API for MovieBatao app',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'ChamberOfDevelopers',
        email: 'chamberofdevs@gmail.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3100',
        description: 'Local server',
      },
      {
        url: 'https://moviebataoserver.vercel.app',
        description: 'Production server',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpecification = swaggerJsdoc(options);

module.exports = swaggerSpecification;
