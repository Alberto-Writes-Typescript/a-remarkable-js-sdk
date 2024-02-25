import * as https from 'https'
import { HttpClient } from './HttpClient'

interface NodeClientRequest {
  body: string | null,
  options: {
    hostname: string,
    path: string,
    method: string,
    headers: Record<string, string>,
  }
}

export class NodeClient extends HttpClient {
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
    body: Record<string, string> = {}
  ): Promise<Response> {
    return await this.makeRequest(this.request(host, path, 'POST', headers, body))
  }

  public static async patch (
    host: string,
    path: string,
    headers: Record<string, string> = {},
    body: Record<string, string> = {}
  ): Promise<Response> {
    return await this.makeRequest(this.request(host, path, 'PATCH', headers, body))
  }

  public static async put (
    host: string,
    path: string,
    headers: Record<string, string> = {},
    body: Record<string, string> = {}
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

  private static async makeRequest (request: NodeClientRequest): Promise<Response> {
    return new Promise((resolve: Function, reject: Function) => {
      const httpsRequest = https.request(request.options, (response) => {
        let responseData: string = ''

        response.on('data', (chunk) => responseData += chunk)

        response.on('end', () =>
          resolve(new Response(responseData, { status: response.statusCode, statusText: response.statusMessage }))
        )
      })

      httpsRequest.on('error', (error) => { reject(error) })

      if (request.body) httpsRequest.write(request.body)

      httpsRequest.end()
    })
  }

  private static request(
    host: string,
    path: string,
    method: string,
    headers: Record<string, string>,
    body: Record<string, string> | null
  ): NodeClientRequest {
    return { body: JSON.stringify(body), options: { hostname: host, path, method, headers } } as NodeClientRequest
  }
}
