const { User } = require('../models');
const ApiError = require('../utils/ApiError.JS');
const httpStatus = require('http-status');

const registerUser = async (body) => {
    if(await User.isEmailTaken(body.email)){
        throw new ApiError(httpStatus.BAD_REQUEST,'Email already taken')
    }
  const user = await User.create(body);
  return user;
};

const getUserByEmail = async (email) => {
    return await User.findOne({ email})
}


module.exports = {
    registerUser, getUserByEmail
};