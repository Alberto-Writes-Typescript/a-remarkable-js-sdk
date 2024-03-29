import Headers, { type HeadersPayload } from './HttpClient/Headers'
import type Context from './HttpClient/Context'
import { type BodyPayload } from './HttpClient/Body'

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
    headers: HeadersPayload = {}
  ): Promise<Response> {
    throw new Error('HTTP Client does not implement get static method')
  }

  public static async post (
    host: string,
    path: string,
    headers: HeadersPayload = {},
    body: BodyPayload = {}
  ): Promise<Response> {
    throw new Error('HTTP Client does not implement post static method')
  }

  public static async patch (
    host: string,
    path: string,
    headers: HeadersPayload = {},
    body: BodyPayload = {}
  ): Promise<Response> {
    throw new Error('HTTP Client does not implement patch static method')
  }

  public static async put (
    host: string,
    path: string,
    headers: HeadersPayload = {},
    body: BodyPayload = {}
  ): Promise<Response> {
    throw new Error('HTTP Client does not implement put static method')
  }

  public static async delete (
    host: string,
    path: string,
    headers: HeadersPayload = {}
  ): Promise<Response> {
    throw new Error('HTTP Client does not implement delete static method')
  }

  readonly context: Context

  constructor (host: string, headers: HeadersPayload = {}) {
    this.context = { host, headers: new Headers(headers) }
  }

  public async get (
    path: string,
    headers: HeadersPayload = {}
  ): Promise<Response> {
    const requestContext = this.requestContext(headers)

    return await this.classReference()
      .get(requestContext.host, path, requestContext.headers.entries)
  }

  public async post (
    path: string,
    body: BodyPayload = {},
    headers: HeadersPayload = {}
  ): Promise<Response> {
    const requestContext = this.requestContext(headers)

    return await this.classReference()
      .post(requestContext.host, path, requestContext.headers.entries, body)
  }

  public async patch (
    path: string,
    body: BodyPayload = {},
    headers: HeadersPayload = {}
  ): Promise<Response> {
    const requestContext = this.requestContext(headers)

    return await this.classReference()
      .patch(requestContext.host, path, requestContext.headers.entries, body)
  }

  public async put (
    path: string,
    body: BodyPayload = {},
    headers: HeadersPayload = {}
  ): Promise<Response> {
    const requestContext = this.requestContext(headers)

    return await this.classReference()
      .put(requestContext.host, path, requestContext.headers.entries, body)
  }

  public async delete (
    path: string,
    headers: HeadersPayload = {}
  ): Promise<Response> {
    const requestContext = this.requestContext(headers)

    return await this.classReference()
      .delete(requestContext.host, path, requestContext.headers.entries)
  }

  /**
   * Get the class reference, used to invoke the respective static
   * methods of the HttpClient subclass the instance belongs to.
   * @private
   */
  private classReference (): typeof HttpClient {
    return this.constructor as typeof HttpClient
  }

  private requestContext (headers: HeadersPayload): Context {
    return {
      host: this.context.host,
      headers: new Headers({ ...this.context.headers.entries, ...(new Headers(headers)).entries })
    }
  }
}
