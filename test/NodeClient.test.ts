/**
 * @jest-environment node
 */
// @ts-nocheck
import * as https from 'https'
import { NodeClient } from '../src/NodeClient'
import { setupHttpRecording } from './helpers/pollyHelpers'
import { assertRequestPayload, mockHttpsRequest, restoreHttpsRequest } from './helpers/httpsHelpers'

describe('NodeClient', () => {
  // Enables Polly.js to record and replay HTTP requests for each test
  setupHttpRecording()

  describe ('.get', () => {
    it ('performs GET request', async () => {
      const response = await NodeClient.get('jsonplaceholder.typicode.com', '/todos/1')

      expect(response.ok).toBeTruthy()
    })

    it ('performs request with given request payload', () => {
      const options = {
        hostname: 'jsonplaceholder.typicode.com',
        path: 'todos/1',
        method: 'GET',
        headers: { Authorization: 'Bearer token' }
      }

      const mock = mockHttpsRequest(options.hostname, options.path, options.method, options.headers)

      NodeClient.get(options.hostname, options.path, options.headers)

      assertRequestPayload(mock)

      restoreHttpsRequest()
    })
  })

  describe ('.post', () => {
    it ('performs POST request', async () => {
      const body = {
        title: 'foo',
        body: 'bar',
        userId: 1,
      }

      const response = await NodeClient.post(
        'jsonplaceholder.typicode.com',
        '/posts',
        {},
        body
      )

      expect(response.status).toBe(201)
    })

    it ('performs request with given request payload', () => {
      const body = {
        title: 'foo',
        body: 'bar',
        userId: 1,
      }

      const options = {
        hostname: 'jsonplaceholder.typicode.com',
        path: 'posts',
        method: 'POST',
        headers: { Authorization: 'Bearer token' }
      }

      const mock = mockHttpsRequest(options.hostname, options.path, options.method, options.headers)

      NodeClient.post(options.hostname, options.path, options.headers)

      assertRequestPayload(mock)

      restoreHttpsRequest()
    })
  })

  describe ('.patch', () => {
    it ('performs PATCH request', async () => {
      const body = { title: 'foo' }

      const response = await NodeClient.patch(
        'jsonplaceholder.typicode.com',
        '/posts/1',
        {},
        body
      )

      expect(response.status).toBe(200)
    })

    it ('performs request with given request payload', () => {
      const body = { title: 'foo' }

      const options = {
        hostname: 'jsonplaceholder.typicode.com',
        path: 'posts/1',
        method: 'PATCH',
        headers: { Authorization: 'Bearer token' }
      }

      const mock = mockHttpsRequest(options.hostname, options.path, options.method, options.headers)

      NodeClient.patch(options.hostname, options.path, options.headers)

      assertRequestPayload(mock)

      restoreHttpsRequest()
    })
  })

  describe ('.put', () => {
    it ('performs PUT request', async () => {
      const body = {
        id: 1,
        title: 'foo',
        body: 'bar',
        userId: 1
      }

      const response = await NodeClient.put(
        'jsonplaceholder.typicode.com',
        '/posts/1',
        {},
        body
      )

      expect(response.status).toBe(200)
    })

    it ('performs request with given request payload', () => {
      const body = {
        id: 1,
        title: 'foo',
        body: 'bar',
        userId: 1
      }

      const options = {
        hostname: 'jsonplaceholder.typicode.com',
        path: 'posts/1',
        method: 'PUT',
        headers: { Authorization: 'Bearer token' }
      }

      const mock = mockHttpsRequest(options.hostname, options.path, options.method, options.headers)

      NodeClient.put(options.hostname, options.path, options.headers)

      assertRequestPayload(mock)

      restoreHttpsRequest()
    })
  })

  describe ('.delete', () => {
    it('performs DELETE request', async () => {
      const response = await NodeClient.delete(
        'jsonplaceholder.typicode.com',
        '/todos/1'
      )

      expect(response.ok).toBeTruthy()
    })

    it ('performs request with given request payload', () => {
      const options = {
        hostname: 'jsonplaceholder.typicode.com',
        path: 'todos/1',
        method: 'DELETE',
        headers: { Authorization: 'Bearer token' }
      }

      const mock = mockHttpsRequest(options.hostname, options.path, options.method, options.headers)

      NodeClient.delete(options.hostname, options.path, options.headers)

      assertRequestPayload(mock)

      restoreHttpsRequest()
    })
  })
})
