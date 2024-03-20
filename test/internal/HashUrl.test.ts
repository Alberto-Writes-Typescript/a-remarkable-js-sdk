import Device from '../../src/authentication/Device'
import DeviceToken from '../../src/authentication/DeviceToken'
import HashUrl from '../../src/internal/HashUrl'
import ServiceManager from '../../src/ServiceManager'
import { setupHttpRecording } from '../helpers/pollyHelpers'

describe('RootFolder', () => {
  let serviceManager: ServiceManager = null

  setupHttpRecording()

  beforeEach(async () => {
    const device = new Device(
      process.env.SAMPLE_UUID,
      'browser-chrome',
      new DeviceToken(process.env.SAMPLE_PAIR_TOKEN)
    )

    await device.connect()

    serviceManager = new ServiceManager(device)
  })

  describe('#fromRootHash', () => {
    it('returns root folder HashUrl', async () => {
      const rootFolderHashUrl = await HashUrl.fromRootHash(serviceManager)

      // Regenerate when new requests are recorded
      expect(rootFolderHashUrl.relativePath).toBe('a5e373954b79e3b5879dbc518799abe632534b2e8a675ba198552d4818ba6cdb')
      expect(rootFolderHashUrl.url.host).toBe('storage.googleapis.com')
    }, 10000000)
  })

  describe('#fromHash', () => {
    it('given a Document / Folder hash, returns its HashUrl', async () => {
      const rootFolderHashUrl = await HashUrl.fromHash('a5e373954b79e3b5879dbc518799abe632534b2e8a675ba198552d4818ba6cdb', serviceManager)

      // Regenerate when new requests are recorded
      expect(rootFolderHashUrl.relativePath).toBe('a5e373954b79e3b5879dbc518799abe632534b2e8a675ba198552d4818ba6cdb')
      expect(rootFolderHashUrl.url.host).toBe('storage.googleapis.com')
    }, 10000000)
  })
})
