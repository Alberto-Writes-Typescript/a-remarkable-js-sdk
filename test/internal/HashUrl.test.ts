import HashUrl, { ExpiredHashUrlError, type HashPathPayload } from '../../src/internal/HashUrl'
import ServiceManager from '../../src/serviceDiscovery/ServiceManager'
import { setupHttpRecording } from '../helpers/pollyHelpers'
import { Session } from '../../src'

function disableHashUrlExpiration (): jest.SpyInstance {
  return jest.spyOn(HashUrl.prototype, 'expired', 'get').mockReturnValue(false)
}

function enableHashUrlExpiration (spy: jest.SpyInstance): void {
  spy.mockRestore()
}

describe('HashUrl', () => {
  let serviceManager: ServiceManager = null

  setupHttpRecording()

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const session = new Session(global.unitTestParams.sessionToken)

    serviceManager = new ServiceManager(session)
  })

  describe('static fromRootHash', () => {
    it('returns root folder HashUrl', async () => {
      const spy: jest.SpyInstance = disableHashUrlExpiration()

      const rootFolderHashUrl = await HashUrl.fromRootHash(serviceManager)

      // Regenerate when new requests are recorded
      expect(rootFolderHashUrl.relativePath).toBe(global.unitTestParams.rootFolderHash)
      expect(rootFolderHashUrl.url.host).toBe('storage.googleapis.com')
      expect(rootFolderHashUrl.method).toBe('GET')

      enableHashUrlExpiration(spy)
    })
  })

  describe('static fromHash', () => {
    it('given a hash, returns its HashUrl', async () => {
      const spy: jest.SpyInstance = disableHashUrlExpiration()

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const folderHashUrl = await HashUrl.fromHash(global.unitTestParams.rootFolderHash, serviceManager)

      // Regenerate when new requests are recorded
      expect(folderHashUrl.relativePath).toBe(global.unitTestParams.rootFolderHash)
      expect(folderHashUrl.url.host).toBe('storage.googleapis.com')
      expect(folderHashUrl.method).toBe('GET')

      enableHashUrlExpiration(spy)
    })
  })

  describe('fetch', () => {
    it('given a HashUrl, returns content download response', async () => {
      const spy: jest.SpyInstance = disableHashUrlExpiration()

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const rootFolderHashUrl = await HashUrl.fromHash(global.unitTestParams.rootFolderHash, serviceManager)

      const response = await rootFolderHashUrl.fetch()
      const content = await response.text()

      // Sample hash URL payload
      expect(content).toContain('3\nbbfbb64f45915b76df0aad9953531ed89208efa7863419828584d475c73529e5:80000000:0096011d-35ef-4993-a613-e2b7b646bbae:4:15125')

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
