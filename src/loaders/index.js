const fs = require('fs');
const mongooseLoader = require('./mongoose');
const expressLoader = require('./express');
const logger = require('../config/logger');
const subscribers = require('../subscribers');
const EventEmitter = require('../utils/EventEmitter');
const redisClient = require('../config/redis');
const createWorker = require('../background-tasks/workers');

const connectToRedis = async () => {
  try {
    await redisClient.connect().then(async (client) => {
      if (client.error) {
        logger.error(
          `unable to connect to Redis Server, make sure to start it`,
        );
        process.exit(1);
      }
      logger.info(`Connected to Redis Server G`);
    });
  } catch (error) {
    logger.error(`Redis server is not running. ${error} `);
    process.exit(1);
  }
};

// this loader is respsponsible for loading
// whatever is neccessary for the app to run
module.exports = async (app) => {
  await mongooseLoader();
  logger.info('Database started');
  await connectToRedis();
  await expressLoader(app);
  logger.info('Express app initiated');

  // registering subscribers for events
  Object.keys(subscribers).forEach((eventName) => {
    EventEmitter.on(eventName, subscribers[eventName]);
  });

  // check if the upload directory exist otherwise it creates one
  fs.access('uploads', fs.constants.F_OK, async (err) => {
    if (err) {
      await fs.promises.mkdir('uploads');
    }
  });

  const workers = [
    { name: 'ImageProcessor', filename: 'image-processor.js' },
    { name: 'Cache', filename: 'cache-processor.js' },
    { name: 'InvalidCache', filename: 'cache-invalidator.js' },
  ];

  workers.forEach(async (worker) => {
    await createWorker(worker.name, worker.filename);
  });
};
