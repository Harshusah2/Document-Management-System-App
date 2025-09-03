import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  mobile_number: { type: String, unique: true, required: true },
  otp: String,
  token: String,
});

export default model('User', userSchema);