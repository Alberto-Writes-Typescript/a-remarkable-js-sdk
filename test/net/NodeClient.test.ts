/**
 * @jest-environment node
 */
import NodeClient from '../../src/net/NodeClient'
import { setupHttpRecording } from '../helpers/pollyHelpers'
import { assertRequestPayload, mockHttpsRequest, restoreHttpsRequest } from '../helpers/httpsHelpers'

describe('NodeClient', () => {
  // Enables Polly.js to record and replay HTTP requests for each test
  setupHttpRecording()

  describe('.get', () => {
    it('performs GET request', async () => {
      const response = await NodeClient.get('https://jsonplaceholder.typicode.com', '/todos/1')

      expect(response.ok).toBeTruthy()
    })

    it('performs request with given request payload', async () => {
      const host: string = 'https://jsonplaceholder.typicode.com'
      const path: string = '/todos/1'
      const method: string = 'GET'
      const headers = { Authorization: 'Bearer token' }

      const mock: jest.Mock = mockHttpsRequest(host, path, method, headers)

      await NodeClient.get(host, path, headers)

      assertRequestPayload(mock)

      restoreHttpsRequest()
    })
  })

  describe('.post', () => {
    it('performs POST request', async () => {
      const body: Record<string, string | number> = { title: 'foo', body: 'bar', userId: 1 }

      const response = await NodeClient.post('https://jsonplaceholder.typicode.com', '/posts', {}, body)

      expect(response.status).toBe(201)
    })

    it('performs request with given request payload', async () => {
      const host: string = 'https://jsonplaceholder.typicode.com'
      const path: string = '/posts'
      const method: string = 'POST'
      const headers = { Authorization: 'Bearer token' }
      // const body: Object = { title: 'foo', body: 'bar', userId: 1 }

      const mock: jest.Mock = mockHttpsRequest(host, path, method, headers)

      await NodeClient.post(host, path, headers)

      assertRequestPayload(mock)

      restoreHttpsRequest()
    })
  })

  describe('.patch', () => {
    it('performs PATCH request', async () => {
      const body = { title: 'foo' }

      const response = await NodeClient.patch('https://jsonplaceholder.typicode.com', '/posts/1', {}, body)

      expect(response.status).toBe(200)
    })

    it('performs request with given request payload', async () => {
      const host: string = 'https://jsonplaceholder.typicode.com'
      const path: string = '/posts/1'
      const method: string = 'PATCH'
      const headers = { Authorization: 'Bearer token' }
      // const body = { title: 'foo' }

      const mock: jest.Mock = mockHttpsRequest(host, path, method, headers)

      await NodeClient.patch(host, path, headers)

      assertRequestPayload(mock)

      restoreHttpsRequest()
    })
  })

  describe('.put', () => {
    it('performs PUT request', async () => {
      const body = { id: 1, title: 'foo', body: 'bar', userId: 1 }

      const response = await NodeClient.put('https://jsonplaceholder.typicode.com', '/posts/1', {}, body)

      expect(response.status).toBe(200)
    })

    it('performs request with given request payload', async () => {
      const host: string = 'https://jsonplaceholder.typicode.com'
      const path: string = '/posts/1'
      const method: string = 'PUT'
      const headers = { Authorization: 'Bearer token' }
      // const body = { id: 1, title: 'foo', body: 'bar', userId: 1 }

      const mock: jest.Mock = mockHttpsRequest(host, path, method, headers)

      await NodeClient.put(host, path, headers)

      assertRequestPayload(mock)

      restoreHttpsRequest()
    })
  })

  describe('.delete', () => {
    it('performs DELETE request', async () => {
      const response = await NodeClient.delete('https://jsonplaceholder.typicode.com', '/todos/1')

      expect(response.ok).toBeTruthy()
    })

    it('performs request with given request payload', async () => {
      const host: string = 'https://jsonplaceholder.typicode.com'
      const path: string = '/todos/1'
      const method: string = 'DELETE'
      const headers = { Authorization: 'Bearer token' }

      const mock: jest.Mock = mockHttpsRequest(host, path, method, headers)

      await NodeClient.delete(host, path, headers)

      assertRequestPayload(mock)

      restoreHttpsRequest()
    })
  })
})
