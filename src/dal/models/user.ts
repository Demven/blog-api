import mongoose from 'mongoose';

export const USER_TYPE = {
  ADMIN: 'admin',
  AUTHOR: 'author',
};

export const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: USER_TYPE.AUTHOR,
  },
});

export default mongoose.model('User', UserSchema);
