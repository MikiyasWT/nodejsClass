const express = require('express');
const router = express.Router();
const { userValidation, authValidation } = require('./../validations');
const validate = require('./../middlewares/validate');
const { authController } = require('../controller');

router.post('/auth/register',validate(userValidation.createUserSchema), authController.register);
router.post('/auth/login',validate(authValidation.validateAuthSchema), authController.login);

module.exports = router;