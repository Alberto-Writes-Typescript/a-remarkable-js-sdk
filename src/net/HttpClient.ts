import HttpClientContext from './HttpClientContext'
import { type HttpClientRequestBodyPayload } from './HttpClientRequestBody'

/**
 * HTTP Client abstract class
 *
 * Defines interface for HTTP clients.
 *
 * Used by the different clients of the current library, to provide
 * implementations of the HTTP interface with different libraries
 * (https, fetch, etc).
 *
 * HTTP requests through client can be performed in two different ways:
 *
 * - If you are performing a specific HTTP requests with a host and headers
 *   which are not used in other requests, you can use the static methods
 *   of the client (get, post, patch, put, delete).
 *
 * - If you are performing multiple requests to the same endpoint with
 *   the same headers, you can create an instance and use the instance
 *   methods (get, post, patch, put, delete). This way, you can perform
 *   multiple requests to the same host/with the same headers without
 *   specifying them every time.
 *
 * @abstract
 * @class HttpClient - HTTP Client abstract class
 */
export default abstract class HttpClient {
  public static async get (
    host: string,
    path: string,
    headers: Record<string, string> = {}
  ): Promise<Response> {
    throw new Error('HTTP Client does not implement get static method')
  }

  public static async post (
    host: string,
    path: string,
    headers: Record<string, string> = {},
    body: HttpClientRequestBodyPayload = {}
  ): Promise<Response> {
    throw new Error('HTTP Client does not implement post static method')
  }

  public static async patch (
    host: string,
    path: string,
    headers: Record<string, string> = {},
    body: HttpClientRequestBodyPayload = {}
  ): Promise<Response> {
    throw new Error('HTTP Client does not implement patch static method')
  }

  public static async put (
    host: string,
    path: string,
    headers: Record<string, string> = {},
    body: HttpClientRequestBodyPayload = {}
  ): Promise<Response> {
    throw new Error('HTTP Client does not implement put static method')
  }

  public static async delete (
    host: string,
    path: string,
    headers: Record<string, string> = {}
  ): Promise<Response> {
    throw new Error('HTTP Client does not implement delete static method')
  }

  readonly context: HttpClientContext

  constructor (host: string, headers: Record<string, string> = {}) {
    this.context = new HttpClientContext(host, headers)
  }

  public async get (
    path: string,
    context: HttpClientContext = this.context
  ): Promise<Response> {
    const requestContext: HttpClientContext = this.context.merge(context)

    return await this.classReference()
      .get(requestContext.host, path, requestContext.headers)
  }

  public async post (
    path: string,
    body: HttpClientRequestBodyPayload = {},
    context: HttpClientContext = this.context
  ): Promise<Response> {
    const requestContext: HttpClientContext = this.context.merge(context)

    return await this.classReference()
      .post(requestContext.host, path, requestContext.headers, body)
  }

  public async patch (
    path: string,
    body: HttpClientRequestBodyPayload = {},
    context: HttpClientContext = this.context
  ): Promise<Response> {
    const requestContext: HttpClientContext = this.context.merge(context)

    return await this.classReference()
      .patch(requestContext.host, path, requestContext.headers, body)
  }

  public async put (
    path: string,
    body: HttpClientRequestBodyPayload = {},
    context: HttpClientContext = this.context
  ): Promise<Response> {
    const requestContext: HttpClientContext = this.context.merge(context)

    return await this.classReference()
      .put(requestContext.host, path, requestContext.headers, body)
  }

  public async delete (
    path: string,
    context: HttpClientContext = this.context
  ): Promise<Response> {
    const requestContext: HttpClientContext = this.context.merge(context)

    return await this.classReference()
      .delete(requestContext.host, path, requestContext.headers)
  }

  /**
   * Get the class reference, used to invoke the respective static
   * methods of the HttpClient subclass the instance belongs to.
   * @private
   */
  private classReference (): typeof HttpClient {
    return this.constructor as typeof HttpClient
  }
}
