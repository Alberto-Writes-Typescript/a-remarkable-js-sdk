import HttpClient from './HttpClient'
import HttpClientRequest from './HttpClientRequest'
import HttpClientRequestBody, { type HttpClientRequestBodyPayload } from './HttpClientRequestBody'

export default class FetchClient extends HttpClient {
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
    return await fetch(
      host + path,
      {
        method: 'POST',
        headers,
        // @ts-ignore
        body
      }
    )
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
    return await fetch(
      httpClientRequest.url.toString(),
      {
        method: httpClientRequest.method,
        headers: httpClientRequest.headers,
        body: httpClientRequest.serializedBody
      }
    )
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
