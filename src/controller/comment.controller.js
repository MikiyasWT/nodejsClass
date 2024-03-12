const httpStatus = require('http-status');
const { commentService } = require('../services');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ApiError = require('../utils/ApiError');

const addComment = catchAsyncErrors(async (req, res) => {
  const blog = await commentService.addComment(
    req.body.blogId,
    req.body.comment,
  );
  if (!blog) {
    throw new ApiError('Blog not found', httpStatus.NOT_FOUND);
  }
  res.status(httpStatus.CREATED).send({ success: true, blog });
});

module.exports = { addComment };
