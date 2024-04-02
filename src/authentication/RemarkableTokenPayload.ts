import { jwtDecode } from 'jwt-decode'
import type { DeviceDescription } from './DeviceDescription'

const REMARKABLE_JWT_MAPPING = {
  deviceId: 'device-id',
  deviceDescription: 'device-desc'
}

export class InvalidRemarkableTokenError extends Error {}

/**
 * reMarkable Cloud API JWT token payload for pairing & authentication requests
 */
export default class RemarkableTokenPayload {
  /**
   * Validates a reMarkable Cloud API JWT token.
   *
   * a reMarkable Cloud API JWT represents a `device` via its ID
   * and description. Every reMarkable Cloud API JWT token must
   * contain these two fields.
   *
   * @param token
   */
  static valid (token: string): boolean {
    const parsedToken = jwtDecode(token)

    return Object.values(REMARKABLE_JWT_MAPPING).every((jwtKey) => {
      return Object.keys(parsedToken).includes(jwtKey)
    })
  }

  public readonly token: string
  public readonly deviceId: string
  public readonly deviceDescription: DeviceDescription
  public readonly tokenIssuedTimestamp: number
  public readonly tokenExpirationTimestamp: number

  constructor (token: string) {
    const parsedToken = jwtDecode(token)

    if (!RemarkableTokenPayload.valid(token)) {
      throw new InvalidRemarkableTokenError(`
        Invalid reMarkable Cloud API token. A valid reMarkable
        Cloud API token contains a device ID and description.
        The current token does contains ${Object.keys(parsedToken).join(', ')} fields.
      `)
    }

    this.deviceId = parsedToken[REMARKABLE_JWT_MAPPING.deviceId]
    this.deviceDescription = parsedToken[REMARKABLE_JWT_MAPPING.deviceDescription]

    this.token = token
    this.tokenIssuedTimestamp = parsedToken.iat
    this.tokenExpirationTimestamp = parsedToken.exp
  }
}
