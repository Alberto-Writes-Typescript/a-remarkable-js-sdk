import { FetchClient } from '../FetchClient'

const REMARKABLE_HOST: string = 'https://webapp-prod.cloud.remarkable.engineering'
const AUTHENTICATION_PATH :string = '/token/json/2/device/new'

export class Authenticator {
  static async pairDevice (deviceUUID: string, oneTimeCode: string): Promise<Authenticator> {
    const httpClient = new FetchClient()

    const response = await httpClient.makeRequest(
      REMARKABLE_HOST,
      AUTHENTICATION_PATH,
      'POST',
      { 'Content-Type': 'application/json' },
      JSON.stringify({
        code: oneTimeCode,
        deviceID: deviceUUID,
        deviceDesc: 'desktop-windows',
      })
    )

    if (response.status !== 200) {
      throw new Error(`Failed to authenticate with Remarkable API: ${response.statusText}`)
    } else {
      const token: string = await response.text()
      return new Authenticator(deviceUUID, token)
    }
  }

  public readonly deviceUUID: string
  public readonly token: string

  constructor (token: string, deviceUUID: string) {
    this.deviceUUID = deviceUUID
    this.token = token
  }
}
