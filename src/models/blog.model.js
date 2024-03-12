const mongoose = require('mongoose');
const toJson = require('@meanie/mongoose-to-json');
// eslint-disable-next-line import/no-extraneous-dependencies
const mongooseLeanGetters = require('mongoose-lean-getters');

const commentSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const blogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      get(value) {
        return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
      },
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
  },
  { toJSON: { getters: true } },
);

blogSchema.plugin(toJson);
blogSchema.plugin(mongooseLeanGetters);
const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
