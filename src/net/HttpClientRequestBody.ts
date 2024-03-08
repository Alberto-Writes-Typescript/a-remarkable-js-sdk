/**
 * Error raised when attempted to serialize an unsupported HTTP request body
 */
export class InvalidHttpBodyError extends Error {
  constructor (payload: unknown) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    super(`Http body payload ${payload} of kind ${payload.constructor.name} is not supported. Supported types are: Object, ArrayBuffer, Buffer, String.`)
    this.name = 'InvalidHttpBodyError'
  }
}

/**
 * Represents raw data to be send via an HTTP POST / PATCH / PUT request
 *
 * There are certain types which developers usually try to send as a request body,
 * which require serialization before sending in request. For example, JavaScript
 * objects need to be stringified to qualify as a valid request body.
 *
 * This type represents all possible body types an `HttpClient` can send. The
 * `HttpClientRequestBody` class requires these payloads for initialization,
 * and ensure to serialize them accordingly depending on their type so they
 * can be dispatched in HTTP requests.
 */
export type HttpClientRequestBodyPayload = Record<string, string | boolean | number> | ArrayBuffer | Buffer | string

/**
 * Represents serialized data to be send via an HTTP POST / PATCH / PUT request
 *
 * Set of types qualified to be dispatches as `body` in an HTTP POST / PATCH / PUT request.
 */
export type HttpClientRequestSerializedBody = string | ArrayBuffer | Buffer

/**
 * HTTP request body serializer
 *
 * Adapter class responsible of handling different data types qualified to
 * be dispatched as `body` in an HTTP POST / PATCH / PUT request. Transforms
 * data types incompatible with HTTP body formats into compatible ones, so
 * they can be used by the `HttpClient` to dispatch requests.
 */
export default class HttpClientRequestBody {
  /**
   * Serializes a given payload into a format compatible with HTTP request body
   */
  static serialize (payload: HttpClientRequestBodyPayload): HttpClientRequestSerializedBody {
    switch (typeof payload) {
      case 'object':
        if (payload instanceof ArrayBuffer || payload instanceof Buffer) {
          return payload
        } else {
          return JSON.stringify(payload)
        }
      case 'string':
        return payload
      default:
        throw new InvalidHttpBodyError(payload)
    }
  }

  readonly body: HttpClientRequestBodyPayload
  readonly serialized: HttpClientRequestSerializedBody

  constructor (body: HttpClientRequestBodyPayload) {
    this.body = body
    this.serialized = HttpClientRequestBody.serialize(body)
  }
}
