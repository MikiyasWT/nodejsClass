const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError.JS');
const EventEmitter = require('../utils/EventEmitter');

const registerUser = async (body) => {
  if (await User.isEmailTaken(body.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const user = await User.create(body);

  // sending meail to the user
  EventEmitter.emit('signup', user);
  return user;
};

const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const getUserById = async (id) => {
  return User.findById(id);
};

module.exports = {
  registerUser,
  getUserByEmail,
  getUserById,
};
