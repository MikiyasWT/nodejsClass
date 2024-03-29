const { validateEnvironment } = require('../validations/env.validation');
require('dotenv').config();

const { value: envVars, error } = validateEnvironment(process.env);

if (error) {
  // eslint-disable-next-line no-console
  console.log(error);
}
module.exports = {
  port: envVars.PORT,
  dbConnection: envVars.DB_CONNECTION,
  environmnet: envVars.NODE_ENV,
  email: envVars.EMAIL,
  email_password: envVars.EMAIL_PASSWORD,
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_EXPIRES_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRES_DAYS,
  },
  rateLimiter: {
    maxAttemptsPerDay: envVars.MAX_ATTEMPTS_PER_DAY,
    maxAttemptsByIpUsername: envVars.MAX_ATTEMPTS_BY_IP_USER_NAME,
    maxAttemptsPerEmail: envVars.MAX_ATTEMPTS_PER_EMAIL,
  },
  contentSecurityPolicyOptions: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'", "'fonts.gstatic.com'"],
    },
    reportOnly: true,
  },
  redis: {
    redisHost: envVars.REDIS_HOST,
    redisPort: envVars.REDIS_PORT,
  },
};
