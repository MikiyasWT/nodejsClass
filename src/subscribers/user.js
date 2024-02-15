const transporter = require('../utils/email-transport');
const config = require('../config/config');

const signUp = async (user) => {
  // sending meail to the user
  await transporter.sendMail({
    from: config.email,
    to: user.email,
    subject: 'Successfuly registered',
    text: 'Thanks for Signing up with us',
  });
};

module.exports = { signup: signUp };
