import * as dotenv from 'dotenv'

/**
 * Jest Fetch Mock
 *
 * Polyfill for `fetch` in Node.js test environment. Used to mock
 * `fetch` requests for an easier testing experience.
 */
import { enableFetchMocks } from 'jest-fetch-mock'

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

global.unitTestParams = JSON.parse(Buffer.from(process.env.UNIT_TEST_DATA, 'base64').toString('utf8'))

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

/**
 * Fetch Mock Configuration
 * ------------------------
 */
// `fetch` mock available globally
enableFetchMocks()
// `fetch` mock disabled by default
fetchMock.dontMock()
