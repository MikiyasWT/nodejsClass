const joi = require('joi');

function validateEnvironment(env) {

  const envVarSchema = joi
    .object({
      DB_CONNECTION: joi.string().required(),
      PORT: joi.number().positive().default(9000),
      NODE_ENV: joi.string().valid('DEVELOPMENT', 'PRODUCTION').required(),
    })
    .unknown();

  return envVarSchema.validate(env);
}

module.exports = {
    validateEnvironment
  };

