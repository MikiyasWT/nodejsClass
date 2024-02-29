const fs = require('fs');
// const sharp = require('sharp');
const httpStatus = require('http-status');
const { Blog } = require('../models');
const ApiError = require('../utils/ApiError');
const { CacheProcessor } = require('../background-tasks');

const createBlog = async (body, userId) => {
  await Blog.create({ ...body, createdBy: userId });
};

const getRecentBlogs = async () => {
  const blogs = await Blog.find()
    .sort({
      createdAt: -1,
    })
    .limit(10);

  await CacheProcessor.Queue.add('CacheJob', { blogs });
  await CacheProcessor.startWorker();
  return blogs;
};

const getReadableFileStream = async (filename) => {
  const filePath = `${__dirname}/../../uploads/${filename}`;
  if (!fs.existsSync(filePath)) {
    throw new ApiError(httpStatus.NOT_FOUND, 'File not found');
  }
  const stream = fs.createReadStream(filePath);
  return stream;
};
module.exports = {
  createBlog,
  getRecentBlogs,
  getReadableFileStream,
};
