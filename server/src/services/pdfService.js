const PDFDocument = require('pdfkit');

exports.generatePdfBuffer = (report, scan) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      let buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // Title
      doc.fontSize(20).text('SecureShield AI Security Report', { align: 'center' });
      doc.moveDown();

      // Scan Info
      doc.fontSize(14).text(`Target URL: ${scan.url}`);
      doc.text(`Security Score: ${scan.score}/100`);
      doc.text(`Date: ${new Date(scan.createdAt).toLocaleString()}`);
      doc.moveDown();

      // Executive Summary
      doc.fontSize(16).text('Executive Summary', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(12).text(report.executiveSummary);
      doc.moveDown();

      // Risks
      doc.fontSize(16).text('Detected Risks', { underline: true });
      doc.moveDown(0.5);

      if (report.detectedRisks && report.detectedRisks.length > 0) {
        report.detectedRisks.forEach((risk, i) => {
          doc.fontSize(14).text(`${i + 1}. ${risk.title}`);
          doc.fontSize(12).text(`Severity: ${risk.severity}`, { continued: true }).text(' | ', { continued: true }).text(`OWASP: ${risk.owaspMapping}`);
          doc.text(`Description: ${risk.description}`);
          doc.text(`Remediation: ${risk.remediation}`);
          doc.moveDown();
        });
      } else {
        doc.fontSize(12).text('No critical risks detected by AI.');
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
