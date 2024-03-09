import HttpClient from '../src/net/HttpClient'
import Device from '../src/authentication/Device'
import DeviceToken from '../src/authentication/DeviceToken'
import ServiceManager from '../src/ServiceManager'
import { setupHttpRecording } from './helpers/pollyHelpers'

describe('ServiceManager', () => {
  // Enables Polly.js to record and replay HTTP requests for each test
  setupHttpRecording()

  describe('.documentStorageHttpClient', () => {
    it('if Device is connected, returns HttpClient instance with document storage configuration', async () => {
      const device = new Device(process.env.SAMPLE_UUID, 'browser-chrome', new DeviceToken(process.env.SAMPLE_PAIR_TOKEN))

      await device.connect()

      const serviceDiscovery = new ServiceManager(device)

      const client = await serviceDiscovery.documentStorageHttpClient()

      expect(client).toBeInstanceOf(HttpClient)
      expect(client.context.host).toBe('document-storage-production-dot-remarkable-production.appspot.com')
      expect(JSON.stringify(client.context.headers)).toBe(JSON.stringify({ Authorization: `Bearer ${device.sessionToken.token}` }))
    }, 5000)
  })
})
