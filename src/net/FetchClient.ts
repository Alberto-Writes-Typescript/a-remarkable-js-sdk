import { HttpClient } from './HttpClient';
import HttpClientRequest from "./HttpClientRequest";

export class FetchClient extends HttpClient {
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

  private static async makeRequest (httpClientRequest: HttpClientRequest): Promise<Response> {
    return await fetch(httpClientRequest.toRequest())
  }

  private static request(
    host: string,
    path: string,
    method: string,
    headers: Record<string, string>,
    body: Record<string, string> | null
  ): HttpClientRequest {
    return new HttpClientRequest(host, path, method, headers, body)
  }
}
