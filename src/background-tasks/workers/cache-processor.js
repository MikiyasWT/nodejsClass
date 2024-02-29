const redisClient = require('../../config/redis');
const logger = require('../../config/logger');

module.exports = async (job) => {
  const blogs = JSON.stringify(job.data.blogs);

  // checks if redis is already started or not , if not it will start
  redisClient.ping(async (error) => {
    if (error) {
      logger.error(`Redis server is not running. ${error}`);
      await redisClient.connect();
    } else {
      logger.info(`Redis server is  already running`);
    }
  });

  await redisClient.set('recent-blogs', blogs);
  Promise.resolve(blogs);
};
