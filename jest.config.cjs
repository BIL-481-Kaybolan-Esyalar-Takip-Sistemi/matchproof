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
      setupFilesAfterEnv: ['@testing-library/jest-dom', '<rootDir>/tests/setup-env.js'],
      moduleNameMapper: {
        '\\.(css|less|scss|sass)$': '<rootDir>/tests/__mocks__/styleMock.js',
      },
      transform: {
        '^.+\\.jsx?$': 'babel-jest',
      },
    },
  ],
};
