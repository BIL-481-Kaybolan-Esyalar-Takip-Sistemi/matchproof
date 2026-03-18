const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const multer = require('multer');

const { AppError } = require('./app-error');
const { env } = require('./env');

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const uploadRoot = path.resolve(process.cwd(), env.uploadDir);

fs.mkdirSync(uploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, uploadRoot);
  },
  filename(req, file, callback) {
    const extension = path.extname(file.originalname).toLowerCase() || '.jpg';
    const uniqueName = `${Date.now()}-${crypto.randomUUID()}${extension}`;

    callback(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter(req, file, callback) {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(
        new AppError('Only JPEG, PNG, or WEBP images are allowed.', {
          statusCode: 400,
          code: 'INVALID_FILE_TYPE',
        })
      );
      return;
    }

    callback(null, true);
  },
});

function toPublicImageUrl(filename) {
  return `/uploads/${filename}`;
}

async function deleteStoredImage(filename) {
  if (!filename) {
    return;
  }

  const filePath = path.join(uploadRoot, filename);

  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

async function deleteUploadedFile(filename) {
  await deleteStoredImage(filename);
}

module.exports = {
  deleteStoredImage,
  deleteUploadedFile,
  singleImageUpload: upload.single('image'),
  toPublicImageUrl,
  uploadRoot,
};

