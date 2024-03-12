const express = require('express');

const router = express.Router();
const { blogValidation } = require('../validations');
const validate = require('../middlewares/validate');
const { blogController } = require('../controller');
const auth = require('../middlewares/auth');
const upload = require('../utils/multer');
const recentBlogsCache = require('../middlewares/cache/recent-blogs');

router.get('/blogs', auth, recentBlogsCache, blogController.getRecentBlogs);
router.get('/blogs/search', auth, blogController.searchBlog);
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

router.get('/blog/image/:filename', auth, blogController.getFile);

module.exports = router;
