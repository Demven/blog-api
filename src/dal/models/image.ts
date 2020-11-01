import mongoose from 'mongoose';

export const ImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  description: String,
  credits: String,
});

export default mongoose.model('Image', ImageSchema);
