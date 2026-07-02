const Scan = require('../models/Scan');
const Report = require('../models/Report');
const { scanUrl } = require('../scanner/scannerService');
const { generateReport } = require('../services/aiService');

exports.createScan = async (req, res) => {
  try {
    let { targetUrl } = req.body;

    if (!targetUrl.startsWith('http')) {
      targetUrl = 'https://' + targetUrl;
    }

    // Perform scan
    const scanResult = await scanUrl(targetUrl);

    // Save scan to DB
    const scan = await Scan.create({
      user: req.user.id,
      url: targetUrl,
      status: 'completed',
      score: scanResult.score,
      results: scanResult.results
    });

    // Generate AI Report
    const aiReportData = await generateReport(scanResult);

    // Save report to DB
    const report = await Report.create({
      scan: scan._id,
      executiveSummary: aiReportData.executiveSummary,
      detectedRisks: aiReportData.detectedRisks
    });

    res.status(201).json({
      success: true,
      data: {
        scan,
        reportId: report._id
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Scan failed', error: error.message });
  }
};

exports.getScans = async (req, res) => {
  try {
    const scans = await Scan.find({ user: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, count: scans.length, data: scans });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.deleteScan = async (req, res) => {
  try {
    const scan = await Scan.findById(req.params.id);
    if (!scan) {
      return res.status(404).json({ success: false, message: 'Scan not found' });
    }
    if (scan.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    
    await scan.deleteOne();
    await Report.deleteMany({ scan: req.params.id });

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
