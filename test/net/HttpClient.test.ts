import { type BodyPayload } from '../../src/net/HttpClient/Body'
import { type HeadersPayload } from '../../src/net/HttpClient/Headers'
import HttpClient from '../../src/net/HttpClient'

/**
 * Test HTTP client used to test the behavior of HttpClient instances
 *
 * All HTTP interface methods returns a `Response` containing a stringified
 * JSON with the request parameters. This way we can easily test instance
 * methods are invoked with the right parameters.
 *
 * This test class also illustrates how an `HttpClient` subclass is defined.
 */
class TestHttpClient extends HttpClient {
  public static async get (
    host: string,
    path: string,
    headers: HeadersPayload = {}
  ): Promise<Response> {
    return await Promise.resolve(this.mockResponse('get', host, path, headers))
  }

  public static async post (
    host: string,
    path: string,
    headers: HeadersPayload = {},
    body: BodyPayload = {}
  ): Promise<Response> {
    return await Promise.resolve(this.mockResponse('post', host, path, headers, body))
  }

  public static async patch (
    host: string,
    path: string,
    headers: Record<string, string> = {},
    body: Record<string, string> = {}
  ): Promise<Response> {
    return await Promise.resolve(this.mockResponse('patch', host, path, headers, body))
  }

  public static async put (
    host: string,
    path: string,
    headers: HeadersPayload = {},
    body: BodyPayload = {}
  ): Promise<Response> {
    return await Promise.resolve(this.mockResponse('put', host, path, headers, body))
  }

  public static async delete (
    host: string,
    path: string,
    headers: HeadersPayload = {}
  ): Promise<Response> {
    return await Promise.resolve(this.mockResponse('delete', host, path, headers))
  }

  public static mockResponse (
    method: string,
    host: string,
    path: string,
    headers: HeadersPayload = {},
    body: BodyPayload = {}
  ): Response {
    return new Response(
      JSON.stringify({ method, host, path, headers, body }),
      { status: 200, statusText: 'OK' }
    )
  }
}

describe('HttpClient', () => {
  let [headers, host, httpClient] = [null, null, null]

  beforeEach(() => {
    headers = { Authorization: 'Bearer token' }
    host = 'https://jsonplaceholder.typicode.com'
    httpClient = new TestHttpClient(host as string, headers as HeadersPayload)
  })

  describe('.get', () => {
    it('performs GET request', async () => {
      const response = await httpClient.get('/todos/1')
      const responseJson = await response.json()

      expect(responseJson).toEqual({
        method: 'get',
        host,
        path: '/todos/1',
        headers,
        body: {}
      })
    })

    it('if headers are specified , performs GET request with specified headers', async () => {
      const otherHeaders = { Authorization: 'Bearer otherToken' }

      const response = await httpClient.get('/todos/1', otherHeaders)
      const responseJson = await response.json()

      expect(responseJson).toEqual({
        method: 'get',
        host,
        path: '/todos/1',
        headers: otherHeaders,
        body: {}
      })
    })
  })

  describe('.post', () => {
    it('performs POST request', async () => {
      const body = { title: 'foo', body: 'bar' }

      const response = await httpClient.post('/posts', body)
      const responseJson = await response.json()

      expect(responseJson).toEqual({
        method: 'post',
        host,
        path: '/posts',
        headers,
        body
      })
    })

    it('if headers are specified, performs POST request with specified headers', async () => {
      const otherHeaders = { Authorization: 'Bearer otherToken' }
      const body = { title: 'foo', body: 'bar' }

      const response = await httpClient.post('/posts', body, otherHeaders)
      const responseJson = await response.json()

      expect(responseJson).toEqual({
        method: 'post',
        host,
        path: '/posts',
        headers: otherHeaders,
        body
      })
    })
  })

  describe('.patch', () => {
    it('performs PATCH request', async () => {
      const body = { title: 'foo' }

      const response = await httpClient.patch('/posts/1', body)
      const responseJson = await response.json()

      expect(responseJson).toEqual({
        method: 'patch',
        host,
        path: '/posts/1',
        headers,
        body
      })
    })

    it('if headers are specified, performs PATCH request with specified host and headers', async () => {
      const otherHeaders = { Authorization: 'Bearer otherToken' }
      const body = { title: 'foo' }

      const response = await httpClient.patch('/posts', body, otherHeaders)
      const responseJson = await response.json()

      expect(responseJson).toEqual({
        method: 'patch',
        host,
        path: '/posts',
        headers: otherHeaders,
        body
      })
    })
  })

  describe('.put', () => {
    it('performs PUT request', async () => {
      const body = { title: 'foo', body: 'bar' }

      const response = await httpClient.put('/posts', body)
      const responseJson = await response.json()

      expect(responseJson).toEqual({
        method: 'put',
        host,
        path: '/posts',
        headers,
        body
      })
    })

    it('if headers are specified, performs PUT request with specified host and headers', async () => {
      const otherHeaders = { Authorization: 'Bearer otherToken' }
      const body = { title: 'foo', body: 'bar' }

      const response = await httpClient.put('/posts', body, otherHeaders)
      const responseJson = await response.json()

      expect(responseJson).toEqual({
        method: 'put',
        host,
        path: '/posts',
        headers: otherHeaders,
        body
      })
    })
  })

  describe('.delete', () => {
    it('performs DELETE request', async () => {
      const response = await httpClient.delete('/todos/1')
      const responseJson = await response.json()

      expect(responseJson).toEqual({
        method: 'delete',
        host,
        path: '/todos/1',
        headers,
        body: {}
      })
    })

    it('if headers are specified, performs DELETE request with specified host and headers', async () => {
      const otherHeaders = { Authorization: 'Bearer otherToken' }

      const response = await httpClient.delete('/todos/1', otherHeaders)
      const responseJson = await response.json()

      expect(responseJson).toEqual({
        method: 'delete',
        host,
        path: '/todos/1',
        headers: otherHeaders,
        body: {}
      })
    })
  })
})
