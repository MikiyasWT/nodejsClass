// eslint-disable-next-line import/no-extraneous-dependencies
const redis = require('redis');
const logger = require('./logger');

const client = redis.createClient();

client.on('error', (err) => {
  if (err) {
    logger.error(`unable to connect to Redis ${err}`);
  } else {
    logger.info('Redis Connected');
  }
});

module.exports = client;
