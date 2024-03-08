import HttpClientRequestBody, {
  type HttpClientRequestBodyPayload,
  type HttpClientRequestSerializedBody
} from './HttpClientRequestBody'

export default class HttpClientRequest {
  readonly url: URL
  readonly method: string
  readonly headers?: Record<string, string> | null
  readonly rawBody?: HttpClientRequestBodyPayload | null = null
  readonly body?: HttpClientRequestSerializedBody | null = null

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

    if (body !== null) {
      this.rawBody = body
      this.body = (new HttpClientRequestBody(body)).serialized
    }
  }
}
