import mongoose from 'mongoose';
const uniqueValidator = require('mongoose-unique-validator');

export const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  keywords: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Keyword',
    required: true,
  }],
  views: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ViewsCount',
    required: true,
  },
  thanks: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ThanksCount',
    required: true,
  },
  publication_date: {
    type: Date,
    default: Date.now,
  },
  last_updated: {
    type: Date,
    default: Date.now,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  body: [mongoose.Schema.Types.Mixed],
});

ArticleSchema.plugin(uniqueValidator);

export default mongoose.model('Article', ArticleSchema);

