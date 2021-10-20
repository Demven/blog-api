import mongoose from 'mongoose';

export const ThanksCountSchema = new mongoose.Schema({
  count: {
    type: Number,
    required: true,
    default: 0,
  },
});

export default mongoose.model('ThanksCount', ThanksCountSchema);
