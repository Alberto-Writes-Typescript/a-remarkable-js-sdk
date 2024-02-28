import { SERVICE_DISCOVERY_HOST, STORAGE_DISCOVERY_PATH } from '../constants'
import type Device from '../authentication/Device'
import NodeClient from '../net/NodeClient'

interface ServiceDiscoveryResponse {
  Status: 'OK' | string
  Host: string
}

export default class ServiceDiscovery {
  public readonly device: Device
  public storageHost: string = SERVICE_DISCOVERY_HOST

  constructor (device: Device, storageHost: string | null = null) {
    this.device = device
    if (storageHost !== null) this.storageHost = storageHost
  }

  public async discoverStorageHost (): Promise<ServiceDiscovery> {
    const discoveryResponse = await NodeClient.get(
      SERVICE_DISCOVERY_HOST,
      STORAGE_DISCOVERY_PATH,
      { Authorization: `Bearer ${this.device.sessionToken.token}` }
    )

    if (discoveryResponse.status !== 200) {
      throw new Error(`Failed to find Remarkable API Storage Service: ${discoveryResponse.statusText}`)
    }

    const discoveryPayload: ServiceDiscoveryResponse = await discoveryResponse.json()

    if (discoveryPayload.Status === 'OK') this.storageHost = discoveryPayload.Host

    return this
  }
}
