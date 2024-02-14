// const http = require('http');
// const express = require('express');
// const config = require('./config/config');
// const loader = require('./loaders');
// const logger = require('./config/logger');

// // unhandled promise rejection
// const serverExitHandler = (server) => {
//   if (server) {
//     server.close(() => {
//       logger.error(
//         'Shutting down the server due to Unhandled Promise rejection or Uncaught exception',
//       );
//       process.exit(1);
//     });
//   } else {
//     process.exit(1);
//   }
// };

// const unExpectedErrorHandler = (server, error) => {
//   if (config.environmnet === 'DEVELOPMENT') {
//     // console.log(error);
//     logger.error(`unexpected error  ${error}`);
//     serverExitHandler(server);
//   }
//   serverExitHandler(server);
// };

// const startServer = async () => {
//   const app = express();
//   await loader(app);

//   const httpServer = http.createServer(app);
//   const server = httpServer.listen(config.port, () => {
//     // console.log(`server listening on port ${config.port}`);
//     logger.info(`server listening on port ${config.port}`);
//   });

//   process.on('uncaughtException', unExpectedErrorHandler(server));
//   process.on('unhandledRejection', unExpectedErrorHandler(server));
//   // process.on('unhandledRejection', unExpectedErrorHandler(server));
//   // process.on('uncaughtException', unExpectedErrorHandler(server));
//   // this will not work on windows but since the deployment serer is more likely to be a linux it will work
//   process.on('SIGTERM', () => {
//     logger.info('sigterm received');
//     if (server) {
//       server.close();
//     }
//   });

//   process.on('SIGTERM', () => {
//     logger.info('SIGTERM recieved');
//     if (server) {
//       server.close();
//     }
//   });
// };

// startServer();

const http = require('http');
const express = require('express');
const config = require('./config/config');
const loader = require('./loaders');
const logger = require('./config/logger');

const exitHandler = (server) => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unExpectedErrorHandler = (server) => {
  return function (error) {
    logger.error(error);
    exitHandler(server);
  };
};

const startServer = async () => {
  const app = express();
  await loader(app);

  const httpServer = http.createServer(app);
  const server = httpServer.listen(config.port, () => {
    logger.info(`server listening on port ${config.port}`);
  });

  process.on('uncaughtException', unExpectedErrorHandler(server));
  process.on('unhandledRejection', unExpectedErrorHandler(server));
  process.on('SIGTERM', () => {
    logger.info('SIGTERM recieved');
    if (server) {
      server.close();
    }
  });
};

startServer();
