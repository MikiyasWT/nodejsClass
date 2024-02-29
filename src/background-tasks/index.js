const ImageProcessorQueue = require('./queues/image-processor');
const CacheProcessorQueue = require('./queues/cache-processor');
const { startCacheProcessor, startImageProcessor } = require('./workers');

module.exports = {
  ImageProcessor: {
    Queue: ImageProcessorQueue,
    startWorker: startImageProcessor,
  },
  CacheProcessor: {
    Queue: CacheProcessorQueue,
    startWorker: startCacheProcessor,
  },
};
