const catchAsyncErrors = require("./../middlewares/catchAsyncErrors");
const { userService, tokenService, authService } = require("../services");
const httpStatus = require("http-status");

const register = catchAsyncErrors(async (req, res) => {
  // create a user
  const user = await userService.registerUser(req.body);
  // generate token
  const token = await tokenService.generateAuthTokens(user.id);
  res.status(httpStatus.CREATED).send({ success: true, user, token });
});

const login = catchAsyncErrors(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.login(email, password);
  const token = await tokenService.generateAuthTokens(user.id);
  res.status(httpStatus.OK).send({ success: true, user, token });
});


const refreshToken = catchAsyncErrors(async (req, res) => {
   const tokens = await authService.refreshAuthToken(req.body.refreshToken)
   res.status(httpStatus.OK).send({...tokens})
});


module.exports = {
  register,
  login,
  refreshToken
};
