import * as dotenv from 'dotenv'

/**
 * Due to Polly.js deprecations, we use NodeHTTPAdapter instead of FetchAdapter.
 * When @pollyjs/adapter-fetch is running in a Node.js environment, it uses a polyfill
 * for fetch, which is not as reliable or feature-complete as the native fetch API in
 * the browser. That's why the package maintainers have deprecated its use in Node.js
 * and recommend using the @pollyjs/adapter-node-http package instead.
 */
import { Polly } from '@pollyjs/core'
import * as FSPersister from '@pollyjs/persister-fs'
import * as NodeHttpAdapter from '@pollyjs/adapter-node-http'

/**
 * DotEnv Configuration
 * --------------------
 */

/**
 * Load environment variables from .env.test file
 */
dotenv.config({ path: '.env.test' })

/**
 * Polly.js Configuration
 * ----------------------
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
Polly.register(NodeHttpAdapter)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error es
Polly.register(FSPersister)
