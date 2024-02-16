// @ts-nocheck

import { FetchClient } from '../../src/net/FetchClient'

describe('FetchClient', () => {
  const SAMPLE_HOST = 'https://jsonplaceholder.typicode.com'
  const SAMPLE_PATH = '/todos/1'

  let fetchClient: FetchClient

  beforeAll(() => {
    fetchClient = new FetchClient()
  })

  describe('#makeRequest', () => {
    it('returns Response object', async () => {
      const response = await fetchClient.makeRequest(SAMPLE_HOST, SAMPLE_PATH, 'GET')
      expect(response).toBeInstanceOf(Response)
    })

    it('performs request to given URL', async () => {
      const response = await fetchClient.makeRequest(SAMPLE_HOST, SAMPLE_PATH, 'GET')
      expect(response.url).toBe(SAMPLE_HOST + SAMPLE_PATH)
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
