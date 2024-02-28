import Device from '../../src/authentication/Device'
import DeviceToken from '../../src/authentication/DeviceToken'
import ServiceDiscovery from '../../src/serviceDiscovery/ServiceDiscovery'
import { setupHttpRecording } from '../helpers/pollyHelpers'

const SAMPLE_UUID: string = '02ce7950-0b1e-4039-95a7-e098e10c33fa'
const SAMPLE_PAIR_TOKEN: DeviceToken = new DeviceToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoMC11c2VyaWQiOiJhdXRoMHw1ZWZjMjg3ZmM0ODgwMTAwMTM0NGY5MjMiLCJkZXZpY2UtZGVzYyI6ImJyb3dzZXItY2hyb21lIiwiZGV2aWNlLWlkIjoiMDJjZTc5NTAtMGIxZS00MDM5LTk1YTctZTA5OGUxMGMzM2ZhIiwiaWF0IjoxNzA5MDE2NTk3LCJpc3MiOiJyTSBXZWJBcHAiLCJqdGkiOiJjazB0S2FFdFM4MD0iLCJuYmYiOjE3MDkwMTY1OTcsInN1YiI6InJNIERldmljZSBUb2tlbiJ9.vO5iXB-Xy1cbpn8HeZmt5NYyI3wytnPxYp2-2WggFhU')

describe('ServiceDiscovery', () => {
  // Enables Polly.js to record and replay HTTP requests for each test
  setupHttpRecording()

  describe('.discoverStorageHost', () => {
    it('if Device is connected, updates service discovery with storage host', async () => {
      const device = new Device(SAMPLE_UUID, 'browser-chrome', SAMPLE_PAIR_TOKEN)

      await device.connect()

      const serviceDiscovery = new ServiceDiscovery(device)

      serviceDiscovery.storageHost = null

      await serviceDiscovery.discoverStorageHost()

      expect(serviceDiscovery.storageHost).toBe('document-storage-production-dot-remarkable-production.appspot.com')
    }, 5000)
  })
})
