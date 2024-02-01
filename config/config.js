


const {validateEnvironment } = require('../validations/env.validation')
require('dotenv').config();


const { value: envVars, error } = validateEnvironment(process.env);

if (error) {
  console.log(error);
}
module.exports = {
  port: envVars.PORT,
  dbConnection: envVars.DB_CONNECTION,
  environmnet:envVars.NODE_ENV,
  jwt : {
    secret:envVars.JWT_SECRET,
    accessExpirationMinutes:envVars.JJWT_EXPIRES_MINUTES
  }
};