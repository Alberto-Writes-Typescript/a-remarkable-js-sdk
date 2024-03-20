import Device from '../../src/authentication/Device'
import DeviceToken from '../../src/authentication/DeviceToken'
import HashUrl from '../../src/internal/HashUrl'
import ServiceManager from '../../src/ServiceManager'
import { setupHttpRecording } from '../helpers/pollyHelpers'

describe('HashUrl', () => {
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
      expect(rootFolderHashUrl.relativePath).toBe(process.env.SAMPLE_FOLDER_HASH)
      expect(rootFolderHashUrl.url.host).toBe('storage.googleapis.com')
    }, 10000000)
  })

  describe('#fromHash', () => {
    it('given a Document / Folder hash, returns its HashUrl', async () => {
      const rootFolderHashUrl = await HashUrl.fromHash(process.env.SAMPLE_FOLDER_HASH, serviceManager)

      // Regenerate when new requests are recorded
      expect(rootFolderHashUrl.relativePath).toBe(process.env.SAMPLE_FOLDER_HASH)
      expect(rootFolderHashUrl.url.host).toBe('storage.googleapis.com')
    }, 10000000)
  })

  describe('#fetchContent', () => {
    it('returns hash raw content', async () => {
      const rootFolderHashUrl = await HashUrl.fromHash(process.env.SAMPLE_FOLDER_HASH, serviceManager)

      const content = await rootFolderHashUrl.fetchContent()

      // Sample hash URL payload
      expect(content).toContain('3\nfb6597077542383c2537bce943c81a985a2680bbbcd7ff559e78f2da21c63944:80000000:00f9663d-3d4a-4640-a755-3a0e66b44f1d:4:3943357')
    })
  })
})
