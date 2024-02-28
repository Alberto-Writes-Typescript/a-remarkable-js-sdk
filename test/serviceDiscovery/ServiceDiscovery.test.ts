import Device from '../../src/authentication/Device'
import DeviceToken from '../../src/authentication/DeviceToken'
import ServiceDiscovery from '../../src/serviceDiscovery/ServiceDiscovery'
import { setupHttpRecording } from '../helpers/pollyHelpers'

describe('ServiceDiscovery', () => {
  // Enables Polly.js to record and replay HTTP requests for each test
  setupHttpRecording()

  describe('.discoverStorageHost', () => {
    it('if Device is connected, updates service discovery with storage host', async () => {
      const device = new Device(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        process.env.SAMPLE_UUID!, 'browser-chrome', new DeviceToken(process.env.SAMPLE_PAIR_TOKEN!)
      )

      await device.connect()

      const serviceDiscovery = new ServiceDiscovery(device)

      serviceDiscovery.storageHost = null

      await serviceDiscovery.discoverStorageHost()

      expect(serviceDiscovery.storageHost).toBe('document-storage-production-dot-remarkable-production.appspot.com')
    }, 5000)
  })
})
