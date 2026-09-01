const express = require('express');
const router = express.Router();

// @route   GET /api/health
// @desc    Health check
// @access  Public
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AquaLink API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;
