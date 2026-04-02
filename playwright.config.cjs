const { defineConfig } = require('@playwright/test');

const isWindows = process.platform === 'win32';
const wrapCommand = (command) => (isWindows ? `cmd.exe /c ${command}` : command);

const baseURL = process.env.E2E_BASE_URL || 'http://127.0.0.1:3000';

module.exports = defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  use: {
    baseURL,
    headless: true,
    trace: 'retain-on-failure',
  },
  webServer: [
    {
      command: wrapCommand('node scripts/e2e/start-backend.js'),
      url: 'http://127.0.0.1:3001/api/health',
      reuseExistingServer: false,
      timeout: 120000,
      env: {
        ...process.env,
        NODE_ENV: 'test',
        PORT: '3001',
        DATABASE_URL_TEST: process.env.DATABASE_URL_TEST || 'pg-mem://matchproof_e2e',
        SESSION_SECRET: process.env.SESSION_SECRET || 'matchproof-e2e-secret',
        CLIENT_ORIGIN: 'http://127.0.0.1:3000,http://localhost:3000',
        MATCHING_MODE: 'stub',
      },
    },
    {
      command: wrapCommand('npm run dev:client -- --host 127.0.0.1'),
      url: baseURL,
      reuseExistingServer: false,
      timeout: 120000,
    },
  ],
});
