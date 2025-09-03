import express from 'express';
import cors from 'cors';
import pkg from 'body-parser';
const { json } = pkg;
import { randomBytes } from 'crypto';
import { connect } from 'mongoose';
import User from './models/User.js';
const app = express();
const PORT = 3001;

// Connect to MongoDB
// connect('mongodb://localhost:27017/dmsapp', { useNewUrlParser: true, useUnifiedTopology: true });
connect('mongodb+srv://hs1306007_db_user:harsh1804@cluster0.8voprqc.mongodb.net/DMSApp');

app.use(json());
app.use(cors());

// Register Mobile
app.post('/api/documentManagement/registerMobile', async (req, res) => {
  const { mobile_number } = req.body;
  if (!mobile_number) return res.status(400).json({ status: false, data: 'Mobile number required.' });
  const exists = await User.findOne({ mobile_number });
  if (exists) return res.json({ status: false, data: 'Mobile already registered.' });
  await User.create({ mobile_number });
  res.json({ status: true, data: 'Mobile registered.' });
});

// Generate OTP
app.post('/api/documentManagement/generateOTP', async (req, res) => {
  const { mobile_number } = req.body;
  const user = await User.findOne({ mobile_number });
  if (!user) return res.json({ status: false, data: 'This Mobile Number is not yet Registered.' });
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  await user.save();
  // Simulate sending OTP (log to console)
  console.log(`OTP for ${mobile_number}: ${otp}`);
  res.json({ status: true, data: 'OTP sent.' });
});

// Validate OTP
app.post('/api/documentManagement/validateOTP', async (req, res) => {
  const { mobile_number, otp } = req.body;
  const user = await User.findOne({ mobile_number });
  if (!user) return res.json({ status: false, data: 'Mobile not registered.' });
  if (user.otp !== otp) return res.json({ status: false, data: 'Invalid OTP.' });
  const token = randomBytes(16).toString('hex');
  user.token = token;
  await user.save();
  res.json({ status: true, token });
});

// Logout
app.post('/api/documentManagement/logout', async (req, res) => {
  const { mobile_number } = req.body;
  const user = await User.findOne({ mobile_number });
  if (!user) return res.json({ status: false, data: 'Mobile not registered.' });
  user.token = null;
  await user.save();
  res.json({ status: true, data: 'Logged out successfully.' });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});