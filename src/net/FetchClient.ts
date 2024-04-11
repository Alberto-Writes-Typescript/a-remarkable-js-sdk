import { type BodyPayload } from './HttpClient/Body'
import { type HeadersPayload } from './HttpClient/Headers'
import HttpClient from './HttpClient'
import Request from './HttpClient/Request'

/**
 * { @link HttpClient } which uses web browser `fetch` method to perform HTTP requests.
 */
export default class FetchClient extends HttpClient {
  public static async get (
    host: string,
    path: string,
    headers: HeadersPayload = {}
  ): Promise<Response> {
    return await this.makeRequest(this.request(host, path, 'GET', headers, null))
  }

  public static async post (
    host: string,
    path: string,
    headers: HeadersPayload = {},
    body: BodyPayload | null = {}
  ): Promise<Response> {
    return await this.makeRequest(this.request(host, path, 'POST', headers, body))
  }

  public static async patch (
    host: string,
    path: string,
    headers: HeadersPayload = {},
    body: BodyPayload | null = {}
  ): Promise<Response> {
    return await this.makeRequest(this.request(host, path, 'PATCH', headers, body))
  }

  public static async put (
    host: string,
    path: string,
    headers: HeadersPayload = {},
    body: BodyPayload | null = {}
  ): Promise<Response> {
    return await this.makeRequest(this.request(host, path, 'PUT', headers, body))
  }

  public static async delete (
    host: string,
    path: string,
    headers: HeadersPayload = {}
  ): Promise<Response> {
    return await this.makeRequest(this.request(host, path, 'DELETE', headers, null))
  }

  private static async makeRequest (request: Request): Promise<Response> {
    // eslint-disable-next-line @typescript-eslint/ban-types,@typescript-eslint/no-misused-promises,no-async-promise-executor
    return await new Promise(async (resolve: Function, reject: Function) => {
      const response = await fetch(request.url.toString(), {
        method: request.method,
        headers: request.headers.entries,
        body: request.body
      })

      const responseData = await response.text()

      if (response.ok) {
        resolve(new Response(responseData, { status: response.status, statusText: response.statusText }))
      } else {
        reject(new Error(`HTTP error: ${response.status} - ${responseData}`))
      }
    })
  }

  private static request (
    host: string,
    path: string,
    method: string,
    headers: HeadersPayload = {},
    body: BodyPayload = {}
  ): Request {
    return new Request(host, path, method, headers, body)
  }
}
