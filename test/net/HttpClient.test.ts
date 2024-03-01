import HttpClient from '../../src/net/HttpClient'
import type HttpClientContext from '../../src/net/HttpClientContext'

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
    headers: Record<string, string> = {}
  ): Promise<Response> {
    return await Promise.resolve(this.mockResponse('get', host, path, headers))
  }

  public static async post (
    host: string,
    path: string,
    headers: Record<string, string> = {},
    body: Record<string, string> = {}
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
    headers: Record<string, string> = {},
    body: Record<string, string> = {}
  ): Promise<Response> {
    return await Promise.resolve(this.mockResponse('put', host, path, headers, body))
  }

  public static async delete (
    host: string,
    path: string,
    headers: Record<string, string> = {}
  ): Promise<Response> {
    return await Promise.resolve(this.mockResponse('delete', host, path, headers))
  }

  public static mockResponse (
    method: string,
    host: string,
    path: string,
    headers: Record<string, string> = {},
    body: Record<string, string> = {}
  ): Response {
    return new Response(
      JSON.stringify({ method, host, path, headers, body }),
      { status: 200, statusText: 'OK' }
    )
  }
}

describe('HttpClient', () => {
  const context: HttpClientContext = {
    host: 'https://jsonplaceholder.typicode.com',
    headers: { Authorization: 'Bearer token' }
  }

  const httpClient: TestHttpClient = new TestHttpClient(context.host, context.headers)

  describe('.get', () => {
    it(
      'if context is specified and no host & headers are specified,' +
            'performs GET request with context host and headers',
      async () => {
        const response = await httpClient.get('/todos/1')
        const responseJson = await response.json()

        expect(responseJson).toEqual({
          method: 'get',
          host: context.host,
          path: '/todos/1',
          headers: context.headers,
          body: {}
        })
      }
    )

    it(
      'if context is specified and host & headers are specified,' +
            'performs GET request with specified host and headers',
      async () => {
        const otherContext: HttpClientContext = {
          host: 'other',
          headers: { Authorization: 'Bearer otherToken' }
        }

        const response = await httpClient.get('/todos/1', otherContext)
        const responseJson = await response.json()

        expect(responseJson).toEqual({
          method: 'get',
          host: otherContext.host,
          path: '/todos/1',
          headers: otherContext.headers,
          body: {}
        })
      }
    )
  })

  describe('.post', () => {
    it(
      'if context is specified and no host & headers are specified,' +
            'performs POST request with context host and headers',
      async () => {
        const body = { title: 'foo', body: 'bar' }

        const response = await httpClient.post('/posts', body)
        const responseJson = await response.json()

        expect(responseJson).toEqual({
          method: 'post',
          host: context.host,
          path: '/posts',
          headers: context.headers,
          body
        })
      }
    )

    it(
      'if context is specified and host & headers are specified,' +
            'performs POST request with specified host and headers',
      async () => {
        const otherContext: HttpClientContext = {
          host: 'other',
          headers: { Authorization: 'Bearer otherToken' }
        }
        const body = { title: 'foo', body: 'bar' }

        const response = await httpClient.post('/posts', body, otherContext)
        const responseJson = await response.json()

        expect(responseJson).toEqual({
          method: 'post',
          host: otherContext.host,
          path: '/posts',
          headers: otherContext.headers,
          body
        })
      }
    )
  })

  describe('.patch', () => {
    it(
      'if context is specified and no host & headers are specified,' +
            'performs PATCH request with context host and headers',
      async () => {
        const body = { title: 'foo' }

        const response = await httpClient.patch('/posts/1', body)
        const responseJson = await response.json()

        expect(responseJson).toEqual({
          method: 'patch',
          host: context.host,
          path: '/posts/1',
          headers: context.headers,
          body
        })
      }
    )

    it(
      'if context is specified and host & headers are specified,' +
            'performs PATCH request with specified host and headers',
      async () => {
        const otherContext: HttpClientContext = {
          host: 'other',
          headers: { Authorization: 'Bearer otherToken' }
        }
        const body = { title: 'foo' }

        const response = await httpClient.patch('/posts', body, otherContext)
        const responseJson = await response.json()

        expect(responseJson).toEqual({
          method: 'patch',
          host: otherContext.host,
          path: '/posts',
          headers: otherContext.headers,
          body
        })
      }
    )
  })

  describe('.put', () => {
    it(
      'if context is specified and no host & headers are specified,' +
            'performs PUT request with context host and headers',
      async () => {
        const body = { title: 'foo', body: 'bar' }

        const response = await httpClient.put('/posts', body)
        const responseJson = await response.json()

        expect(responseJson).toEqual({
          method: 'put',
          host: context.host,
          path: '/posts',
          headers: context.headers,
          body
        })
      }
    )

    it(
      'if context is specified and host & headers are specified,' +
            'performs PUT request with specified host and headers',
      async () => {
        const otherContext: HttpClientContext = {
          host: 'other',
          headers: { Authorization: 'Bearer otherToken' }
        }
        const body = { title: 'foo', body: 'bar' }

        const response = await httpClient.put('/posts', body, otherContext)
        const responseJson = await response.json()

        expect(responseJson).toEqual({
          method: 'put',
          host: otherContext.host,
          path: '/posts',
          headers: otherContext.headers,
          body
        })
      }
    )
  })

  describe('.delete', () => {
    it(
      'if context is specified and no host & headers are specified,' +
            'performs DELETE request with context host and headers',
      async () => {
        const response = await httpClient.delete('/todos/1')
        const responseJson = await response.json()

        expect(responseJson).toEqual({
          method: 'delete',
          host: context.host,
          path: '/todos/1',
          headers: context.headers,
          body: {}
        })
      }
    )

    it(
      'if context is specified and host & headers are specified,' +
            'performs DELETE request with specified host and headers',
      async () => {
        const otherContext: HttpClientContext = {
          host: 'other',
          headers: { Authorization: 'Bearer otherToken' }
        }

        const response = await httpClient.delete('/todos/1', otherContext)
        const responseJson = await response.json()

        expect(responseJson).toEqual({
          method: 'delete',
          host: otherContext.host,
          path: '/todos/1',
          headers: otherContext.headers,
          body: {}
        })
      }
    )
  })
})
