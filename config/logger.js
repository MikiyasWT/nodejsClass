const winston = require("winston");
const { format, createLogger, transports } = winston;
const { printf, combine, timestamp, colorize, uncolorize } = format;
const config = require("./config");

const winstonFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp}: ${level}: ${stack || message}`;
});
const logger = createLogger({
  level: config.environmnet === 'DEVELOPMENT' ? 'debug' : 'info',
  format: combine(
    timestamp(),
    winstonFormat,
    config.environmnet === 'DEVELOPMENT' ? colorize() : uncolorize()
  ),
  transports: [new transports.Console(),
    new transports.File({ filename: "./app.log" }),],
});
module.exports = logger;
