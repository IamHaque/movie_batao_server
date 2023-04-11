const redis = require('redis');

const Logger = require('../middlewares/logger.middleware');

const client = redis.createClient({
  url: process.env.REDIS_CONNECTION_STRING,
});

client.on('error', (err) =>
  Logger.logError(`Redis | Connection Failed | ${err.message}`)
);

client.on('connect', () => {
  Logger.log(`Redis | Connected`);
});

const getCache = async (key) => {
  try {
    const value = await client.get(key);
    if (!value) return;

    return JSON.parse(value);
  } catch (e) {
    Logger.logError(`Redis | Failed to GET cache data`);
  }
};

const setCache = async (key, value) => {
  try {
    return await client.set(key, JSON.stringify(value), {
      EX: 60 * 60 * 24,
    });
  } catch (e) {
    Logger.logError(`Redis | Failed to SET cache data`);
  }
};

module.exports = { client, getCache, setCache };
