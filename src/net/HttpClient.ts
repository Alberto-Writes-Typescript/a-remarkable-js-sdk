import Headers, { type HeadersPayload } from './HttpClient/Headers'
import type Context from './HttpClient/Context'
import { type BodyPayload } from './HttpClient/Body'

/**
 * Interface for library HTTP client.
 *
 * Provides a RESTful interface for performing HTTP requests. All http
 * requests performed by the library should be done through this interface.
 *
 * `HttpClients` interface consists on a set of static methods for performing
 * HTTP requests. To perform multiple requests with a base `host` and set of
 * `headers` use the instance methods by instantiating the client with the
 * base `host` and `headers` as context.
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

  /**
   * Perform a GET request.
   *
   * @param path - Request path destination (https://{@link host}/{@link path})
   * @param headers - Request headers. Merged with client { @link context.headers } when performing request
   */
  public async get (
    path: string,
    headers: HeadersPayload = {}
  ): Promise<Response> {
    const requestContext = this.requestContext(headers)

    return await this.classReference()
      .get(requestContext.host, path, requestContext.headers.entries)
  }

  /**
   * Perform a POST request.
   *
   * @param path - Request path destination (https://{@link host}/{@link path})
   * @param body - Request body payload
   * @param headers - Request headers. Merged with client { @link context.headers } when performing request
   */
  public async post (
    path: string,
    body: BodyPayload = {},
    headers: HeadersPayload = {}
  ): Promise<Response> {
    const requestContext = this.requestContext(headers)

    return await this.classReference()
      .post(requestContext.host, path, requestContext.headers.entries, body)
  }

  /**
   * Perform a PATCH request.
   *
   * @param path - Request path destination (https://{@link host}/{@link path})
   * @param body - Request body payload
   * @param headers - Request headers. Merged with client { @link context.headers } when performing request
   */
  public async patch (
    path: string,
    body: BodyPayload = {},
    headers: HeadersPayload = {}
  ): Promise<Response> {
    const requestContext = this.requestContext(headers)

    return await this.classReference()
      .patch(requestContext.host, path, requestContext.headers.entries, body)
  }

  /**
   * Perform a PUT request.
   *
   * @param path - Request path destination (https://{@link host}/{@link path})
   * @param body - Request body payload
   * @param headers - Request headers. Merged with client { @link context.headers } when performing request
   */
  public async put (
    path: string,
    body: BodyPayload = {},
    headers: HeadersPayload = {}
  ): Promise<Response> {
    const requestContext = this.requestContext(headers)

    return await this.classReference()
      .put(requestContext.host, path, requestContext.headers.entries, body)
  }

  /**
   * Perform a DELETE request.
   *
   * @param path - Request path destination (https://{@link host}/{@link path})
   * @param headers - Request headers. Merged with client { @link context.headers } when performing request
   */
  public async delete (
    path: string,
    headers: HeadersPayload = {}
  ): Promise<Response> {
    const requestContext = this.requestContext(headers)

    return await this.classReference()
      .delete(requestContext.host, path, requestContext.headers.entries)
  }

  /**
   * Get the underlying `HttpClient` instance class reference.
   *
   * Used to perform HTTP requests through the client specific http static methods.
   *
   * @private
   */
  private classReference (): typeof HttpClient {
    return this.constructor as typeof HttpClient
  }

  /**
   * Request specific configuration. Merges client { @link context.headers }
   * with request specific headers.
   *
   * @param headers - Request specific headers
   *
   * @private
   */
  private requestContext (headers: HeadersPayload): Context {
    return {
      host: this.context.host,
      headers: new Headers({ ...this.context.headers.entries, ...(new Headers(headers)).entries })
    }
  }
}
