module.exports = {
  collectCoverageFrom: ['<rootDir>/src/**/*.{js,jsx}'],
  projects: [
    {
      displayName: 'backend',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/tests/server/**/*.test.js'],
      clearMocks: true,
      restoreMocks: true,
      setupFiles: ['<rootDir>/tests/setup-env.js'],
    },
    {
      displayName: 'frontend',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/tests/client/**/*.test.{js,jsx}'],
      clearMocks: true,
      setupFilesAfterEnv: ['@testing-library/jest-dom'],
      transform: {
        '^.+\\.jsx?$': 'babel-jest',
      },
    },
  ],
};
