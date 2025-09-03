import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
  name: { type: String, unique: true }
});

export default mongoose.model('Tag', tagSchema);