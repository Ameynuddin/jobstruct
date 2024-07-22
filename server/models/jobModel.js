const { urlencoded } = require('body-parser');
const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Please provide company'],
    maxlength: 50,
  },
  position: {
    type: String,
    required: [true, 'Please provide position'],
    maxlength: 100,
  },
  status: {
    type: String,
    enum: ['Pending','Interview', 'Declined'],
    default: 'Pending',
  },
  jobType: {
    type: String,
    enum: ['Full Time', 'Part Time', 'Contract', 'Internship'],
    default: 'Full Time',
  },
  jobLocation: {
    type: String,
    default: 'my city',
    required: true,
  },
  jobAd: {
    type: String,
  },
  resume: {
    type: String, // This could be a URL or a file path stored in your server
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user'],
  },
},
  { timestamps: true }
);

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;