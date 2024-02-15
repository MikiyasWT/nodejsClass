// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require('nodemailer');
const config = require('../config/config');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.email,
    pass: config.email_password,
  },
});

module.exports = transporter;
