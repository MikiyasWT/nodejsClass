const catchAsyncErrors = require('./../middlewares/catchAsyncErrors');
const {authService, tokenService} = require('../services');
const httpStatus = require('http-status');


const register = catchAsyncErrors(async (req, res) => {
    // create a user
    const user = await authService.registerUser(req.body);
    // generate token
    const token = await tokenService.generateAuthToken(user._id);
    res.status(httpStatus.CREATED).send({ user, token});
  });
  
  module.exports = {
    register,
  };
