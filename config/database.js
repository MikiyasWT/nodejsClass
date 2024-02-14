const mongoose = require('mongoose');
const config = require('./config');

const logger = require('./logger');

const connectDatabase = () => {
  try {
    mongoose.connect(config.dbConnection).then((con) => {
      logger.info(`MongoDB Database connected`);
      // eslint-disable-next-line no-console
      console.log(
        '\x1b[32m%s\x1b[0m',
        `MongoDB Database connected: ${con.connection.host}:${con.connection.port}`,
      );
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Unable to connect to database');
    logger.error(`unable to connect to database`);

    // Handle the error or display a message to the user
  }
};

module.exports = connectDatabase;
