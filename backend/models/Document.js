import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  fileUrl: String,
  fileType: String,
  date: Date,
  major_head: String,
  minor_head: String,
  tags: [String],
  remarks: String,
  uploadedBy: String, // mobile_number or user id
});

export default mongoose.model('Document', documentSchema);