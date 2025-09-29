/** @type {import('jest').Config} */
const config = {
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  bail: true,
  testMatch: "<rootDir>/src/**/*.test.ts",
};

export default config;
