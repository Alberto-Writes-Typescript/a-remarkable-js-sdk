// @ts-nocheck
import 'whatwg-fetch'
import { Polly } from '@pollyjs/core'
import * as FSPersister from '@pollyjs/persister-fs'
import * as FetchAdapter from '@pollyjs/adapter-fetch'
import { FetchClient } from '../../src/net/FetchClient'

Polly.register(FetchAdapter)
Polly.register(FSPersister)

describe('FetchClient', () => {
  const SAMPLE_HOST: string = 'https://jsonplaceholder.typicode.com'
  const SAMPLE_PATH: string = '/todos/1'

  let fetchClient = new FetchClient()
  let polly: Polly

  describe('#makeRequest', () => {
    it('returns Response object', async () => {
      let polly = new Polly('#makeRequest', {
        adapters: ['fetch'],
        persister: 'fs',
        persisterOptions: { fs: { recordingsDir: '__recordings__' } }
      })

      const response = await fetchClient.makeRequest(SAMPLE_HOST, SAMPLE_PATH, 'GET')
      expect(response).toBeInstanceOf(Response)

      await polly.stop()
    })

    it('performs request to given URL', async () => {
      let polly = new Polly('#makeRequest', {
        adapters: ['fetch'],
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
