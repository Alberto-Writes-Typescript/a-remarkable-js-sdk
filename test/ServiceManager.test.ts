import HttpClient from '../src/net/HttpClient'
import Device from '../src/authentication/Device'
import ServiceManager from '../src/ServiceManager'
import { setupHttpRecording } from './helpers/pollyHelpers'

describe('ServiceManager', () => {
  // Enables Polly.js to record and replay HTTP requests for each test
  setupHttpRecording()

  describe('.documentStorageHttpClient', () => {
    it('if Device is connected, returns HttpClient instance with document storage configuration', async () => {
      const device = new Device(process.env.SAMPLE_PAIR_TOKEN)

      await device.connect()

      const serviceDiscovery = new ServiceManager(device)

      const client = await serviceDiscovery.documentStorageHttpClient()

      expect(client)
        .toBeInstanceOf(HttpClient)
      expect(client.context.host)
        .toBe('https://document-storage-production-dot-remarkable-production.appspot.com')
      expect(JSON.stringify(client.context.headers.entries))
        .toBe(JSON.stringify({ Authorization: `Bearer ${device.sessionToken.token}` }))
    }, 5000)
  })

  describe('.internalCloudHttpClient', () => {
    it('if Device is connected, returns HttpClient instance with internal cloud configuration', async () => {
      const device = new Device(process.env.SAMPLE_PAIR_TOKEN)

      await device.connect()

      const serviceDiscovery = new ServiceManager(device)

      const client = await serviceDiscovery.internalCloudHttpClient()

      expect(client)
        .toBeInstanceOf(HttpClient)
      expect(client.context.host)
        .toBe('https://internal.cloud.remarkable.com')
      expect(JSON.stringify(client.context.headers.entries))
        .toBe(JSON.stringify({ Authorization: `Bearer ${device.sessionToken.token}` }))
    }, 5000)
  })
})
