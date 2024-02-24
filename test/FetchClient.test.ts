// @ts-nocheck
import { FetchClient } from '../src/FetchClient'
import { setupHttpRecording } from './helpers/pollyHelpers'
import { assertRequestPayload, mockFetch, restoreFetch } from './helpers/fetchHelpers'

describe('FetchClient', () => {
  // Enables Polly.js to record and replay HTTP requests for each test
  setupHttpRecording()

  describe ('.get', () => {
    it ('performs GET request', async () => {
      const response = await FetchClient.get(
        'https://jsonplaceholder.typicode.com',
        '/todos/1'
      )

      expect(response.ok).toBeTruthy()
    })

    it ('performs request with given request payload', () => {
      const mock = mockFetch()

      const method:string = 'GET'
      const host: string = 'https://jsonplaceholder.typicode.com'
      const path: string = 'todos/1'
      const headers = { Authorization: 'Bearer token' }

      FetchClient.get('https://jsonplaceholder.typicode.com', '/todos/1', headers)

      assertRequestPayload(mock, host, path, method, headers)

      restoreFetch()
    })
  })

  describe ('.post', () => {
    it ('performs POST request', async () => {
      const body = {
        title: 'foo',
        body: 'bar',
        userId: 1,
      }

      const response = await FetchClient.post(
        'https://jsonplaceholder.typicode.com',
        '/posts',
        {},
        body
      )

      expect(response.status).toBe(201)
    })

    it ('performs request with given request payload', () => {
      const mock = mockFetch()

      const method:string = 'POST'
      const host: string = 'https://jsonplaceholder.typicode.com'
      const path: string = '/posts'
      const headers = { Authorization: 'Bearer token' }
      const body: Object = {
        title: 'foo',
        body: 'bar',
        userId: 1,
      }

      FetchClient.post(
        'https://jsonplaceholder.typicode.com',
        'posts',
        headers,
        body
      )

      assertRequestPayload(mock, host, path, method, headers, body)

      restoreFetch()
    })
  })

  describe ('.patch', () => {
    it ('performs PATCH request', async () => {
      const body = { title: 'foo' }

      const response = await FetchClient.patch(
        'https://jsonplaceholder.typicode.com',
        '/posts/1',
        {},
        body
      )

      expect(response.status).toBe(200)
    })

    it ('performs request with given request payload', () => {
      const mock = mockFetch()

      const method:string = 'PATCH'
      const host: string = 'https://jsonplaceholder.typicode.com'
      const path: string = '/posts/1'
      const headers = { Authorization: 'Bearer token' }
      const body = { title: 'foo' }

      FetchClient.patch(
        'https://jsonplaceholder.typicode.com',
        'posts/1',
        headers,
        body
      )

      assertRequestPayload(mock, host, path, method, headers, body)

      restoreFetch()
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

      const response = await FetchClient.put(
        'https://jsonplaceholder.typicode.com',
        '/posts/1',
        {},
        body
      )

      expect(response.status).toBe(200)
    })

    it ('performs request with given request payload', () => {
      const mock = mockFetch()

      const method:string = 'PUT'
      const host: string = 'https://jsonplaceholder.typicode.com'
      const path: string = '/posts/1'
      const headers = { Authorization: 'Bearer token' }
      const body = {
        id: 1,
        title: 'foo',
        body: 'bar',
        userId: 1
      }

      FetchClient.put(
        'https://jsonplaceholder.typicode.com',
        '/posts/1',
        headers,
        body
      )

      assertRequestPayload(mock, host, path, method, headers, body)

      restoreFetch()
    })
  })

  describe ('.delete', () => {
    it ('performs DELETE request', async () => {
      const response = await FetchClient.delete(
        'https://jsonplaceholder.typicode.com',
        '/todos/1'
      )

      expect(response.ok).toBeTruthy()
    })

    it ('performs request with given request payload', () => {
      const mock = mockFetch()

      const method:string = 'DELETE'
      const host: string = 'https://jsonplaceholder.typicode.com'
      const path: string = '/todos/1'
      const headers = { Authorization: 'Bearer token' }

      FetchClient.delete('https://jsonplaceholder.typicode.com', '/todos/1', headers)

      assertRequestPayload(mock, host, path, method, headers, null)

      restoreFetch()
    })
  })
})
