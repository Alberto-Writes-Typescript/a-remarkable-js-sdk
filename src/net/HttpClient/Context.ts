import Headers, { type HeadersPayload } from './Headers'

export default class Context {
  readonly host: string
  readonly headers: Headers

  constructor (host: string, headers: HeadersPayload = {}) {
    this.host = host
    this.headers = new Headers(headers)
  }
}
