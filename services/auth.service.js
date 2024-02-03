const { User, Token } = require('../models');
const ApiError = require('../utils/ApiError.JS');
const httpStatus = require('http-status');
const { userService, tokenService } = require('./index');
const { tokenTypes } = require('../config/token');


const login = async (email, password) => {
    const user = await userService.getUserByEmail(email);
    if (!user || !(await user.isPasswordMatch(password))) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
    return user;
  };


  const refreshAuthToken = async (refreshToken) => {
    try {
      const refreshTokenDoc = await tokenService.verifyToken(
        refreshToken,
        tokenTypes.REFRESH);

        
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


module.exports = { login, refreshAuthToken }