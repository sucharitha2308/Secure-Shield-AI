const Report = require('../models/Report');
const Scan = require('../models/Scan');
const { generatePdfBuffer } = require('../services/pdfService');

exports.getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate('scan');
    
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    if (report.scan.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.downloadReportPdf = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate('scan');

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    if (report.scan.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const pdfBuffer = await generatePdfBuffer(report, report.scan);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=SecureShield_Report_${report.scan.url.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
      'Content-Length': pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
