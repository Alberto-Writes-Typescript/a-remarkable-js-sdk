import type { Options } from 'tsup';

const env = process.env.NODE_ENV;

export const tsup: Options = {
  splitting: true,              // (only for ESM) Split bundle in chunks
  clean: true,                  // Clean dist folder before bundling
  dts: true,                    // Generate Typescript definition file
  format: ['cjs', 'esm'],       // Generate CJS and ESM bundles
  minify: env === 'production',
  bundle: env === 'production',
  skipNodeModulesBundle: true,  // Avoid bundling npm dependencies in resulting bundle
  watch: env === 'development', // (only in development) Enable file watch
  target: 'es2020',
  outDir: env === 'production' ? 'dist' : 'lib',
  entry: ['./src/index.ts']
}
