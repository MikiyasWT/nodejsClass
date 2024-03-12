const fs = require('fs');
// const sharp = require('sharp');
const httpStatus = require('http-status');
const { Blog } = require('../models');
const ApiError = require('../utils/ApiError');
const { CacheProcessor, CacheInvalidator } = require('../background-tasks');

const createBlog = async (body, userId) => {
  const newBlog = await Blog.create({ ...body, createdBy: userId });
  await CacheInvalidator.Queue.add('InvalidCache', {
    key: 'recent-blogs',
    blog: newBlog,
  });
};

const getRecentBlogs = async () => {
  try {
    const blogs = await Blog.find()
      .sort({
        createdAt: -1,
      })
      .limit(7)
      .lean({ getters: true });
    await CacheProcessor.Queue.add('CacheJob', { blogs });
    return blogs;
  } catch (error) {
    throw new Error('Error while caching blogs');
  }
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
