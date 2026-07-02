const mongoose = require('mongoose');

const ScanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  url: {
    type: String,
    required: [true, 'Please add a URL to scan']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  score: {
    type: Number,
    default: 0
  },
  results: {
    headers: {
      score: Number,
      details: Array
    },
    cookies: {
      score: Number,
      details: Array
    },
    ssl: {
      score: Number,
      issuer: String,
      validFrom: Date,
      validTo: Date,
      protocol: String,
      details: Array
    },
    technologies: {
      detected: Array
    },
    performance: {
      responseTime: Number,
      statusCode: Number
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Scan', ScanSchema);
