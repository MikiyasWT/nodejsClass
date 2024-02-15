const httpStatus = require('http-status');
const { blogService } = require('../services');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ApiError = require('../utils/ApiError');

const createBlog = catchAsyncErrors(async (req, res) => {
  await blogService.createBlog(req.body, req.user.id);
  res
    .status(httpStatus.CREATED)
    .send({ success: true, message: 'Blog created successfyly' });
});

const getBlogs = catchAsyncErrors(async (req, res) => {
  const blogs = await blogService.getBlogs(req.body.userId);
  res.status(httpStatus.OK).json(blogs);
});

const uploadFile = catchAsyncErrors(async (req, res) => {
  if (!req.file) {
    throw new ApiError(httpStatus.NOT_FOUND, 'File not found');
  }
  res
    .status(httpStatus.OK)
    .send({ success: true, filePath: `/uploads/${req.file.filename}` });
});

module.exports = {
  createBlog,
  getBlogs,
  uploadFile,
};
