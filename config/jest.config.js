const path = require('path');

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	preset: 'ts-jest',
	rootDir: '..',
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['./test/jest.setup.ts']
}
