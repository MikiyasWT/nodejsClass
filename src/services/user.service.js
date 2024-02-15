const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError.JS');
const transporter = require('../utils/email-transport');
const config = require('../config/config');

const registerUser = async (body) => {
  if (await User.isEmailTaken(body.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const user = await User.create(body);

  // sending meail to the user
  await transporter.sendMail({
    from: config.email,
    to: user.email,
    subject: 'Successfuly registered',
    text: 'Thanks for Signing up with us',
  });
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
