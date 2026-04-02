const dotenv = require('dotenv');

dotenv.config();

const resolvedDatabaseUrl =
  (process.env.NODE_ENV === 'test' && process.env.DATABASE_URL_TEST) ||
  process.env.DATABASE_URL;

const requiredVariables = ['SESSION_SECRET'];

if (!resolvedDatabaseUrl) {
  throw new Error('Missing required environment variable: DATABASE_URL or DATABASE_URL_TEST');
}

for (const variableName of requiredVariables) {
  if (!process.env[variableName]) {
    throw new Error(`Missing required environment variable: ${variableName}`);
  }
}

const env = {
  port: Number(process.env.PORT || 3001),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: resolvedDatabaseUrl,
  databaseUrlTest: process.env.DATABASE_URL_TEST || null,
  sessionSecret: process.env.SESSION_SECRET,
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  e2eBaseUrl: process.env.E2E_BASE_URL || 'http://127.0.0.1:3000',
  matchingMode: process.env.MATCHING_MODE || 'live',
  clientOrigins: (process.env.CLIENT_ORIGIN || 'http://localhost:3000')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean),
};

module.exports = { env };

