const { RateLimiterMongo } = require("rate-limiter-flexible");
const mongoose = require("mongoose");
const ApiError = require('../utils/ApiError.JS');
const httpStatus = require('http-status');
const config = require('../config/config.js')

// const maxAttemptsPerDay = 100;
// const maxAttemptsByIpUsername = 10;
// const maxAttemptsPerEmail = 10


//blockDuration: 60seconds * 60 * 24,   3600seconds multipled by 24 which is 24 hours
const rateLimiterOptioins = {
    storeClient: mongoose.connection,
    dbName: 'udemyclass',
    blockDuration: 60 * 60 * 24,
  };

  //only allwed maxAttemptsByIpUsername value of tries in 60sec*10 which is 10 minute otherwise will be blocked for 
  const emailIpBruteLimiter = new RateLimiterMongo({
    ...rateLimiterOptioins,
    points:config.rateLimiter.maxAttemptsByIpUsername,
    duration: 60 * 10,
  });

  //in a case where an attacker trying to to rbute by making only 9 tries a day forever
  // we can catch him using this instance
  const slowerBruteLimiter = new RateLimiterMongo({
    ...rateLimiterOptioins,
    points:config.rateLimiter.maxAttemptsPerDay,
    duration: 60 * 60 * 24,
  });
 

  //in a case where mltiple ip requests are to signin using a similar email , 1 email address multiple ip address
  const emailBruteLimiter = new RateLimiterMongo({
    ...rateLimiterOptioins,
    points:config.rateLimiter.maxAttemptsPerEmail,
    duration: 60 * 60 * 24,
  });

  
  const authLimiter = async (req, res, next) => {
    const ipAddr = req.connection.remoteAddress;
    const emailIpKey = `${req.body.email}_${ipAddr}`;

    //retirieving the counts of email and ip address that had attempted to signin we count the consumedpoints
    const [slowerBruteRes, emailIpRes, emailBruteRes] = await Promise.all([
      slowerBruteLimiter.get(ipAddr),
      emailIpBruteLimiter.get(emailIpKey),
      emailBruteLimiter.get(req.body.email),
    ]);
    let retrySeconds = 0;

    if (
      slowerBruteRes &&
      slowerBruteRes.consumedPoints >= config.rateLimiter.maxAttemptsPerDay
    ) {
      retrySeconds = Math.floor(slowerBruteRes.msBeforeNext / 1000) || 1;
    } else if (
      emailIpRes &&
      emailIpRes.consumedPoints >= config.rateLimiter.maxAttemptsByIpUsername
    ) {
      retrySeconds = Math.floor(emailIpRes.msBeforeNext / 1000) || 1;
    } else if (
      emailBruteRes &&
      emailBruteRes.consumedPoints >= config.rateLimiter.maxAttemptsPerEmail
    ) {
      retrySeconds = Math.floor(emailBruteRes.msBeforeNext / 1000) || 1;
    }
  
    if (retrySeconds > 0) {
      res.set('Retry-After', String(retrySeconds));
      return next(
        new ApiError(httpStatus.TOO_MANY_REQUESTS, 'Too many requests'),
      );
    }
  
    next();
  };
  
  module.exports = {
    emailIpBruteLimiter,
    slowerBruteLimiter,
    authLimiter,
  };

