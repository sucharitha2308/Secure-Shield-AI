const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  scan: {
    type: mongoose.Schema.ObjectId,
    ref: 'Scan',
    required: true
  },
  executiveSummary: {
    type: String,
    required: true
  },
  detectedRisks: [
    {
      title: String,
      severity: String,
      description: String,
      owaspMapping: String,
      remediation: String
    }
  ],
  pdfUrl: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Report', ReportSchema);
