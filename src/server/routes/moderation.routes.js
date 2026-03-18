const express = require('express');

const { removeItemPost } = require('../services/moderation.service');
const { requireAdmin } = require('../services/require-admin');

const router = express.Router();

router.use(requireAdmin);

router.post('/items/:itemId/remove', async (req, res, next) => {
  try {
    const result = await removeItemPost({
      itemId: req.params.itemId,
      adminUserId: req.session.userId,
      reason: req.body.reason,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
