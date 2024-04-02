import { jwtDecode } from 'jwt-decode'
import DeviceToken from './DeviceToken'
import type HttpClient from '../net/HttpClient'
import { type DeviceDescription } from './DeviceDescription'
import ServiceManager from '../ServiceManager'

const REMARKABLE_JWT_MAPPING = {
  deviceId: 'device-id',
  deviceDescription: 'device-desc'
}

export class InvalidRemarkableTokenError extends Error {}

/**
 * reMarkable Cloud API JWT token payload for pairing & authentication requests
 */
class RemarkableTokenPayload {
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

  constructor (token: string) {
    const parsedToken = jwtDecode(token)

    if (!RemarkableTokenPayload.valid(token)) {
      throw new InvalidRemarkableTokenError(`
        Invalid reMarkable Cloud API token. A valid reMarkable
        Cloud API token contains a device ID and description.
        The current token does contains ${Object.keys(parsedToken).join(', ')} fields.
      `)
    }

    this.token = token
    this.deviceId = parsedToken['device-id']
    this.deviceDescription = parsedToken['device-desc']
  }
}

/**
 * Represents a reMarkable device. Provides an interface to
 * authenticate with the reMarkable Cloud API.
 *
 * The reMarkable Cloud API uses `devices` to authenticate users. A
 * `device` is any software paired to a reMarkable Cloud user account.
 * `devices` are represented by a `device token`. A `device token` is
 * a JWT token without expiration date. It is used to fetch `session tokens`
 * from the reMarkable Cloud API, which can be used to perform authenticated
 * request to the different API services.
 *
 * The `Device` class encapsulates the logic to pair new applications to
 * reMarkable Cloud user accounts and create user sessions for interacting
 * with the reMarkable Cloud API.
 *
 * Paired `Devices` are listed in: [https://my.remarkable.com/device/remarkable](https://my.remarkable.com/device/remarkable)
 */
export default class Device {
  /**
   * Creates a new device and pairs it to a reMarkable Cloud user account.
   *
   * @param id - Unique `device` ID (uuid v4)
   * @param description - Label which indicates the `device` running environment (web browser, mobile app, ...)
   * @param oneTimeCode - One-time password to authenticate reMarkable Cloud user account when pairing `device`
   */
  public static async pair (id: string, description: DeviceDescription, oneTimeCode: string): Promise<Device> {
    const httpClient = ServiceManager.productionHttpClient()

    const pairResponse = await httpClient.post(
      '/token/json/2/device/new',
      {
        code: oneTimeCode,
        deviceID: id,
        deviceDesc: description
      }
    )

    if (pairResponse.status !== 200) {
      throw new Error(`Failed to pair with Remarkable API: ${pairResponse.statusText}`)
    }

    return new Device(await pairResponse.text())
  }

  /**
   * `device` unique identifier (uuid v4)
   */
  public readonly id: string
  /**
   * `device` running environment (web browser, mobile app, ...)
   */
  public readonly description: DeviceDescription
  /**
   * reMarkable Cloud API token associated to `device`
   */
  public readonly token: string
  /**
   * reMarkable Cloud API token required on every request to the API
   * (expect authentication requests) for user authentication.
   */
  public sessionToken: DeviceToken | null = null

  private readonly httpClient: HttpClient

  constructor (deviceToken: string) {
    const deviceTokenPayload = new RemarkableTokenPayload(deviceToken)

    this.id = deviceTokenPayload.deviceId
    this.description = deviceTokenPayload.deviceDescription
    this.token = deviceToken

    this.httpClient = ServiceManager.productionHttpClient({ Authorization: `Bearer ${this.token}` })
  }

  public async connect (): Promise<Device> {
    const connectResponse = await this.httpClient.post('/token/json/2/user/new', {})

    if (connectResponse.status !== 200) {
      throw new Error(`Failed to connect with Remarkable API: ${connectResponse.statusText}`)
    }

    this.sessionToken = new DeviceToken(await connectResponse.text())

    return this
  }
}
