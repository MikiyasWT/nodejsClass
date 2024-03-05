const { Queue } = require('bullmq');
const config = require('../../config/config');

function createQueue(name) {
  return new Queue(name, {
    connection: {
      host: config.redis.host,
      port: config.redis.port,
    },
  });
}

const CacheProcessorQueue = createQueue('Cache');
const CacheInvalidatorQueue = createQueue('InvalidCache');

module.exports = { CacheProcessorQueue, CacheInvalidatorQueue };
