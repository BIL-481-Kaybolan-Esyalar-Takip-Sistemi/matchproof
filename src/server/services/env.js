const dotenv = require('dotenv');

dotenv.config();

const requiredVariables = ['DATABASE_URL', 'SESSION_SECRET'];

for (const variableName of requiredVariables) {
  if (!process.env[variableName]) {
    throw new Error(`Missing required environment variable: ${variableName}`);
  }
}

const env = {
  port: Number(process.env.PORT || 3001),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  sessionSecret: process.env.SESSION_SECRET,
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  clientOrigins: (process.env.CLIENT_ORIGIN || 'http://localhost:3000')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean),
};

module.exports = { env };

