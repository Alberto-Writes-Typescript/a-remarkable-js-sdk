import Device from '../../src/authentication/Device'
import DeviceToken from '../../src/authentication/DeviceToken'
import HashUrl, { ExpiredHashUrlError, type HashPathPayload } from '../../src/internal/HashUrl'
import ServiceManager from '../../src/ServiceManager'
import { setupHttpRecording } from '../helpers/pollyHelpers'

function disableHashUrlExpiration (): jest.SpyInstance {
  return jest.spyOn(HashUrl.prototype, 'expired', 'get').mockReturnValue(false)
}

function enableHashUrlExpiration (spy: jest.SpyInstance): void {
  spy.mockRestore()
}

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

  describe('static fromRootHash', () => {
    it('returns root folder HashUrl', async () => {
      const spy: jest.SpyInstance = disableHashUrlExpiration()

      const rootFolderHashUrl = await HashUrl.fromRootHash(serviceManager)

      // Regenerate when new requests are recorded
      expect(rootFolderHashUrl.relativePath).toBe(process.env.SAMPLE_ROOT_FOLDER_HASH)
      expect(rootFolderHashUrl.url.host).toBe('storage.googleapis.com')
      expect(rootFolderHashUrl.method).toBe('GET')

      enableHashUrlExpiration(spy)
    })
  })

  describe('static fromHash', () => {
    it('given a hash, returns its HashUrl', async () => {
      const spy: jest.SpyInstance = disableHashUrlExpiration()

      const folderHashUrl = await HashUrl.fromHash(process.env.SAMPLE_FOLDER_HASH, serviceManager)

      // Regenerate when new requests are recorded
      expect(folderHashUrl.relativePath).toBe(process.env.SAMPLE_FOLDER_HASH)
      expect(folderHashUrl.url.host).toBe('storage.googleapis.com')
      expect(folderHashUrl.method).toBe('GET')

      enableHashUrlExpiration(spy)
    })
  })

  describe('fetch', () => {
    it('given a HashUrl, returns content download response', async () => {
      const spy: jest.SpyInstance = disableHashUrlExpiration()

      const rootFolderHashUrl = await HashUrl.fromHash(process.env.SAMPLE_ROOT_FOLDER_HASH, serviceManager)

      const response = await rootFolderHashUrl.fetch()
      const content = await response.text()

      // Sample hash URL payload
      expect(content).toContain('3\nfb6597077542383c2537bce943c81a985a2680bbbcd7ff559e78f2da21c63944:80000000:00f9663d-3d4a-4640-a755-3a0e66b44f1d:4:3943357')

      enableHashUrlExpiration(spy)
    })

    it('given an expired HashUrl, throws expired URL error', async () => {
      const hashPathPayload: HashPathPayload = {
        expires: '2021-09-01T00:00:00Z',
        method: 'GET',
        relative_path: 'root',
        url: 'https://storage.googleapis.com'
      }

      const rootFolderHashUrl = new HashUrl(hashPathPayload)

      await expect(rootFolderHashUrl.fetch()).rejects.toThrow(ExpiredHashUrlError)
    })
  })
})
