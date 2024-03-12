const { Blog } = require('../models');

const addComment = async (blogId, comment) => {
  const blog = await Blog.findOneAndUpdate(
    { _id: blogId },
    { $push: { comment } },
    { new: true },
  );
  return blog;
};

module.exports = { addComment };
