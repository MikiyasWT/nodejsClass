const mongoose = require("mongoose");
const config = require('./config')
const ApiError = require('../utils/ApiError.JS') 

const logger = require('../config/logger')
const connectDatabase = () => {
  try {
    mongoose
      .connect(config.dbConnection)
      .then((con) => {
        logger.info(`MongoDB Database connected`)
        console.log(
          "\x1b[32m%s\x1b[0m",
          `MongoDB Database connected: ${con.connection.host}:${con.connection.port}`
        );
      });
  } catch (error) {
    console.error("Unable to connect to database");
    logger.error(`unable to connect to database`)
    
    // Handle the error or display a message to the user
  }
};

module.exports = connectDatabase;

