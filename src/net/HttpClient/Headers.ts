export type HeadersPayload = Record<string, string>

/**
 * { @link HttpClient } { @link Request } headers
 *
 * Encapsulates a collection of `http` `header` key - value pairs
 * and provides logic to export them in different formats
 * compatible with `http` libraries.
 */
export default class Headers {
  /**
   * Original HTTP request `headers` payload.
   * @private
   */
  readonly #entries: Record<string, string>

  constructor (headers: HeadersPayload) {
    this.#entries = headers
  }

  get entries (): Record<string, string> {
    return this.#entries
  }
}
