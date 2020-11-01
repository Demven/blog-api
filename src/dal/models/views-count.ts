import mongoose from 'mongoose';

export const ViewsCountSchema = new mongoose.Schema({
  count: {
    type: Number,
    required: true,
    default: 0,
  },
});

export default mongoose.model('ViewsCount', ViewsCountSchema);
