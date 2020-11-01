import mongoose from 'mongoose';

export const KeywordSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Keyword', KeywordSchema);
