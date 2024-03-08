import * as https from 'https'
import HttpClient from './HttpClient'
import HttpClientRequest from './HttpClientRequest'
import { type HttpClientRequestBodyPayload } from './HttpClientRequestBody'

export default class NodeClient extends HttpClient {
  public static async get (
    host: string,
    path: string,
    headers: Record<string, string> = {}
  ): Promise<Response> {
    return await this.makeRequest(this.request(host, path, 'GET', headers, null))
  }

  public static async post (
    host: string,
    path: string,
    headers: Record<string, string> = {},
    body: HttpClientRequestBodyPayload | null = {}
  ): Promise<Response> {
    return await this.makeRequest(this.request(host, path, 'POST', headers, body))
  }

  public static async patch (
    host: string,
    path: string,
    headers: Record<string, string> = {},
    body: HttpClientRequestBodyPayload | null = {}
  ): Promise<Response> {
    return await this.makeRequest(this.request(host, path, 'PATCH', headers, body))
  }

  public static async put (
    host: string,
    path: string,
    headers: Record<string, string> = {},
    body: HttpClientRequestBodyPayload | null = {}
  ): Promise<Response> {
    return await this.makeRequest(this.request(host, path, 'PUT', headers, body))
  }

  public static async delete (
    host: string,
    path: string,
    headers: Record<string, string> = {}
  ): Promise<Response> {
    return await this.makeRequest(this.request(host, path, 'DELETE', headers, null))
  }

  private static async makeRequest (httpClientRequest: HttpClientRequest): Promise<Response> {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return await new Promise((resolve: Function, reject: Function) => {
      const httpsRequest = https.request(
        {
          hostname: httpClientRequest.url.hostname,
          path: httpClientRequest.url.pathname,
          method: httpClientRequest.method,
          headers: httpClientRequest.headers
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

      if (httpClientRequest.body != null) httpsRequest.write(httpClientRequest.body)

      httpsRequest.end()
    })
  }

  private static request (
    host: string,
    path: string,
    method: string,
    headers: Record<string, string>,
    body: HttpClientRequestBodyPayload | null = {}
  ): HttpClientRequest {
    return new HttpClientRequest(host, path, method, headers, body)
  }
}
