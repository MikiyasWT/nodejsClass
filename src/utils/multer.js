// eslint-disable-next-line import/no-extraneous-dependencies
const multer = require('multer');
const httpStatus = require('http-status');
const ApiError = require('./ApiError');

// eslint-disable-next-line no-unused-vars
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const filePath = `${__dirname}/../../uploads`;
    cb(null, filePath);
  },
  filename(req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

module.exports = multer({
  fileFilter(req, file, cb) {
    const maxFileSize = 3 * 1024 * 1024;
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(
        new ApiError(httpStatus.BAD_REQUEST, 'Only images are allowed'),
        false,
      );
    }
    if (file.size > maxFileSize) {
      cb(new ApiError(httpStatus.BAD_REQUEST, "image can't excced 3MB"), false);
    } else {
      cb(null, true);
    }
  },
});
