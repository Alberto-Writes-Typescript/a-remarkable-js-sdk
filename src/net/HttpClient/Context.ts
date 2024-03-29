import Headers, { type HeadersPayload } from './Headers'

/**
 * { @link HttpClient } { @link Request } context
 *
 * `HttpClient` instance configuration. Given an `HttpClient` with a
 * `Context`, the `Context` represents the base URL and headers set
 * used in all http requests performed with the client.
 */
export default class Context {
  readonly host: string
  readonly headers: Headers

  constructor (host: string, headers: HeadersPayload = {}) {
    this.host = host
    this.headers = new Headers(headers)
  }
}
