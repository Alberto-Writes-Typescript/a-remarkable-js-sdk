export type HttpClientRequestBodyPayload = Record<string, string | boolean | number> | ArrayBuffer | Buffer | string

export type HttpClientRequestSerializedBody = string | ArrayBuffer | Buffer

export default class HttpClientRequestBody {
  readonly body: HttpClientRequestBodyPayload

  constructor (body: HttpClientRequestBodyPayload) {
    this.body = body
  }

  public get serialized (): HttpClientRequestSerializedBody {
    if (typeof this.body === 'object') {
      return JSON.stringify(this.body)
    } else {
      return this.body
    }
  }
}
