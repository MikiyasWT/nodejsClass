const { Queue } = require('bullmq');
const config = require('../../config/config');

const ImageProcessorQueue = new Queue('ImageProcessor', {
  connection: {
    host: config.redis.redisHost,
    port: config.redis.redisPort,
  },
});

module.exports = ImageProcessorQueue;
