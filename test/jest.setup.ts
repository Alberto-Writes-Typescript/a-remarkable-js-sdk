/**
 * Polly.js Configuration
 * ----------------------
 */

/**
 * JSDom Jest Environment does not support fetch API. This is a workaround to make it work in our tests.
 * More information: https://github.com/jsdom/jsdom/issues/1724
 */
import 'whatwg-fetch'

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

// @ts-ignore
Polly.register(NodeHttpAdapter)
// @ts-ignore
Polly.register(FSPersister)

