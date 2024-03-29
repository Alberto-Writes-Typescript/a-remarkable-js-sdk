import Body, { type SerializedBodyPayload, type BodyPayload } from './Body'
import Headers from './Headers'
import { type HeadersPayload } from './Headers'

/**
 * { @link HttpClient } request
 *
 * Models an HTTP request to be dispatched by { @link HttpClient }.
 *
 * Serializes `headers` and `body` information into an `http` request compatible format.
 */
export default class Request {
  readonly url: URL
  readonly method: string
  readonly headers?: Headers = null
  readonly #body?: Body = null

  constructor (
    host: string,
    path: string,
    method: string,
    headers: HeadersPayload = null,
    body: BodyPayload = null
  ) {
    this.method = method
    this.url = new URL(path, host)

    if (headers != null) this.headers = new Headers(headers)
    if (body != null) this.#body = new Body(body)
  }

  /**
   * Serialized HTTP request `body` payload, ready to be dispatches in an `http` request.
   */
  get body (): SerializedBodyPayload {
    return this.#body?.serialized
  }
}
