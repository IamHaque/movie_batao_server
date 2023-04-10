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

const connect = async () => {
  await client.connect();
};

connect();

const getCache = async (key) => {
  try {
    const value = await client.get(key);
    if (!value) return;

    return JSON.parse(value);
  } catch (e) {
    console.log('Get Error:', e.message);
  }
};

const setCache = async (key, value) => {
  try {
    return await client.set(key, JSON.stringify(value), {
      EX: 60 * 60 * 24,
    });
  } catch (e) {
    console.log('Set Error:', e.message);
  }
};

module.exports = { client, getCache, setCache };
