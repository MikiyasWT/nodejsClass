const httpStatus = require('http-status');
const { blogService } = require('../services');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ApiError = require('../utils/ApiError');
const { ImageProcessor } = require('../background-tasks');

const createBlog = catchAsyncErrors(async (req, res) => {
  await blogService.createBlog(req.body, req.user.id);
  res
    .status(httpStatus.CREATED)
    .send({ success: true, message: 'Blog created successfyly' });
});

const getRecentBlogs = catchAsyncErrors(async (req, res) => {
  const blogs = await blogService.getRecentBlogs();
  res.status(httpStatus.OK).json(blogs);
});

const searchBlog = catchAsyncErrors(async (req, res) => {
  const { searchQuery } = req.query;
  const blogs = await blogService.getSearchedBlog(searchQuery);
  res.json({ blogs });
});

const uploadFile = catchAsyncErrors(async (req, res) => {
  if (!req.file) {
    throw new ApiError(httpStatus.NOT_FOUND, 'File not found');
  }
  const fileName = `image-${Date.now()}.webp`;
  await ImageProcessor.Queue.add('ImageProcessorJob', {
    file: req.file,
    fileName,
  });
  res.status(httpStatus.OK).json({ fileName });
});

const getFile = catchAsyncErrors(async (req, res) => {
  const { filename } = req.params;
  const stream = await blogService.getReadableFileStream(filename);
  const contentType = `image/${filename.split('.')[1].toLowerCase()}`;
  res.setHeader('Content-Type', contentType);
  stream.pipe(res);
});

module.exports = {
  createBlog,
  getRecentBlogs,
  searchBlog,
  uploadFile,
  getFile,
};
