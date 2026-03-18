const express = require('express');

const {
  createItem,
  deleteItem,
  getItemById,
  searchItems,
  updateItemStatus,
  updateItem,
} = require('../services/items.service');
const { requireAuth } = require('../services/require-auth');
const {
  deleteUploadedFile,
  singleImageUpload,
} = require('../services/upload.service');

const router = express.Router();

router.use(requireAuth);

async function cleanupUploadedFile(file) {
  if (!file) {
    return;
  }

  try {
    await deleteUploadedFile(file.filename);
  } catch (cleanupError) {
    console.error('Failed to clean up uploaded file:', cleanupError);
  }
}

router.post('/', singleImageUpload, async (req, res, next) => {
  try {
    const item = await createItem({
      userId: req.session.userId,
      payload: req.body,
      file: req.file,
    });

    res.status(201).json({ item });
  } catch (error) {
    await cleanupUploadedFile(req.file);

    next(error);
  }
});

router.get('/search', async (req, res, next) => {
  try {
    const result = await searchItems(req.query);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:itemId', async (req, res, next) => {
  try {
    const item = await getItemById(req.params.itemId);

    res.status(200).json({ item });
  } catch (error) {
    next(error);
  }
});

router.patch('/:itemId/status', async (req, res, next) => {
  try {
    const item = await updateItemStatus({
      itemId: req.params.itemId,
      userId: req.session.userId,
      status: req.body.status,
    });

    res.status(200).json({ item });
  } catch (error) {
    next(error);
  }
});

router.patch('/:itemId', singleImageUpload, async (req, res, next) => {
  try {
    const item = await updateItem({
      itemId: req.params.itemId,
      userId: req.session.userId,
      payload: req.body,
      file: req.file,
    });

    res.status(200).json({ item });
  } catch (error) {
    await cleanupUploadedFile(req.file);

    next(error);
  }
});

router.delete('/:itemId', async (req, res, next) => {
  try {
    await deleteItem({
      itemId: req.params.itemId,
      userId: req.session.userId,
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
