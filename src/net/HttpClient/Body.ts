/**
 * Error raised when attempted to serialize an unsupported HTTP request body
 */
export class InvalidBodyPayloadError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'InvalidBodyError'
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
export type BodyPayload = Record<string, string | boolean | number> | ArrayBuffer | Buffer | string

/**
 * Represents serialized data to be send via an HTTP POST / PATCH / PUT request
 *
 * Set of types qualified to be dispatches as `body` in an HTTP POST / PATCH / PUT request.
 */
export type SerializedBodyPayload = string | ArrayBuffer | Buffer

/**
 * HTTP request body serializer
 *
 * Adapter class responsible of handling different data types qualified to
 * be dispatched as `body` in an HTTP POST / PATCH / PUT request. Transforms
 * data types incompatible with HTTP body formats into compatible ones, so
 * they can be used by the `HttpClient` to dispatch requests.
 */
export default class Body {
  /**
   * Serializes a given payload into a format compatible with HTTP request body
   */
  static serialize (payload: BodyPayload): SerializedBodyPayload {
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
        throw new InvalidBodyPayloadError(
          `
           ${(payload as unknown).constructor.name} Http body payload not supported.
           Supported types are: ArrayBuffer, Buffer, String & Record.
          `
        )
    }
  }

  readonly #content: BodyPayload
  readonly #serialized: SerializedBodyPayload

  constructor (content: BodyPayload) {
    this.#content = content
    this.#serialized = Body.serialize(content)
  }

  get content (): BodyPayload {
    return this.#content
  }

  get serialized (): SerializedBodyPayload {
    return this.#serialized
  }
}
