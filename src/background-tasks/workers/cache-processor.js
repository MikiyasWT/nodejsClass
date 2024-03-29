const redisClient = require('../../config/redis');
const logger = require('../../config/logger');

async function updateCache(blogs) {
  await redisClient.set('recent-blogs', blogs, (error) => {
    if (error) {
      logger.error('Error setting cache:', error);
    } else {
      logger.info('Cache updated successfully.');
    }
  });
}

module.exports = async (job) => {
  const blogs = JSON.stringify(job.data.blogs);

  if (redisClient.connected) {
    // Redis is already connected, proceed to update the cache
    updateCache(blogs);
  } else {
    // Redis is not connected, connect first, then update the cache
    redisClient.connect().then(() => {
      updateCache(blogs);
    });
  }
};
