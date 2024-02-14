/* eslint-disable no-console */
const mongoose = require('mongoose');
const config = require('../config/config');
const logger = require('../config/logger');

module.exports = async () => {
  try {
    const connection = mongoose.connect(config.dbConnection).then((con) => {
      logger.info(`MongoDB Database connected`);
      // eslint-disable-next-line no-console
      console.log(
        '\x1b[32m%s\x1b[0m',
        `MongoDB Database connected: ${con.connection.host}:${con.connection.port}`,
      );
    });

    return connection;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Unable to connect to database');
    logger.error(`unable to connect to database`);
  }
};
