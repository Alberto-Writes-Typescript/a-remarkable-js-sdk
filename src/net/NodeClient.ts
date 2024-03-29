import * as https from 'https'
import { type BodyPayload } from './HttpClient/Body'
import { type HeadersPayload } from './HttpClient/Headers'
import HttpClient from './HttpClient'
import Request from './HttpClient/Request'

export default class NodeClient extends HttpClient {
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
    // eslint-disable-next-line @typescript-eslint/ban-types
    return await new Promise((resolve: Function, reject: Function) => {
      let path = request.url.pathname

      if (request.url.search != null) path += request.url.search

      const httpsRequest = https.request(
        {
          method: request.method,
          hostname: request.url.hostname,
          path,
          headers: request.headers.entries
        },
        (response) => {
          let responseData: string = ''

          // eslint-disable-next-line no-return-assign
          response.on('data', (chunk): string => responseData += chunk)

          response.on('end', () =>
            resolve(new Response(responseData, { status: response.statusCode, statusText: response.statusMessage }))
          )
        }
      )

      httpsRequest.on('error', (error) => { reject(error) })

      if (request.body != null) httpsRequest.write(request.body)

      httpsRequest.end()
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
