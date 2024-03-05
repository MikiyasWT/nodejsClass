const ImageProcessorQueue = require('./queues/image-processor');
const {
  CacheProcessorQueue,
  CacheInvalidatorQueue,
} = require('./queues/cache-processor');

module.exports = {
  ImageProcessor: {
    Queue: ImageProcessorQueue,
  },
  CacheProcessor: {
    Queue: CacheProcessorQueue,
  },
  CacheInvalidator: {
    Queue: CacheInvalidatorQueue,
  },
};
