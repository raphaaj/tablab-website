import type { Config as JestConfig } from '@jest/types';
import nextJest from 'next/jest';

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
    '^@tests/(.*)$': '<rootDir>/tests/$1',
    '^@next-i18next\.config$': '<rootDir>/next-i18next.config',
  },
};

export default createJestConfig(customJestConfig);
