const mongooseLoader = require('./mongoose');
const expressLoader = require('./express');
const logger = require('../config/logger');
const subscribers = require('../subscribers');
const EventEmitter = require('../utils/EventEmitter');
// this loader is respsponsible for loading
// whatever is neccessary for the app to run
module.exports = async (app) => {
  await mongooseLoader();
  logger.info('Database started');
  await expressLoader(app);
  logger.info('Express app initiated');

  Object.keys(subscribers).forEach((eventName) => {
    EventEmitter.on(eventName, subscribers[eventName]);
  });
};
