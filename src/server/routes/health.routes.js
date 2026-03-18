const express = require('express');

const { healthCheck } = require('../services/db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    await healthCheck();

    res.status(200).json({
      status: 'ok',
      service: 'matchproof-backend',
      database: 'up',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'degraded',
      service: 'matchproof-backend',
      database: 'down',
      timestamp: new Date().toISOString(),
    });
  }
});

module.exports = router;

