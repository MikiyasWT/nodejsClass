const httpStatus = require('http-status');
const { RateLimiterMongo } = require('rate-limiter-flexible');
const mongoose = require('mongoose');
const { Token } = require('../models');
const ApiError = require('../utils/ApiError');
const { userService, tokenService } = require('./index');
const { tokenTypes } = require('../config/token');
const config = require('../config/config');
// const maxAttemptsPerDay = 100;
// const maxAttemptsByIpUserName = 10;
// const maxAttemptsPerEmail = 10;

const login = async (email, password, ipAddr) => {
  // blockDuration: 60seconds * 60 * 24,   3600seconds multipled by 24 which is 24 hours
  const rateLimiterOptioins = {
    storeClient: mongoose.connection,
    dbName: 'udemyclass',
    blockDuration: 60 * 60 * 24,
  };

  // only allwed maxAttemptsByIpUsername value of tries in 60sec*10 which is 10 minute otherwise will be blocked for
  const emailIpBruteLimiter = new RateLimiterMongo({
    ...rateLimiterOptioins,
    points: config.rateLimiter.maxAttemptsByIpUsername,
    duration: 60 * 10,
  });

  // in a case where an attacker trying to to rbute by making only 9 tries a day forever
  // we can catch him using this instance
  const slowerBruteLimiter = new RateLimiterMongo({
    ...rateLimiterOptioins,
    points: config.rateLimiter.maxAttemptsPerDay,
    duration: 60 * 60 * 24,
  });

  // in a case where mltiple ip requests are to signin using a similar email , 1 email address multiple ip address
  const emailBruteLimiter = new RateLimiterMongo({
    ...rateLimiterOptioins,
    points: config.rateLimiter.maxAttemptsPerEmail,
    duration: 60 * 60 * 24,
  });

  const promises = [slowerBruteLimiter.consume(ipAddr)];
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    // for every unsuccessful request we record the email, ipaddress we increment it
    // eslint-disable-next-line no-unused-expressions
    user &&
      promises.push([
        emailIpBruteLimiter.consume(`${email}_${ipAddr}`),
        emailBruteLimiter.consume(email),
      ]);
    await Promise.all(promises);
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

const refreshAuthToken = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(
      refreshToken,
      tokenTypes.REFRESH,
    );

    const user = await userService.getUserById(refreshTokenDoc.user);

    if (!user) {
      throw new Error();
    }
    await Token.findByIdAndDelete(refreshTokenDoc.id);
    return tokenService.generateAuthTokens(user.id);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

module.exports = { login, refreshAuthToken };
