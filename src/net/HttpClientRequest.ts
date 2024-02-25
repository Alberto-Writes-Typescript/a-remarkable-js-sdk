export default class HttpClientRequest {
  readonly url: URL
  readonly method: string
  readonly headers: Record<string, string> | null
  readonly body: Record<string, string> | null

  constructor(
    host: string,
    path: string,
    method: string,
    headers: Record<string, string> | null = null,
    body: Record<string, string> | null = null
  ) {
    this.url = new URL(path, host)
    this.method = method
    this.headers = headers
    this.body = body
  }

  toRequest(): Request {
    return new Request(
      this.url.toString(),
      {
        method: this.method,
        headers: this.headers,
        body: this.body ? JSON.stringify(this.body) : null
      }
    )
  }
}