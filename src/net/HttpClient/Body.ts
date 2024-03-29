/**
 * Error raised when HTTP request `body` type is not supported by { @link HttpClient } { @link Body }.
 *
 * { @link Body } only supports body types:
 *
 * - `ArrayBuffer`
 * - `Buffer`
 * - `String`
 * - `Record`
 */
export class InvalidBodyPayloadError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'InvalidBodyError'
  }
}

/**
 * HTTP request `body` types supported by { @link HttpClient } { @link Body }.
 *
 * These types can be converted into a `serialized` format, compatible with `http` libraries,
 * by the { @link HttpClient } { @link Body } to be dispatched as `body` in an
 * HTTP POST / PATCH / PUT request.
 */
export type BodyPayload = Record<string, string | boolean | number> | ArrayBuffer | Buffer | string

/**
 * Serialized HTTP request `body`.
 *
 * These types are compatible with `http` libraries and can be dispatched as `body` in an
 * HTTP POST / PATCH / PUT request.
 */
export type SerializedBodyPayload = string | ArrayBuffer | Buffer

/**
 * { @link HttpClient } { @link Request } body
 *
 * Serializes different data types qualified to be dispatched as `body`
 * in an HTTP request into an `http` request body compatible format.
 */
export default class Body {
  /**
   * Transforms a `body` payload into a serialized format compatible with `http` libraries.
   *
   * @param payload - HTTP request `body` payload, in a format supported by { @link HttpClient } { @link Body }.
   * @returns Payload in `http` request body compatible format.
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

  /**
   * Original HTTP request `body` payload.
   * @private
   */
  readonly #content: BodyPayload

  /**
   * Serialized HTTP request `body` payload, compatible with `http` libraries.
   * @private
   */
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
