/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  transform: {},
  transformIgnorePatterns: [],
  extensionsToTreatAsEsm: ['.ts']
};