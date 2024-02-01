


const {validateEnvironment } = require('../validations/env.validation')
require('dotenv').config();

console.log(process.env)

const { value: envVars, error } = validateEnvironment(process.env);

if (error) {
  console.log(error);
}
module.exports = {
  port: envVars.PORT,
  dbConnection: envVars.DB_CONNECTION,
  environmnet:envVars.NODE_ENV
};