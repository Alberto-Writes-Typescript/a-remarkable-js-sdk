import Device from '../../src/authentication/Device'
import DeviceToken from '../../src/authentication/DeviceToken'
import Entry from '../../src/internal/Entry'
import HashUrl from '../../src/internal/HashUrl'
import ServiceManager from '../../src/ServiceManager'
import { setupHttpRecording } from '../helpers/pollyHelpers'

describe('Entry', () => {
  let serviceManager: ServiceManager = null

  const sampleFolderHashUrlContent: string = '3\nfb6597077542383c2537bce943c81a985a2680bbbcd7ff559e78f2da21c63944:80000000:00f9663d-3d4a-4640-a755-3a0e66b44f1d:4:3943357\nafdd4be842364b77d83d66d1431a931a36f932a6ec03447e016252a957654d2f:80000000:080b7b49-b72f-49b3-9399-078767c63ee8:7:4267833'

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

  describe('fromFolderHashUrl', () => {
    it('returns the corresponding entries', async () => {
      const hashUrl = await HashUrl.fromHash(process.env.SAMPLE_FOLDER_HASH, serviceManager)
      const entries = await Entry.fromFolderHashUrl(hashUrl)

      expect(entries).toHaveLength(134)
    }, 100000)
  })

  describe('fromFolderHashUrlContent', () => {
    it('if content payload is valid, returns the corresponding entries', () => {
      const entries = Entry.fromFolderHashUrlContent(sampleFolderHashUrlContent)

      expect(entries).toHaveLength(2)
    })
  })
})
