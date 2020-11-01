import mongoose from 'mongoose';

export const CategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  color: String,
});

export default mongoose.model('Category', CategorySchema);
