import fetchMock from 'jest-fetch-mock'
import FetchClient from '../../src/net/FetchClient'
import { setupHttpRecording } from '../helpers/pollyHelpers'

describe('FetchClient', () => {
  setupHttpRecording()

  describe('#get', () => {
    it('performs GET request', async () => {
      const response = await FetchClient.get('https://jsonplaceholder.typicode.com', '/todos/1')

      expect(response.ok).toBeTruthy()
    })

    it('performs request with given request payload', async () => {
      const host: string = 'https://jsonplaceholder.typicode.com'
      const path: string = '/todos/1'
      const method: string = 'GET'
      const headers = { Authorization: 'Bearer token' }

      fetchMock.doMock()

      fetchMock.mockResponseOnce(JSON.stringify({ data: 'mock data' }))

      await FetchClient.get(host, path, headers)

      const [requestHref, requestPayload] = fetchMock.mock.calls[fetchMock.mock.calls.length - 1]
      expect(requestHref).toBe(`${host}${path}`)
      expect(requestPayload.headers).toEqual(headers)
      expect(requestPayload.method).toEqual(method)

      fetchMock.dontMock()
    })
  })

  describe('#post', () => {
    it('performs POST request', async () => {
      const body: Record<string, string | number> = { title: 'foo', body: 'bar', userId: 1 }

      const response = await FetchClient.post('https://jsonplaceholder.typicode.com', '/posts', {}, body)

      expect(response.status).toBe(201)
    })

    it('performs request with given request payload', async () => {
      const host: string = 'https://jsonplaceholder.typicode.com'
      const path: string = '/posts'
      const method: string = 'POST'
      const headers = { Authorization: 'Bearer token' }
      const body = { title: 'foo', body: 'bar', userId: 1 }

      fetchMock.doMock()

      fetchMock.mockResponseOnce(JSON.stringify({ data: 'mock data' }))

      const response = await FetchClient.post(host, path, headers, body)
      const responseData = await response.json()

      const [requestHref, requestPayload] = fetchMock.mock.calls[fetchMock.mock.calls.length - 1]
      expect(requestHref).toBe(`${host}${path}`)
      expect(requestPayload.headers).toEqual(headers)
      expect(requestPayload.method).toEqual(method)
      expect(requestPayload.body).toEqual(JSON.stringify(body))
      expect(responseData).toEqual({ data: 'mock data' })

      fetchMock.dontMock()
    })
  })

  describe('#patch', () => {
    it('performs PATCH request', async () => {
      const body = { title: 'foo' }

      const response = await FetchClient.patch('https://jsonplaceholder.typicode.com', '/posts/1', {}, body)

      expect(response.status).toBe(200)
    })

    it('performs request with given request payload', async () => {
      const host: string = 'https://jsonplaceholder.typicode.com'
      const path: string = '/posts/1'
      const method: string = 'PATCH'
      const headers = { Authorization: 'Bearer token' }
      const body = { title: 'foo' }

      fetchMock.doMock()

      fetchMock.mockResponseOnce(JSON.stringify({ data: 'mock data' }))

      const response = await FetchClient.patch(host, path, headers, body)
      const responseData = await response.json()

      const [requestHref, requestPayload] = fetchMock.mock.calls[fetchMock.mock.calls.length - 1]
      expect(requestHref).toBe(`${host}${path}`)
      expect(requestPayload.headers).toEqual(headers)
      expect(requestPayload.method).toEqual(method)
      expect(requestPayload.body).toEqual(JSON.stringify(body))
      expect(responseData).toEqual({ data: 'mock data' })

      fetchMock.dontMock()
    })
  })

  describe('#put', () => {
    it('performs PUT request', async () => {
      const body = { id: 1, title: 'foo', body: 'bar', userId: 1 }

      const response = await FetchClient.put('https://jsonplaceholder.typicode.com', '/posts/1', {}, body)

      expect(response.status).toBe(200)
    })

    it('performs request with given request payload', async () => {
      const host: string = 'https://jsonplaceholder.typicode.com'
      const path: string = '/posts/1'
      const method: string = 'PUT'
      const headers = { Authorization: 'Bearer token' }
      const body = { title: 'foo' }

      fetchMock.doMock()

      fetchMock.mockResponseOnce(JSON.stringify({ data: 'mock data' }))

      const response = await FetchClient.put(host, path, headers, body)
      const responseData = await response.json()

      const [requestHref, requestPayload] = fetchMock.mock.calls[fetchMock.mock.calls.length - 1]
      expect(requestHref).toBe(`${host}${path}`)
      expect(requestPayload.headers).toEqual(headers)
      expect(requestPayload.method).toEqual(method)
      expect(requestPayload.body).toEqual(JSON.stringify(body))
      expect(responseData).toEqual({ data: 'mock data' })

      fetchMock.dontMock()
    })
  })

  describe('#delete', () => {
    it('performs DELETE request', async () => {
      const response = await FetchClient.delete('https://jsonplaceholder.typicode.com', '/todos/1')

      expect(response.ok).toBeTruthy()
    })

    it('performs request with given request payload', async () => {
      const host: string = 'https://jsonplaceholder.typicode.com'
      const path: string = '/todos/1'
      const method: string = 'DELETE'
      const headers = { Authorization: 'Bearer token' }

      fetchMock.doMock()

      fetchMock.mockResponseOnce(JSON.stringify({ data: 'mock data' }))

      await FetchClient.delete(host, path, headers)

      const [requestHref, requestPayload] = fetchMock.mock.calls[fetchMock.mock.calls.length - 1]
      expect(requestHref).toBe(`${host}${path}`)
      expect(requestPayload.headers).toEqual(headers)
      expect(requestPayload.method).toEqual(method)

      fetchMock.dontMock()
    })
  })
})
