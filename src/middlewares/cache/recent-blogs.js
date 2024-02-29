const logger = require('../../config/logger');
const redisClient = require('../../config/redis');

module.exports = async (req, res, next) => {
  try {
    const key = 'recent-blogs';
    const cachedBlogs = await redisClient.get(key);
    if (!cachedBlogs) {
      next();
    } else {
      return res.json(JSON.parse(cachedBlogs));
    }
  } catch (error) {
    logger.error(error);
    next();
  }
};
