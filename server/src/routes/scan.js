const express = require('express');
const { createScan, getScans, deleteScan } = require('../controllers/scanController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/scan')
  .post(protect, createScan);

router.route('/scans')
  .get(protect, getScans);

router.route('/scan/:id')
  .delete(protect, deleteScan);

module.exports = router;
