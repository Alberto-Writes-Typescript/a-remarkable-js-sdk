import DeviceToken from './DeviceToken'
import NodeClient from '../net/NodeClient'
import { type DeviceDescription } from './DeviceDescription'
import { PAIR_PATH, REMARKABLE_HOST, SESSION_PATH } from '../constants'

export default class Device {
  public static async pair (id: string, description: DeviceDescription, oneTimeCode: string): Promise<Device> {
    const pairResponse = await NodeClient.post(
      REMARKABLE_HOST,
      PAIR_PATH,
      {},
      { code: oneTimeCode, deviceID: id, deviceDesc: description }
    )

    if (pairResponse.status !== 200) {
      throw new Error(`Failed to pair with Remarkable API: ${pairResponse.statusText}`)
    }

    return new Device(id, description, new DeviceToken(await pairResponse.text()))
  }

  public readonly id: string
  public readonly description: DeviceDescription

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
  }

  public async connect (): Promise<Device> {
    const connectResponse = await NodeClient.post(
      REMARKABLE_HOST,
      SESSION_PATH,
      { Authorization: `Bearer ${this.pairToken.token}` },
      {}
    )

    if (connectResponse.status !== 200) {
      throw new Error(`Failed to connect with Remarkable API: ${connectResponse.statusText}`)
    }

    this.sessionToken = new DeviceToken(await connectResponse.text())

    return this
  }
}