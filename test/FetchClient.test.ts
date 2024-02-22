// @ts-nocheck
import { FetchClient } from '../src/FetchClient'
import { setupHttpRecording } from './helpers/pollyHelpers'

describe('FetchClient', () => {
  // Enables Polly.js to record and replay HTTP requests for each test
  setupHttpRecording()

  let fetchClient = new FetchClient()

  describe('#makeRequest', () => {
    it('performs GET request', async () => {
      const response = await fetchClient.makeRequest(
        'https://jsonplaceholder.typicode.com',
        '/todos/1',
        'GET'
      )

      expect(response.status).toBe(200)
    })

    it('returns Response object', async () => {
      const response = await fetchClient.makeRequest(
        'https://jsonplaceholder.typicode.com',
        '/todos/1',
        'GET'
      )

      expect(response).toBeInstanceOf(Response)
    })

    it('performs request to given URL', async () => {
      const response = await fetchClient.makeRequest(
        'https://jsonplaceholder.typicode.com',
        '/todos/1',
        'GET'
      )

      expect(response.url).toBe('https://jsonplaceholder.typicode.com/todos/1')
    })

    it('performs request with given headers', async () => {
      const mockFetch = jest.fn().mockResolvedValue(new Response())
      jest.spyOn(globalThis, 'fetch').mockImplementation(mockFetch)

      const token = '123'
      await fetchClient.makeRequest(
        'https://jsonplaceholder.typicode.com',
        '/todos/1',
        'GET',
        { Authorization: token }
      )

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ headers: expect.objectContaining({ Authorization: token }) })
      )

      globalThis.fetch.mockRestore()
    })

    it('performs request with given body', async () => {
      const mockFetch = jest.fn().mockResolvedValue(new Response())
      jest.spyOn(globalThis, 'fetch').mockImplementation(mockFetch)

      const body = 'body'
      await fetchClient.makeRequest(
        'https://jsonplaceholder.typicode.com',
        '/todos/1',
        'GET',
        {},
        body
      )

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ body })
      )

      globalThis.fetch.mockRestore()
    })
  })
})
