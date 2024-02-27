const { Worker } = require('bullmq');
const path = require('path');
const config = require('../../config/config');

const start = async () => {
  // 1st parameter is the queue name
  // 2nd parameter is the worker script path
  // third is connection to redis

  const processorPath = path.join(__dirname, 'image-processor.js');

  const ImageProcessorWorker = new Worker('ImageProcessor', processorPath, {
    connection: {
      host: config.redis.redisHost,
      port: config.redis.redisPort,
    },
    autorun: true,
  });

  ImageProcessorWorker.on('completed', (job) => `completed job ${job.id} `);
};

module.exports = { start };
