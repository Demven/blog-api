import mongoose from 'mongoose';

export const HomepageSectionSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  articles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
  order: {
    type: Number,
    unique: true,
    required: true,
  },
});

export default mongoose.model('HomepageSection', HomepageSectionSchema);
