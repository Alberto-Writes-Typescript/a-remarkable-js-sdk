/**
 * HTTP Header for { @link HttpClient }
 */
interface HttpClientHeader {
  key: string
  value: string
}

/**
 * HTTP Headers for { @link HttpClient }
 */
export default class HttpClientHeaders {
  readonly #entries: HttpClientHeader[] = []

  constructor (entries: Record<string, string> = {}) {
    this.#entries = Object.entries(entries)
      .map(([key, value]) => ({ key, value }))
  }

  get entries (): HttpClientHeader[] {
    return this.#entries
  }

  entry (key: string): HttpClientHeader | null {
    return this.#entries.find(header => header.key === key) || null
  }

  /**
   * Merges { @link HttpClientHeaders.entries } with another { @link HttpClientHeaders.entries }.
   * `headers` present in the current { @link HttpClientHeaders.entries } will be overwritten by
   * the new `headers`.
   *
   * @param headers
   */
  merge (headers: HttpClientHeaders): this {
    headers.entries.forEach(header => this.add(header))

    return this
  }

  private add (entry: HttpClientHeader): this {
    const overwrittenEntry = this.entry(entry.key)

    if (overwrittenEntry != null) {
      overwrittenEntry.value = entry.value
    } else {
      this.#entries.push(entry)
    }

    return this
  }
}
