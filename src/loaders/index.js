const fs = require('fs');
const mongooseLoader = require('./mongoose');
const expressLoader = require('./express');
const logger = require('../config/logger');
const subscribers = require('../subscribers');
const EventEmitter = require('../utils/EventEmitter');
const redisClient = require('../config/redis');

// this loader is respsponsible for loading
// whatever is neccessary for the app to run
module.exports = async (app) => {
  await mongooseLoader();
  logger.info('Database started');
  await redisClient.connect();
  logger.info('Redis Connected');
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
};
