const config = {
	preset: 'ts-jest',
	rootDir: '..',
	testEnvironment: 'node',
	setupFilesAfterEnv: ['./test/jest.setup.ts']
}

export default config