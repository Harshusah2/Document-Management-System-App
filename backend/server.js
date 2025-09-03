import express from 'express';
import cors from 'cors';
import pkg from 'body-parser';
const { json } = pkg;
import { randomBytes } from 'crypto';
import { connect } from 'mongoose';
import User from './models/User.js';
import multer from 'multer';
import path from 'path';
import Document from './models/Document.js';
import Tag from './models/Tag.js';


// File upload setup (uploads to /uploads folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Accept images and pdf only
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype === 'application/pdf'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only image and PDF files are allowed!'), false);
    }
  }
});

// Make sure uploads folder exists
import fs from 'fs';
if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');


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


// Document Upload Endpoint
app.post('/api/documentManagement/saveDocumentEntry', upload.single('file'), async (req, res) => {
  try {
    const { date, major_head, minor_head, tags, remarks, uploadedBy } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ status: false, data: 'File is required.' });

    // Save tags if new
    let tagList = [];
    if (tags) {
      const tagArr = Array.isArray(tags) ? tags : tags.split(',');
      for (let tag of tagArr) {
        tag = tag.trim();
        if (tag) {
          await Tag.updateOne({ name: tag }, { name: tag }, { upsert: true });
          tagList.push(tag);
        }
      }
    }

    const doc = await Document.create({
      fileUrl: file.path,
      fileType: file.mimetype,
      date,
      major_head,
      minor_head,
      tags: tagList,
      remarks,
      uploadedBy,
    });
    res.json({ status: true, data: doc });
  } catch (err) {
    res.status(500).json({ status: false, data: err.message });
  }
});

// Fetch Tags Endpoint
app.get('/api/documentManagement/fetchdocumentTags', async (req, res) => {
  const tags = await Tag.find({});
  res.json({ tags: tags.map(t => t.name) });
});

// Add Tag Endpoint
app.post('/api/documentManagement/adddocumentTags', async (req, res) => {
  const { tag } = req.body;
  if (!tag) return res.status(400).json({ status: false, data: 'Tag required.' });
  await Tag.updateOne({ name: tag }, { name: tag }, { upsert: true });
  res.json({ status: true });
});

// Fetch Documents Endpoint
app.get('/api/documentManagement/documents', async (req, res) => {
  const docs = await Document.find({});
  res.json({ status: true, data: docs });
});


app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});