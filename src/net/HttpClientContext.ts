/**
 * Represents the context of an HTTP client.
 *
 * Given an instance of an `HttpClient` with a given `HttpContext`, the client will perform
 * all requests to the given context host and with the given context headers (if specified).
 * This way a client can perform multiple requests to different paths reusing the same
 * context parameters.
 *
 * @interface HttpClientContext
 * @property {string} host - The host of the context. All client HTTP requests will be performed to this host.
 * @property {Headers} [headers] - The headers of the context. All client HTTP requests will be performed with these headers.
 */
export default interface HttpClientContext {
  readonly host?: string
  readonly headers?: Record<string, string>
}
