import type Device from '../authentication/Device'
import NodeClient from '../net/NodeClient'
import type HttpClient from '../net/HttpClient'

const SERVICE_DISCOVERY_HOST: string = 'https://service-manager-production-dot-remarkable-production.appspot.com'

interface ServiceDiscoveryResponse {
  Status: 'OK' | string
  Host: string
}

export default class ServiceDiscovery {
  public readonly device: Device
  public readonly httpClient: HttpClient

  public storageHost?: string

  constructor (device: Device, storageHost: string | null = null) {
    this.device = device

    this.httpClient = new NodeClient(SERVICE_DISCOVERY_HOST, { Authorization: `Bearer ${this.device.sessionToken.token}` })

    if (storageHost !== null) this.storageHost = storageHost
  }

  public async discoverStorageHost (): Promise<ServiceDiscovery> {
    const discoveryResponse = await this.httpClient.get('/service/json/1/document-storage?environment=production&group=auth0%7C5a68dc51cb30df3877a1d7c4&apiVer=2')

    if (discoveryResponse.status !== 200) {
      throw new Error(`Failed to find Remarkable API Storage Service: ${discoveryResponse.statusText}`)
    }

    const discoveryPayload: ServiceDiscoveryResponse = await discoveryResponse.json()

    if (discoveryPayload.Status === 'OK') this.storageHost = discoveryPayload.Host

    return this
  }
}
