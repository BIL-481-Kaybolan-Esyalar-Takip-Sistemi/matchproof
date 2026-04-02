const { ensureE2eEnvironment, resetAndSeedDatabase } = require('./reset-and-seed');

ensureE2eEnvironment();

const { startServer } = require('../../src/server/index');

resetAndSeedDatabase()
  .then(() => {
    startServer();
  })
  .catch((error) => {
    console.error('Failed to prepare E2E backend:', error);
    process.exit(1);
  });
