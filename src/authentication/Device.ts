import type HttpClient from '../net/HttpClient'
import { type DeviceDescription } from './DeviceDescription'
import ServiceManager from '../serviceDiscovery/ServiceManager'
import RemarkableTokenPayload from './RemarkableTokenPayload'
import Session from './Session'
import NodeClient from '../net/NodeClient'

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
  public static async pair (
    id: string,
    description: DeviceDescription,
    oneTimeCode: string,
    HttpClientConstructor: unknown = NodeClient
  ): Promise<Device> {
    const httpClient = ServiceManager.productionHttpClient({}, HttpClientConstructor)

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

  private readonly httpClient: HttpClient

  constructor (deviceToken: string, HttpClientConstructor: unknown = NodeClient) {
    const deviceTokenPayload = new RemarkableTokenPayload(deviceToken)

    this.id = deviceTokenPayload.deviceId
    this.description = deviceTokenPayload.deviceDescription
    this.token = deviceToken

    this.httpClient = ServiceManager.productionHttpClient(
      { Authorization: `Bearer ${this.token}` },
      HttpClientConstructor
    )
  }

  /**
   * Creates a new `device` `session`.
   *
   * Fetches a new session token from the reMarkable Cloud API. This token
   * can be used to perform authenticated requests to the reMarkable Cloud API
   * in behalf of the user account associated to the `device`.
   */
  public async connect (): Promise<Session> {
    const connectResponse = await this.httpClient.post('/token/json/2/user/new', {})

    if (connectResponse.status !== 200) {
      throw new Error(`Failed to connect with Remarkable API: ${await connectResponse.text()}`)
    }

    return new Session(await connectResponse.text())
  }
}
