const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_CONNECTION_STRING,
});

client.on('error', (error) =>
  console.error('Error Connecting to the Redis Cluster', error.message)
);

client.on('connect', () => {
  console.log('Successfully connected to the Redis cluster!');
});

module.exports = client;
