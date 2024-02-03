const { User, Token } = require("../models");
const ApiError = require("../utils/ApiError.JS");
const httpStatus = require("http-status");
const { userService, tokenService } = require("./index");
const { tokenTypes } = require("../config/token");

const { RateLimiterMongo } = require("rate-limiter-flexible");
const mongoose = require("mongoose");
const maxAttemptsPerDay = 100;
const maxAttemptsByIpUserName = 10;
const maxAttemptsPerEmail = 10;

const login = async (email, password, ipAddr) => {
  const rateLimiterOptioins = {
    storeClient: mongoose.connection,
    dbName: 'udemyclass',
    blockDuration: 60 * 60 * 24,
  };
  const emailIpBruteLimiter = new RateLimiterMongo({
    ...rateLimiterOptioins,
    points: maxAttemptsByIpUserName,
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
  const promises = [slowerBruteLimiter.consume(ipAddr)];
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
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
      tokenTypes.REFRESH
    );

    const user = await userService.getUserById(refreshTokenDoc.user);

    if (!user) {
      throw new Error();
    }
    await Token.findByIdAndDelete(refreshTokenDoc.id);
    return tokenService.generateAuthTokens(user.id);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};

module.exports = { login, refreshAuthToken };
