const express = require('express');
const app = express();
const blogRouter = require('./routes/blog.route');
const authRouter = require('./routes/auth.route');
const { errorHandler, errorConverter } = require('./middlewares/error');
const ApiError = require('./utils/ApiError.JS');
const morgan = require('./config/morgan')
const httpStatus = require('http-status');

app.use(morgan.errorHandler);
app.use(morgan.successHandler);
app.use(express.json());
app.use(blogRouter);
app.use(authRouter);
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});
app.use(errorConverter);
app.use(errorHandler);

module.exports = app;