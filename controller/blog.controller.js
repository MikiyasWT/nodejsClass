
const {blogService} = require('../services');
const httpStatus = require('http-status');
const createBlog = async (req, res) => {
  await blogService.createBlog(req.body)
  res.status(httpStatus.CREATED).send({ success: true, message: 'Blog created successfyly' });
};

const getBlogs = async (req, res) => {
  const blogs = await blogService.getBlogs()
  res.status(httpStatus.OK).json(blogs);
};

module.exports = {
  createBlog,
  getBlogs,
};