// @ts-nocheck

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

import { FetchClient } from '../../src/net/FetchClient'

Polly.register(NodeHttpAdapter)
Polly.register(FSPersister)

describe('FetchClient', () => {
  const SAMPLE_HOST: string = 'https://jsonplaceholder.typicode.com'
  const SAMPLE_PATH: string = '/todos/1'

  let fetchClient = new FetchClient()
  let polly: Polly

  describe('#makeRequest', () => {
    it('returns Response object', async () => {
      let polly = new Polly('#makeRequest', {
        adapters: ['node-http'],
        persister: 'fs',
        persisterOptions: { fs: { recordingsDir: '__recordings__' } },
      })

      const response = await fetchClient.makeRequest(SAMPLE_HOST, SAMPLE_PATH, 'GET')
      expect(response).toBeInstanceOf(Response)

      await polly.stop()
    })

    it('performs request to given URL', async () => {
      let polly = new Polly('#makeRequest', {
        adapters: ['node-http'],
        persister: 'fs',
        persisterOptions: { fs: { recordingsDir: '__recordings__' } }
      })

      const response = await fetchClient.makeRequest(SAMPLE_HOST, SAMPLE_PATH, 'GET')
      expect(response.url).toBe(SAMPLE_HOST + SAMPLE_PATH)

      await polly.stop()
    })

    it('performs request with given headers', async () => {
      const mockFetch = jest.fn().mockResolvedValue(new Response())
      globalThis.fetch = mockFetch

      const token = '123'
      await fetchClient.makeRequest(SAMPLE_HOST, SAMPLE_PATH, 'GET', { Authorization: token })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ headers: expect.objectContaining({ Authorization: token }) })
      )
    })

    it('performs request with given body', async () => {
      const mockFetch = jest.fn().mockResolvedValue(new Response())
      globalThis.fetch = mockFetch

      const body = 'body'
      await fetchClient.makeRequest(SAMPLE_HOST, SAMPLE_PATH, 'GET', {}, body)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ body })
      )
    })

    it('performs GET request', async () => {
      const response = await fetchClient.makeRequest(SAMPLE_HOST, SAMPLE_PATH, 'GET')
      expect(response).toBeInstanceOf(Response)
      expect(response.status).toBe(200)
    })
  })
})
