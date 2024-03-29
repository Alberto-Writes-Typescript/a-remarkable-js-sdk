export type HeadersPayload = Record<string, string>

/**
 * HTTP Headers for { @link HttpClient }
 */
export default class Headers {
  readonly #entries: Record<string, string>

  constructor (headers: HeadersPayload) {
    this.#entries = headers
  }

  get entries (): Record<string, string> {
    return this.#entries
  }
}
