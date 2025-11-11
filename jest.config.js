module.exports = {
  testEnvironment: 'jsdom',

  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],

  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },

  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  testMatch: [
    '**/__tests__/**/*.(js|jsx)',
    '**/?(*.)+(spec|test).(js|jsx)',
  ],

  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
