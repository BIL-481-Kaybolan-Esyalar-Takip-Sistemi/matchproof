const express = require('express');

const authRoutes = require('./auth.routes');
const healthRoutes = require('./health.routes');
const itemRoutes = require('./items.routes');
const moderationRoutes = require('./moderation.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/health', healthRoutes);
router.use('/items', itemRoutes);
router.use('/moderation', moderationRoutes);

module.exports = router;

