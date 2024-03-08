import DeviceToken from './DeviceToken'
import NodeClient from '../net/NodeClient'
import type HttpClient from '../net/HttpClient'
import { type DeviceDescription } from './DeviceDescription'
import FetchClient from "../net/FetchClient";

export const AUTHENTICATION_HOST: string = 'https://webapp-prod.cloud.remarkable.engineering'

export default class Device {
  public static async pair (id: string, description: DeviceDescription, oneTimeCode: string): Promise<Device> {
    const httpClient = new NodeClient(
      AUTHENTICATION_HOST,
      {
        code: oneTimeCode,
        deviceID: id,
        deviceDesc: description
      }
    )

    const pairResponse = await httpClient.post('/token/json/2/device/new', {})

    if (pairResponse.status !== 200) {
      throw new Error(`Failed to pair with Remarkable API: ${pairResponse.statusText}`)
    }

    return new Device(id, description, new DeviceToken(await pairResponse.text()))
  }

  public readonly id: string
  public readonly description: DeviceDescription
  public readonly httpClient: HttpClient

  /**
   * Device Token, retrieved from device pairing and used to generate user sessions
   */
  public readonly pairToken: DeviceToken
  /**
   * User session token, retrieved on each session and used to authenticate user requests
   */
  public sessionToken: DeviceToken | null = null

  constructor (
    id: string,
    description: DeviceDescription,
    token: DeviceToken
  ) {
    this.id = id
    this.description = description
    this.pairToken = token

    // TODO: add logic to pass a specific client
    this.httpClient = new FetchClient(
      AUTHENTICATION_HOST, {
        Authorization: `Bearer ${this.pairToken.token}`
      }
    )
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
