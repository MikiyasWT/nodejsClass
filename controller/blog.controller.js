
const {blogService} = require('../services');
const httpStatus = require('http-status');
const catchAsyncErrors = require('./../middlewares/catchAsyncErrors');

const createBlog = catchAsyncErrors(async (req, res) => {
  await blogService.createBlog(req.body, req.user.id)
  res.status(httpStatus.CREATED).send({ success: true, message: 'Blog created successfyly' });
});

const getBlogs = catchAsyncErrors(async (req, res) => {
  const blogs = await blogService.getBlogs(req.body.userId)
  res.status(httpStatus.OK).json(blogs);
});

module.exports = {
  createBlog,
  getBlogs,
};