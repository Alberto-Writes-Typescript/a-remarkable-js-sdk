import HttpClientRequestBody, {
  type HttpClientRequestBodyPayload,
  type HttpClientRequestSerializedBody
} from './HttpClientRequestBody'

interface HttpsRequestOptions {
  hostname: string
  path: string
  method: string
  headers: Record<string, string>
}

export default class HttpClientRequest {
  readonly url: URL
  readonly method: string
  readonly headers?: Record<string, string> | null
  readonly body?: HttpClientRequestBody | null

  constructor (
    host: string,
    path: string,
    method: string,
    headers: Record<string, string> | null = null,
    body: HttpClientRequestBodyPayload | null = null
  ) {
    this.url = new URL(path, host)
    this.method = method
    this.headers = headers
    this.body = body !== null ? new HttpClientRequestBody(body) : null
  }

  get serializedBody (): HttpClientRequestSerializedBody | null {
    return this.body?.serialized
  }

  public toRequest (): Request {
    return new Request(
      this.url.toString(),
      {
        method: this.method,
        headers: this.headers,
        body: this.body?.serialized
      }
    )
  }

  public toHttpsRequestOptions (): HttpsRequestOptions {
    return {
      hostname: this.url.hostname,
      path: this.url.pathname,
      method: this.method,
      headers: this.headers
    }
  }
}
