import RemarkableTokenPayload from './RemarkableTokenPayload'

/**
 * Represents a reMarkable Cloud API session.
 *
 * The reMarkable Cloud API uses JWT token based authentication. All requests
 * performed to the API (expect the authentication ones) must contain a valid
 * JWT token which identifies the (@link Device) performing the request.
 *
 * The `Session` class provides an interface to access the authentication
 * token information and verify its validity.
 */
export default class Session {
  public readonly deviceId: string
  public readonly expiresAt: Date
  public readonly token: string

  constructor (sessionToken: string) {
    const sessionTokenPayload = new RemarkableTokenPayload(sessionToken)

    this.deviceId = sessionTokenPayload.deviceId
    this.expiresAt = new Date(sessionTokenPayload.tokenExpirationTimestamp)
    this.token = sessionToken
  }

  get expired (): boolean {
    return Date.now() >= this.expiresAt.getTime()
  }
}
