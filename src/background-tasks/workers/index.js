const { Worker } = require('bullmq');
const path = require('path');
const config = require('../../config/config');
const logger = require('../../config/logger');

const startImageProcessor = async () => {
  // 1st parameter is the queue name
  // 2nd parameter is the worker script path
  // third is connection to redis

  const processorPath = path.join(__dirname, 'image-processor.js');

  const ImageProcessorWorker = new Worker('ImageProcessor', processorPath, {
    connection: {
      host: config.redis.redisHost,
      port: config.redis.redisPort,
    },
    // removeOnComplete:true,
    // concurrency: 3,
    autorun: true,
  });

  ImageProcessorWorker.on('completed', (job) =>
    logger.info(`completed job ${job.id} `),
  );
  ImageProcessorWorker.on('failed', (job) =>
    logger.error(`image processing job failed for ${job.failedReason} `),
  );
};

const startCacheProcessor = async () => {
  const processorPath = path.join(__dirname, 'cache-processor.js');

  const CacheProcessorWorker = new Worker('Cache', processorPath, {
    connection: {
      host: config.redis.redisHost,
      port: config.redis.redisPort,
    },
    // removeOnComplete:true,
    // concurrency: 3,
    autorun: true,
  });

  CacheProcessorWorker.on('completed', (job) =>
    logger.info(`caching job completed ${job.id} `),
  );
  CacheProcessorWorker.on('failed', (job) =>
    logger.error(`caching job failed for ${job.failedReason} `),
  );
};

module.exports = { startImageProcessor, startCacheProcessor };
