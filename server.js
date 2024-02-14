const express = require('express');

const app = express();
const httpStatus = require('http-status');
const passport = require('passport');
const { xss } = require('express-xss-sanitizer');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const blogRouter = require('./routes/blog.route');
const authRouter = require('./routes/auth.route');
const { errorHandler, errorConverter } = require('./middlewares/error');
const ApiError = require('./utils/ApiError.JS');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const {
  contentSecurityPolicyOptions,
  environmnet,
} = require('./config/config');

app.use(morgan.errorHandler);
app.use(morgan.successHandler);

// jwt authentication

app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

app.use(express.json());
// this must be used before the routes
app.use(xss());
app.use(
  helmet({
    contentSecurityPolicy: contentSecurityPolicyOptions,
  }),
);
// to protect app from no sql injection
app.use(mongoSanitize());

if (environmnet === 'PRODUCTION') {
  app.use(cors({ origin: 'url' }));
  app.options('*', cors({ origin: 'url' }));
} else {
  // enabling all cors
  app.use(cors());
  app.options('*', cors());
}

app.use(blogRouter);
app.use(authRouter);

// path not found
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});
app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
