const { build } = require('esbuild')
const path = require('node:path');

/**
 * Configuration for ESBuild bundling
 * ----------------------------------
 * (!) ESBuild detects automatically we are using TS,
 *     so there is no specifial configuration required
 */
const CONFIG = {
	bundle: true,
	// Path to application.js folder
	absWorkingDir: path.join(process.cwd(), 'src'),
	// Application.js file, used by Rails to bundle all JS Rails code
	entryPoints: ['index.ts'],
	// Path to tsconfig.json file
	tsconfig: path.join(process.cwd(), 'config/tsconfig.json'),
	// Remove unused JS methods
	treeShaking: true,
	// Adds mapping information so web browser console can map bundle errors to the corresponding
	// code line and column in the real code
	// More information: https://esbuild.github.io/api/#sourcemap
	sourcemap: process.argv.includes('--development'),
	// Compresses bundle
	// More information: https://esbuild.github.io/api/#minify
	minify: true,
	// Removes all console lines from bundle
	// More information: https://esbuild.github.io/api/#drop
	drop: process.argv.includes('--production') ? ['console'] : [],
	// Build command log output: https://esbuild.github.io/api/#log-level
	logLevel: 'info'
}

// Build CJS
build({
	...CONFIG,
	outfile: path.join(process.cwd(), '/dist/index.js'),
	platform: 'node'
})

// Build ESM
build({
	...CONFIG,
	format: 'esm',
	outfile: path.join(process.cwd(), '/dist/index.esm.js'),
	platform: 'neutral'
})
