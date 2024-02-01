const express = require('express');
const mongoose = require('mongoose');
const blogRouter = require('./routes/blog.route');
const {errorHandler, errorConverter} = require('./middlewares/error')
const ApiError = require('./utils/ApiError.JS');
const config = require('./config/config');

const connectDatabase = require('./config/database')
const logger = require('./config/logger')
const http = require('http')
const app = require('./server')


// const app = express();

connectDatabase();


const httpServer = http.createServer(app)
const server = httpServer.listen(config.port, () => {
  //console.log(`server listening on port ${config.port}`);
  logger.info(`server listening on port ${config.port}`);
});

//unhandled promise rejection

const unExpectedErrorHandler = (error) => {
  if(config.environmnet === 'DEVELOPMENT'){
  //console.log(error);
  logger.error(`unexpected error  ${error}`)
  serverExitHandler();
  }
  serverExitHandler();

}

const serverExitHandler = () => {
    if(server){
      server.close(()=>{
        // console.log(
        //   "\x1b[34m%s\x1b[0m",
        //   "Shutting down the server due to Unhandled Promise rejection or Uncaught exception"
        // );
        logger.error("Shutting down the server due to Unhandled Promise rejection or Uncaught exception")
        process.exit(1);
      })
    } else {
      process.exit(1)
    }
}
process.on('unhandledRejection',unExpectedErrorHandler);
process.on('uncaughtException',unExpectedErrorHandler);
//this will not work on windows but since the deployment serer is more likely to be a linux it will work
process.on('SIGTERM',()=> {
  logger.info('sigterm received');
  if(server){
    server.close();
  }
})