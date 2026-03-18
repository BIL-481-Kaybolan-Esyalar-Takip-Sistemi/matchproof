const path = require('path');
const express = require('express');
const cors = require('cors');

const apiRouter = require('./routes');
const { env } = require('./services/env');
const { requireAuth } = require('./services/require-auth');
const { createSessionMiddleware } = require('./services/session-store');
const { uploadRoot } = require('./services/upload.service');

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.clientOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Origin not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(createSessionMiddleware());
app.use('/uploads', requireAuth, express.static(path.resolve(uploadRoot)));

app.use('/api', apiRouter);

app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: 'Route not found.',
    },
  });
});

app.use((error, req, res, next) => {
  const statusCode =
    error.statusCode ||
    (error.code === 'LIMIT_FILE_SIZE'
      ? 400
      : error.message === 'Origin not allowed by CORS'
        ? 403
        : 500);

  const message =
    error.code === 'LIMIT_FILE_SIZE'
      ? 'Image size must be 5 MB or less.'
      : statusCode === 500
        ? 'Unexpected server error.'
        : error.message;

  if (statusCode === 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    error: {
      code: error.code || 'INTERNAL_SERVER_ERROR',
      message,
    },
  });
});

module.exports = { app };

