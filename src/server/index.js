const { app } = require('./app');
const { pool } = require('./services/db');
const { env } = require('./services/env');

const server = app.listen(env.port, () => {
  console.log(`MatchProof backend listening on port ${env.port}`);
});

async function shutdown(signal) {
  console.log(`Received ${signal}. Shutting down gracefully...`);

  server.close(async () => {
    try {
      await pool.end();
    } catch (error) {
      console.error('Error while closing database pool:', error);
    } finally {
      process.exit(0);
    }
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

