const ImageProcessorQueue = require('./queues/image-processor');
const CacheProcessorQueue = require('./queues/cache-processor');

module.exports = {
  ImageProcessor: {
    Queue: ImageProcessorQueue,
  },
  CacheProcessor: {
    Queue: CacheProcessorQueue,
  },
};
