const mongoose = require('mongoose');
const toJson = require('@meanie/mongoose-to-json');

const commentSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
  },
  createdBy: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  },
  comment: [commentSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

blogSchema.plugin(toJson);
const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
