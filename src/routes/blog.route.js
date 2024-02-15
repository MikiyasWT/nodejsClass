const express = require('express');

const router = express.Router();
const { blogValidation } = require('../validations');
const validate = require('../middlewares/validate');
const { blogController } = require('../controller');
const auth = require('../middlewares/auth');
const upload = require('../utils/multer');

router.get(
  '/blogs',
  auth,
  validate(blogValidation.getBlogSchema),
  blogController.getBlogs,
);
router.post(
  '/blog',
  auth,
  validate(blogValidation.createBlogSchema),
  blogController.createBlog,
);

router.post(
  '/blog/cover-image',
  auth,
  upload.single('coverImage'),
  blogController.uploadFile,
);

module.exports = router;
