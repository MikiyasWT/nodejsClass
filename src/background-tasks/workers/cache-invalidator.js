const redisClient = require('../../config/redis');
const logger = require('../../config/logger');

async function invalidateCache(key) {
  await redisClient.del(key, (error, length) => {
    if (error) {
      logger.error('Error appending blog:', error);
    } else {
      logger.info(`New blog appended successfully. Total length: ${length}`);
    }
  });
}

module.exports = async (job) => {
  const { key } = job.data;
  if (redisClient.isOpen) {
    // Redis is already connected, proceed to update the cache
    invalidateCache(key);
  } else {
    // Redis is not connected, connect first, then update the cache
    redisClient.connect().then(() => {
      invalidateCache(key);
    });
  }
};
