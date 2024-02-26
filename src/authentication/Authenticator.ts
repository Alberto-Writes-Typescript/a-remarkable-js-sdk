import { NodeClient } from '../net/NodeClient'
import {Device} from "./Device";
import DeviceToken from "./DeviceToken";

const REMARKABLE_HOST: string = 'https://webapp-prod.cloud.remarkable.engineering'
const AUTHENTICATION_PATH :string = '/token/json/2/device/new'

export class Authenticator {
  public static async pair(device: Device, oneTimeCode: string): Promise<Device> {
    const pairResponse = await NodeClient.post(
      REMARKABLE_HOST,
      AUTHENTICATION_PATH,
      { 'Content-Type': 'application/json' },
      {
        code: oneTimeCode,
        deviceID: device.id,
        deviceDesc: device.description
      }
    )

    if (pairResponse.status !== 200)
      throw new Error(`Failed to authenticate with Remarkable API: ${pairResponse.statusText}`)

    device.token = new DeviceToken(await pairResponse.text())

    return device
  }
}
