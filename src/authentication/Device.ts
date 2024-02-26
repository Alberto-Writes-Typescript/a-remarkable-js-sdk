import DeviceToken from './DeviceToken'
import { NodeClient } from '../net/NodeClient'

export type DeviceDescription =
  'browser-chrome' |
  'desktop-macos' |
  'desktop-windows' |
  'mobile-android' |
  'mobile-ios' |
  'remarkable'

const REMARKABLE_HOST: string = 'https://webapp-prod.cloud.remarkable.engineering'
const AUTHENTICATION_PATH :string = '/token/json/2/device/new'

export class Device {
  public static async pair(id: string, description: DeviceDescription, oneTimeCode: string): Promise<Device> {
    const pairResponse = await NodeClient.post(
      REMARKABLE_HOST,
      AUTHENTICATION_PATH,
      {},
      { code: oneTimeCode, deviceID: id, deviceDesc: description }
    )

    if (pairResponse.status !== 200)
      throw new Error(`Failed to authenticate with Remarkable API: ${pairResponse.statusText}`)

    return new Device(id, description, new DeviceToken(await pairResponse.text()))
  }

  public readonly id: string
  public readonly description: DeviceDescription
  public readonly pairToken: DeviceToken

  constructor(
    id: string,
    description: DeviceDescription,
    token: DeviceToken
  ) {
    this.id = id
    this.description = description
    this.pairToken = token
  }
}