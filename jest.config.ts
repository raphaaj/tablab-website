import nextJest from 'next/jest';
import type { Config as JestConfig } from '@jest/types';

const createJestConfig = nextJest({ dir: './' });

const customJestConfig: JestConfig.InitialOptions = {
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/@types/**'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@client/(.*)$': '<rootDir>/src/client/$1',
    '^@common/(.*)$': '<rootDir>/src/common/$1',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@server/(.*)$': '<rootDir>/src/server/$1',
    '^@test-mocks/(.*)$': '<rootDir>/tests/.mocks/$1',
    '^@test-utils/(.*)$': '<rootDir>/tests/.utils/$1',
    '^next-i18next.config$': '<rootDir>/next-i18next.config',
  },
};

export default createJestConfig(customJestConfig);
