const express = require('express');
const { getReport, downloadReportPdf } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/report/:id')
  .get(protect, getReport);

router.route('/report/:id/pdf')
  .get(protect, downloadReportPdf);

module.exports = router;
