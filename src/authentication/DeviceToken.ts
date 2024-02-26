import { jwtDecode } from 'jwt-decode'
import { DeviceDescription } from './Device'

/**
 * Token issued by reMarkable after pairing a device
 *
 * The reMarkable API refers to Device as applications connected to the reMarkable
 * cloud (web applications, mobile Apps, etc). Each device is identified by an ID
 * (UUID v4) and a description (the kind of application connecting to reMarkable).
 *
 * To establish a connection, the API defines a protocol consisting on the exchange
 * of a one-time code and the device information. In response, the API returns a
 * token which can be then used to perform authenticated requests.
 *
 * DeviceToken models the token returning during the pairing protocol. It just parses
 * the JWT token and exposes its fields, so other classes in the SDK can use it more
 * easily.
 */
export default class DeviceToken {
  public readonly token: string
  public readonly deviceId: string
  public readonly deviceDescription: DeviceDescription
  public readonly issuer: 'rM WebApp'
  public readonly subject: 'rM Device Token'

  constructor(token: string) {
    const parsedToken = jwtDecode(token) as Record<string, any>

    this.token = token
    this.deviceId = parsedToken['device-id']
    this.deviceDescription = parsedToken['device-desc']
    this.issuer = parsedToken['iss']
    this.subject = parsedToken['sub']
  }
}
