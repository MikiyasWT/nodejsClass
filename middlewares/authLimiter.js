const { RateLimiterMongo } = require("rate-limiter-flexible");
const mongoose = require("mongoose");
const ApiError = require('../utils/ApiError.JS')
const httpStatus = require('http-status')

const maxAttemptsPerDay = 100;
const maxAttemptsByIpUsername = 10;
const maxAttemptsPerEmail = 10


const rateLimiterOptioins = {
    storeClient: mongoose.connection,
    dbName: 'udemyclass',
    blockDuration: 60 * 60 * 24,
  };
  const emailIpBruteLimiter = new RateLimiterMongo({
    ...rateLimiterOptioins,
    points: maxAttemptsByIpUsername,
    duration: 60 * 10,
  });
  
  const slowerBruteLimiter = new RateLimiterMongo({
    ...rateLimiterOptioins,
    points: maxAttemptsPerDay,
    duration: 60 * 60 * 24,
  });
  
  const emailBruteLimiter = new RateLimiterMongo({
    ...rateLimiterOptioins,
    points: maxAttemptsPerEmail,
    duration: 60 * 60 * 24,
  });
  
  const authLimiter = async (req, res, next) => {
    const ipAddr = req.connection.remoteAddress;
    const emailIpKey = `${req.body.email}_${ipAddr}`;
    const [slowerBruteRes, emailIpRes, emailBruteRes] = await Promise.all([
      slowerBruteLimiter.get(ipAddr),
      emailIpBruteLimiter.get(emailIpKey),
      emailBruteLimiter.get(req.body.email),
    ]);
    let retrySeconds = 0;
    if (
      slowerBruteRes &&
      slowerBruteRes.consumedPoints >= maxAttemptsPerDay
    ) {
      retrySeconds = Math.floor(slowerBruteRes.msBeforeNext / 1000) || 1;
    } else if (
      emailIpRes &&
      emailIpRes.consumedPoints >= maxAttemptsByIpUsername
    ) {
      retrySeconds = Math.floor(emailIpRes.msBeforeNext / 1000) || 1;
    } else if (
      emailBruteRes &&
      emailBruteRes.consumedPoints >= maxAttemptsPerEmail
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

